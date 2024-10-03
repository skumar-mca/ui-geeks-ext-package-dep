import util from 'util';
import { ProgressLocation, window } from 'vscode';
import {
  DEPENDENCY_META,
  MSGS,
  REPORT_TEMPLATE,
  REPORT_TITLE,
  VUL_SEVERITY
} from './constants';

import {
  capitalizeFirstLetter,
  checkIcon,
  cleanVersion,
  convertObjectToArray,
  EXTENSION_STATE_MANAGER,
  eyeIcon,
  formatDate,
  formatNumber,
  gearIcon,
  getLoaderIcon,
  getPackageId,
  getPercentage,
  getScanningHTMLSmall,
  hrDivider,
  initWebRenderer,
  installIcon,
  isLowerVersion,
  logMsg,
  PILLS,
  refreshIcon,
  runNPMCommand,
  runNPMCommandAsyncAwait,
  splitButton,
  vulFixType
} from './util';

import { dirname } from 'path';
import { sendAnalyticsEvent } from './analytics';
import {
  DEPENDENCY_TYPE,
  INameVersionType,
  INPMAuditResponseType,
  INPMAuditVulnerabilityType,
  IOutdatedPackageType,
  IRecord,
  IWebRenderer
} from './common.types';
import { WebRenderer } from './web-renderer';

const SEVERITY = {
  HIGH: 1,
  MEDIUM: 2,
  NORMAL: -1
};

const CACHE_KEY = {
  VULNERABILITY: 'vul',
  ALL_VULNERABILITY: 'all_vul',
  OUTDATED_PACKAGES: 'out'
};
let webRenderer: IWebRenderer = new WebRenderer(REPORT_TEMPLATE, REPORT_TITLE);

const createHTMLReport = async (webRenderer: IWebRenderer, data: any) => {
  const { projectName, version, description } = data;

  let content = `
  <div class='flex-group mb-2'>
    <div class='content-box bg-white project-details-section'>
      <h3 class='grey-header'>Project Details</h3>

      <div class='flex-group'>
        <div class='app-details'>
            <h1 class='app-name'>
                ${projectName} 
                <span class='app-version'>(v${version})</span>
            </h1>

            ${description ? `<div class="app-desc i">${description}</div>` : ''}
        </div>

        <div class='flex flex-direction-column flex-align-end'  id='scan_info_box' style='display:none'>
            <div id='auditing_now_btn' style='display:none'>
                <div class='text-right grey-header text-sm mb-1'>
                    Auditing for vulnerabilities and outdated dependencies
                </div>
                <div class='mt-1'>
                  ${splitButton(
                    `${getLoaderIcon(18)}`,
                    `Auditing...`,
                    ``,
                    '',
                    'disable-on-browser'
                  )}
                </div>
             </div>

            <span id='audit_now_btn'>
              <div class='text-right grey-header text-sm mb-1'>
                  Audited on: <span class='scan_time' id='scan_time'></span>
              </div>

                <div class='mt-1 float-right' style='max-width:135px'>
                    ${splitButton(
                      `${refreshIcon(20)}`,
                      `Audit Now`,
                      `onclick="scanAgain()"`,
                      '',
                      'disable-on-browser'
                    )}
                </div>
            </span>
        </div>
      </div>
    </div>
  </div>

  
  <div id='summary_table' class='mb-2'></div>
  <div id='vulnerability_detail_table' style='display:none'></div>
  <div id='dependency_tables'></div>
  `;

  webRenderer.setAppMetaData({ appName: projectName, version, description });
  webRenderer.renderContent(content);
  renderDependencyTables(webRenderer, false);
};

const renderDependencyTables = async (
  webRenderer: IWebRenderer,
  forceAudit?: boolean
) => {
  const result: any = await runDependencyCommand(webRenderer);

  const { data } = result || {};
  const {
    devDependencies: dev,
    dependencies: prod,
    peerDependencies: peer
  } = data;

  const vulCache = await EXTENSION_STATE_MANAGER.getItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.VULNERABILITY}`
  );

  if (vulCache && vulCache.data && Array.isArray(vulCache.data)) {
    webRenderer.summary.vulnerabilities = vulCache.data;
  }

  const outdatedPkgCache = await EXTENSION_STATE_MANAGER.getItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.OUTDATED_PACKAGES}`
  );

  if (
    outdatedPkgCache &&
    outdatedPkgCache.data &&
    Array.isArray(outdatedPkgCache.data)
  ) {
    webRenderer.summary.outdatedPackages = outdatedPkgCache.data;
  }

  let content = ``;
  content += renderDependency(webRenderer, prod, DEPENDENCY_META.dependency, {
    vulCache,
    outdatedPkgCache
  });

  content += renderDependency(webRenderer, dev, DEPENDENCY_META.devDependency, {
    vulCache,
    outdatedPkgCache
  });

  content += renderDependency(
    webRenderer,
    peer,
    DEPENDENCY_META.peerDependencies,
    {
      vulCache,
      outdatedPkgCache
    }
  );

  webRenderer.sendMessageToUI('updateDependencyTablesContent', {
    htmlContent: content
  });

  if (!forceAudit && !vulCache) {
    webRenderer.sendMessageToUI('updateAuditingStatusContent', {
      isAuditing: true,
      loader: getScanningHTMLSmall()
    });

    runNPMAudit(webRenderer);
    getOutdatedPackages(webRenderer);
  }

  await renderSummary(webRenderer, vulCache?.timeStamp);
};

const renderPackageCount = async (webRenderer: IWebRenderer) => {
  const vulCache = await EXTENSION_STATE_MANAGER.getItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.VULNERABILITY}`
  );

  if (!vulCache || !vulCache.meta) {
    webRenderer.sendMessageToUI('updatePackagesSummaryContent', {
      htmlContent: null
    });
    return;
  }
  // const {
  //   critical = 0,
  //   high = 0,
  //   moderate = 0,
  //   low = 0,
  //   info = 0
  // } = vulCache.meta.vulnerabilities || {};

  const {
    dev = 0,
    prod = 0,
    peer = 0,
    optional = 0
  } = vulCache.meta.dependencies || {};

  const directDependencies = getDirectDependencyCount(webRenderer);

  let htmlStr = `
     <div class='content-box bg-white'>
          <h2 class="header-section">Total Dependencies (${
            prod + dev + peer + optional
          })</h2> 
          <div class="hint mt-1">Count of direct + transitive dependencies.</div>
          
          <table class='table table-striped table-bordered table-sm simple-table'> 
              <tr>
                <th class='text-align-left'>Type</th>
                <th class='text-right'>Direct <span class='text-sm text-grey'>*</span></th>
                <th class='text-right'>Transitive <span class='text-sm text-grey'>#</span></th>
                <th class='text-right'>Total</th>
              </tr>
          
              <tr>
                <td>Prod</td>
                <td class='text-right'>${directDependencies.prod}</td>
                
                <td class='text-right'>
                  ${formatNumber(prod - directDependencies.prod)}
                </td>
                
                <td class='text-right'>${formatNumber(prod)}</td>
              </tr>

              <tr>
                <td>Dev</td>
                <td class='text-right'>${directDependencies.dev}</td>

                <td class='text-right'>
                  ${formatNumber(dev - directDependencies.dev)}
                </td>

                <td class='text-right'>${formatNumber(dev)}</td>
              </tr>

          ${
            peer
              ? `
              <tr>
                <td>Peer</td>
                <td class='text-right'>${directDependencies.peer}</td>
                
                <td class='text-right'>
                    ${formatNumber(peer - directDependencies.peer)}
                </td>

                <td class='text-right'>${formatNumber(peer)}</td>
              </tr>
              `
              : ''
          }

          ${
            optional
              ? `
              <tr>
                <td>Optional</td>
                <td class='text-right'>${directDependencies.optional}</td>
                
                <td class='text-right'>
                  ${formatNumber(optional - directDependencies.optional)}
                </td>
                
                <td class='text-right'>${formatNumber(optional)}</td>
              </tr>
             `
              : ''
          }

            <tr>
                <td><b>Total</b></td>
                <td class='text-right b'>
                  ${
                    directDependencies.prod +
                    directDependencies.dev +
                    directDependencies.peer +
                    directDependencies.optional
                  }
                </td>
                <td class='text-right b'>
                  ${formatNumber(
                    prod -
                      directDependencies.prod +
                      (dev - directDependencies.dev) +
                      (peer - directDependencies.peer) +
                      (optional - directDependencies.optional)
                  )}
                </td>

                <td class='text-right b'>
                  ${formatNumber(prod + dev + peer + optional)}
                </td>
              </tr>
        </table>

        ${hrDivider}
        <div class='grey-header text-sm mb3px'>* Direct: Dependencies directly added in 'package.json'.</div>
        <div class='grey-header text-sm'># Transitive: Transitive dependencies are indirect dependencies.These are not specified directly in project's dependencies but are required by one of the direct dependencies.</div>
    </div>
      `;

  webRenderer.sendMessageToUI('updatePackagesSummaryContent', {
    htmlContent: htmlStr
  });
};

const runDependencyCommand = async (webRenderer: IWebRenderer) => {
  if (!webRenderer.pkgJSON) {
    renderDependencyError(MSGS.PACKAGE_JSON_NOT_FOUND);
    return;
  }

  const {
    name,
    version,
    description,
    devDependencies: dev,
    dependencies: prod,
    peerDependencies: peer
  } = webRenderer.pkgJSON;

  const data = {
    projectName: name,
    version,
    description,
    devDependencies: convertObjectToArray(dev, 'name', 'version'),
    dependencies: convertObjectToArray(prod, 'name', 'version'),
    peerDependencies: convertObjectToArray(peer, 'name', 'version')
  };

  return { success: true, data };
};

const renderDependency = (
  webRenderer: IWebRenderer,
  dependencyList: any,
  meta: any,
  config: {
    vulCache?: { data: Array<INPMAuditResponseType>; timeStamp?: string };
    outdatedPkgCache?: {
      data: Array<IOutdatedPackageType>;
      timeStamp?: string;
    };
  }
) => {
  if (!dependencyList || dependencyList.length === 0) {
    return '';
  }

  const installedPackages = webRenderer.packagesWithVersion;

  let vulCacheList: Array<INPMAuditResponseType> = [];
  let outdatedCacheList: Array<IOutdatedPackageType> = [];
  const { vulCache, outdatedPkgCache } = config;

  if (vulCache && vulCache.data && Array.isArray(vulCache.data)) {
    vulCacheList = vulCache.data;
  }

  if (
    outdatedPkgCache &&
    outdatedPkgCache.data &&
    Array.isArray(outdatedPkgCache.data)
  ) {
    outdatedCacheList = outdatedPkgCache.data;
  }

  let htmlStr = `
    <div class='content-box bg-white mt-2'>
      <h2 class="header-section">${meta.dependencyType} (${dependencyList.length})</h2> 
      <div class="hint mt-1">${meta.hint}</div>
        <table class='[]table table-sm table-bordered table-dep simple-table'>
          <thead>
            <tr>
                <th rowspan='2' style='width:80px'>#</th>
                <th rowspan='2' class='text-align-left'>Name</th>
                <th colspan='2' class='th-version'>Version</th>
                <th colspan='3' class='th-out'>Outdated Status</th>
            </tr>
            <tr>
                <th class='th-version' style='width:110px'>Configured</th>
                <th class='th-version' style='width:110px'>Installed</th>
                <th class='th-out' style='width:80px'>Outdated</th>
                <th class='th-out' style='width:110px'>Wanted</th>
                <th class='th-out' style='width:110px'>Latest</th>
            </tr>

          </thead>
          <tbody>`;

  let vulList = { c: 0, h: 0, m: 0, l: 0 };

  dependencyList.map((dep: any, index: number) => {
    const installedVersion = installedPackages[dep.name];
    const id = getPackageId(dep.name, installedVersion);
    const pkgId = getPackageId(dep.name);

    let vulFromCache: INPMAuditResponseType | undefined;

    if (vulCacheList) {
      vulFromCache = vulCacheList.find((itm: any) => itm.id === id);
      if (vulFromCache) {
        vulList.c += vulFromCache?.count?.c;
        vulList.h += vulFromCache?.count?.h;
        vulList.m += vulFromCache?.count?.m;
        vulList.l += vulFromCache?.count?.l;
      }
    }

    let outCache: IOutdatedPackageType | undefined = undefined;
    if (outdatedCacheList) {
      outCache = outdatedCacheList.find((itm: any) => itm.id === pkgId);
    }

    if (!vulFromCache) {
      webRenderer.scanAudit = true;
      webRenderer.sendMessageToUI('updatePackageVulInCell', {
        id,
        htmlContent: getLoaderIcon(18),
        fixAvlContent: '-'
      });
    }

    if (!outCache) {
      webRenderer.scanOutdated = true;

      webRenderer.sendMessageToUI('updateOutdatedPackage', {
        pkgId,
        htmlContent: getLoaderIcon(18),
        wantedContent: '-',
        latestContent: '-'
      });
    }

    const { outdatedNoDataHTML, isOutdatedHTML, wantedHTML, latestHTML } =
      getOutdatedCellHTML(pkgId, webRenderer, outCache);

    htmlStr = `${htmlStr}
          <tr id='${getPackageId(dep.name || '')}'
             class='${
               dep.version !== installedVersion ? 'version-change' : ''
             }' >
            <td>${index + 1}</td>
            <td class='text-align-left'>
              <a class='internal-link' href='https://www.npmjs.com/package/${
                dep.name
              }'>
              ${dep.name}
              </a>
            </td>
            <td class='td-version'>${dep.version}</td>
            <td class='td-version ${
              cleanVersion(dep.version) !== cleanVersion(installedVersion)
                ? 'changed-version'
                : ''
            }'>${installedVersion}</td>

            
            <td class='td-out' id='td_out_${pkgId}'>
              ${outdatedNoDataHTML || isOutdatedHTML}
            </td>
            <td class='td-out' id='td_out_wanted_${pkgId}'>${wantedHTML}</td>
            <td class='td-out' id='td_out_latest_${pkgId}'>${latestHTML}</td>
          </tr>`;
  });

  htmlStr = `${htmlStr}
          </tbody>
      </table>
</div>`;

  return htmlStr;
};

const renderDependencyError = (error: string) => {
  webRenderer.renderError({
    actionHeader: REPORT_TITLE,
    hasSolution: false,
    message: error || ''
  });
};

const renderAuditError = (webRenderer: IWebRenderer, error: string) => {
  const err = error || '';
  if (
    err.indexOf('Something went wrong, "npm WARN config global `--global`') > -1
  ) {
    webRenderer.renderError({
      actionHeader: REPORT_TITLE,
      hasSolution: `
      <div classs='box box-success'>
          <h3>Follow below steps to resolve the issue:</h3>

          <div class="mb-2">
              <div><b>Step 1:</b> Set Execution policy to make sure you can execute scripts:</div>
              <div class='i'>Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 2:</b> Install npm-windows-upgrade package globally</div>
              <div class='i'>npm install --global --production npm-windows-upgrade</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 3:</b> Upgrade npm to the latest version</div>
              <div class='i'>npm-windows-upgrade --npm-version latest</div>
          </div>

          <div class="mb-2">  
              <div><b>Step 4:</b> Revert the execution policy</div>
              <div class='i'>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force</div>
          </div>
      </div>`,
      message: `<div class='mb-2'>Something went wrong, but this can be fixed.</div>`
    });
    return;
  }

  webRenderer.renderError({
    actionHeader: REPORT_TITLE,
    hasSolution: false,
    message: err
  });
};

const getDirectPackages = (webRenderer: IWebRenderer) => {
  let directDependencies = {};

  if (webRenderer.pkgJSON) {
    const {
      devDependencies,
      dependencies,
      peerDependencies,
      optionalDependencies
    } = webRenderer.pkgJSON;

    directDependencies = {
      ...directDependencies,
      ...(dependencies || {})
    };
    directDependencies = {
      ...directDependencies,
      ...(devDependencies || {})
    };
    directDependencies = {
      ...directDependencies,
      ...(peerDependencies || {})
    };
    directDependencies = {
      ...directDependencies,
      ...(optionalDependencies || {})
    };
  }

  return directDependencies;
};

const getDepType = (pkgName: string) => {
  const {
    devDependencies = {},
    dependencies = {},
    peerDependencies = {},
    optionalDependencies = {}
  } = webRenderer.pkgJSON;

  if (dependencies[pkgName]) {
    return 'Prod';
  }

  if (devDependencies[pkgName]) {
    return 'Dev';
  }

  if (peerDependencies[pkgName]) {
    return 'Peer';
  }

  if (optionalDependencies[pkgName]) {
    return 'Optional';
  }

  return 'Dev';
};

const handleAuditingState = (webRenderer: IWebRenderer) => {
  if (!webRenderer.isAuditing) {
    webRenderer.sendMessageToUI('updateAuditingStatusContent', {
      isAuditing: false
    });
  }
};

const processAuditResponse = async (
  webRenderer: IWebRenderer,
  auditData: any
) => {
  const directPackages: IRecord = getDirectPackages(webRenderer);
  const installedPackages = webRenderer.packagesWithVersion;
  // Initialize an object to hold the vulnerabilities by package
  let vulnerabilitiesByPackage: Array<INPMAuditResponseType> = [];

  // Helper function to process vulnerabilities for a given package
  const processVulnerabilities = (
    packageName: string,
    via: Array<any>,
    fixAvailable: any,
    range: any
  ) => {
    let vulnerabilitiesOfPackage: Array<INPMAuditVulnerabilityType> = [];

    if (!Array.isArray(via)) {
      return;
    }

    via.forEach((vuln) => {
      // Skip strings, they are references to other vulnerabilities
      if (typeof vuln === 'string') return;

      const { name, title, severity, url, recommendation, cwe, cvss } = vuln;

      const fixType = vulFixType(fixAvailable);
      vulnerabilitiesOfPackage = [
        ...vulnerabilitiesOfPackage,
        {
          viaPackage: name,
          severity,
          title,
          url,
          fixAvailable: fixType,
          isBreakingChange: fixType === 'Breaking',
          fixPackageName: fixType === 'Breaking' ? fixAvailable.name : '',
          fixPackageVersion: fixType === 'Breaking' ? fixAvailable.version : '',
          range,
          cwe,
          cvss,
          configuredVersion: directPackages[packageName],
          installedVersion: installedPackages[packageName],
          recommendation
        }
      ];
    });

    if (vulnerabilitiesOfPackage.length > 0) {
      const vulCount = {
        c: vulnerabilitiesOfPackage.filter(
          (p: IRecord) => p.severity === VUL_SEVERITY.CRITICAL
        ).length,
        h: vulnerabilitiesOfPackage.filter(
          (p: IRecord) => p.severity === VUL_SEVERITY.HIGH
        ).length,
        m: vulnerabilitiesOfPackage.filter(
          (p: IRecord) => p.severity === VUL_SEVERITY.MODERATE
        ).length,
        l: vulnerabilitiesOfPackage.filter(
          (p: IRecord) => p.severity === VUL_SEVERITY.LOW
        ).length
      };

      const total = vulCount.c + vulCount.h + vulCount.m + vulCount.l;

      vulnerabilitiesByPackage = [
        ...vulnerabilitiesByPackage,
        {
          id: getPackageId(packageName, installedPackages[packageName]),
          packageName,
          dependencyType: getDepType(packageName),
          hasVulnerability: total > 0,
          isDirect: Boolean(directPackages[packageName]),
          count: {
            ...vulCount,
            t: total
          },
          version:
            installedPackages[packageName] || directPackages[packageName],
          vulnerabilities: vulnerabilitiesOfPackage
        }
      ];
    }
  };

  // Check for the vulnerabilities key
  if (auditData.vulnerabilities) {
    // Iterate over the vulnerabilities
    for (const [packageName, vulnerabilityDetails] of Object.entries<any>(
      auditData.vulnerabilities
    )) {
      const { via, effects, fixAvailable, range } = vulnerabilityDetails;

      // Process the vulnerabilities for the main package
      processVulnerabilities(packageName, via, fixAvailable, range);

      // Process vulnerabilities for the dependent packages
      // if (effects && Array.isArray(effects)) {
      //   effects.forEach((dependentPackage) => {
      //     processVulnerabilities(dependentPackage, via, fixAvailable, range);
      //   });
      // }
    }
  } else {
    return [];
  }

  let directPackageVulnerabilities: Array<INPMAuditResponseType> = [];

  Object.keys(directPackages).forEach((key) => {
    const installed = installedPackages[key];
    const id = getPackageId(key, installed);

    const packVulFound = vulnerabilitiesByPackage.find(
      (itm: INPMAuditResponseType) => itm.id === id
    );

    if (packVulFound) {
      directPackageVulnerabilities = [
        ...directPackageVulnerabilities,
        { ...packVulFound }
      ];
    } else {
      directPackageVulnerabilities = [
        ...directPackageVulnerabilities,
        {
          id,
          packageName: key,
          dependencyType: getDepType(key),
          hasVulnerability: false,
          count: {
            c: 0,
            h: 0,
            m: 0,
            l: 0,
            t: 0
          },
          version: installed,
          vulnerabilities: []
        }
      ];
    }
  });

  await EXTENSION_STATE_MANAGER.setItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.ALL_VULNERABILITY}`,
    {
      projectID: webRenderer.projectId,
      data: vulnerabilitiesByPackage,
      timeStamp: new Date()
    }
  );

  // const transientVulnerabilities: Array<INPMAuditResponseType> =
  //   await mapTransitiveVulnerabilities(
  //     vulnerabilitiesByPackage,
  //     [],
  //     directPackages,
  //     0
  //   );

  // await logInFile(transientVulnerabilities, webRenderer.extensionPath);

  return directPackageVulnerabilities;
};

const renderVulnerabilityTable = (
  vulnerabilities: Array<INPMAuditResponseType>,
  type: 'direct' | 'transitive'
) => {
  let htmlStr = `
          <div class='content-box bg-white'>
          <h2 class="header-section">Vulnerabilities in ${capitalizeFirstLetter(
            type
          )} Dependencies  (${vulnerabilities.length})</h2> 
          <div class="hint mt-1">Vulnerabilities found in <b>${type}</b> dependencies.</div>

          <table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th>Package</th>
                    ${type === 'transitive' ? `<th>Parent Package</th>` : ''}
                    <th>Severity</th>
                    <th>Description</th>
                    <th style='width:120px'>Range</th>
                    <th style='width:60px'>Score <span class='text-sm text-grey'>*</span></th>
                    <th>Weakness <span class='text-sm text-grey'>#</span></th>
                    <th style='width:100px'>Fix Available</th>
                </tr>
              </thead>

              <tbody>`;

  vulnerabilities.map((vulnerability: INPMAuditResponseType) => {
    if (
      vulnerability.vulnerabilities &&
      vulnerability.vulnerabilities.length > 0
    ) {
      const vulsCount = vulnerability.vulnerabilities?.length;
      vulnerability.vulnerabilities.map(
        (vul: INPMAuditVulnerabilityType, index: number) => {
          const { c, h, m, l, t } = vulnerability.count || {};
          let fixAvlCls = '';
          let fixBtnTxt = ``;
          switch (vul.fixAvailable) {
            case 'Breaking':
              fixAvlCls = 'critical';
              fixBtnTxt = splitButton(
                `${checkIcon()}`,
                `Fix`,
                `onclick="updateAllOutdatedPackages(
                                    '${vul.fixPackageName}@${vul.fixPackageVersion}', 
                                    '${webRenderer.parentPath}')"`,
                '',
                'critical sm disable-on-browser mt-1'
              );

            case 'No':
              fixAvlCls = 'critical';
              break;

            case 'Yes':
              fixAvlCls = 'green';
          }

          htmlStr += `<tr>`;

          let pkgCellContent = `
            <a 
              href='#${getPackageId(vulnerability.packageName)}' 
              class='internal-link'>
                ${vulnerability.packageName}
            </a>

            <span class='grey-header text-sm'>
                &nbsp;(v${vul.installedVersion})
            </span>`;

          pkgCellContent += `
            <div class='flex flex-gap-5 flex-justify-start mt-1 mb-1'>
            ${
              c > 0
                ? PILLS.SEVERITY.CRITICAL(c, 'C', true)
                : PILLS.GREY(c, 'C', true)
            }
            ${
              h > 0
                ? PILLS.SEVERITY.HIGH(h, 'H', true)
                : PILLS.GREY(h, 'H', true)
            }
            ${
              m > 0
                ? PILLS.SEVERITY.MODERATE(m, 'M', true)
                : PILLS.GREY(m, 'M', true)
            }
            ${
              l > 0
                ? PILLS.SEVERITY.LOW(l, 'L', true)
                : PILLS.GREY(l, 'L', true)
            }
            `;

          pkgCellContent += `</div>
        `;

          const parentDepFindBtn = `<div class='find-direct-pgk'>
              <div id='dp_${getPackageId(vulnerability.packageName)}'> 
                  <button  
                    class='direct-pgk-btn flex-justify-center w-100' 
                    onclick="findDirectPackage('${vulnerability.packageName}')">
                      ${eyeIcon(18)} Find
                  </button>
                </div>
              </div>`;

          if (vulsCount > 1) {
            if (index == 0) {
              htmlStr += `
                  <td rowspan='${vulsCount}'>${pkgCellContent}</td>`;

              if (type === 'transitive') {
                htmlStr += `
                    <td rowspan='${vulsCount}'>${parentDepFindBtn}</td>`;
              }
            }
          } else {
            htmlStr += `<td>${pkgCellContent}</td>`;

            if (type === 'transitive') {
              htmlStr += `<td>${parentDepFindBtn}</td>`;
            }
          }

          htmlStr += `
          <td class='b text-${vul.severity}'>
                ${capitalizeFirstLetter(vul.severity)}
          </td>

          <td>
            <a href='${vul.url}' target='_blank' class='internal-link'>
              ${vul.title}
            </a>
          </td>

          <td>${vul.range}</td>
          <td>${vul.cvss?.score}</td>
          <td>
          
          ${(vul.cwe || [])
            .map(
              (cwe: string) => `<a href='https://github.com/advisories?query=${(
                cwe || ''
              )
                .replace('-', ':')
                .toLocaleLowerCase()}' target='_blank' class='internal-link'>
                      ${cwe}
                    </a>`
            )
            .join(', ')}
          
          </td>
          <td>
           <div class='b text-${fixAvlCls}'>
                ${vul.fixAvailable}
                ${vul.fixAvailable === 'Breaking' ? fixBtnTxt : ''}
            </div>
          </td>

          

      </tr>`;
        }
      );
    }
  });

  htmlStr += `</tbody>
            </table>`;

  htmlStr += `
            ${hrDivider}
            <div class='grey-header text-sm mb3px'>* Score: This CVSS score calculates overall vulnerability severity from 0 to 10 and is based on the Common Vulnerability Scoring System (CVSS).</div>
            <div class='grey-header text-sm'>* Weakness: Common Weakness Enumeration (CWE) is a list of software and hardware weaknesses.</div>
        </div>`;

  return htmlStr;
};

const renderVulnerabilityDetails = async (webRenderer: IWebRenderer) => {
  const allVulCache = await EXTENSION_STATE_MANAGER.getItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.ALL_VULNERABILITY}`
  );

  if (!allVulCache || !allVulCache.data) {
    webRenderer.sendMessageToUI('vulnerability_detail_table', {
      htmlContent: null
    });
    return;
  }

  const vulnerabilities = allVulCache.data;

  const initCount = { c: 0, h: 0, m: 0, l: 0, t: 0 };

  let count = {
    Prod: {
      ...initCount
    },
    Dev: {
      ...initCount
    },
    Peer: {
      ...initCount
    },
    Optional: {
      ...initCount
    }
  };

  const directVulnerabilities = vulnerabilities.filter(
    (vul: INPMAuditResponseType) => vul.isDirect
  );

  const transientVulnerabilities = vulnerabilities.filter(
    (vul: INPMAuditResponseType) => !vul.isDirect
  );

  vulnerabilities.map((itm: INPMAuditResponseType) => {
    if (itm.count) {
      count[itm.dependencyType].c += itm.count.c;
      count[itm.dependencyType].h += itm.count.h;
      count[itm.dependencyType].m += itm.count.m;
      count[itm.dependencyType].l += itm.count.l;
      count[itm.dependencyType].t +=
        itm.count.c + itm.count.h + itm.count.m + itm.count.l;
    }
  });

  const totalVulnerabilityCount =
    count['Prod']?.t +
    count['Dev']?.t +
    count['Peer']?.t +
    count['Optional']?.t;

  const hasVulnerability = totalVulnerabilityCount > 0;

  if (!hasVulnerability) {
    webRenderer.sendMessageToUI('vulnerabilityDetailTableContent', {
      htmlContent: null
    });
    return;
  }

  let htmlStr = `<div class='flex-group flex-direction-column flex-gap-2 w-100'>`;

  if (directVulnerabilities.length > 0) {
    htmlStr += renderVulnerabilityTable(directVulnerabilities, 'direct');
  }

  if (transientVulnerabilities.length > 0) {
    htmlStr += renderVulnerabilityTable(transientVulnerabilities, 'transitive');
  }

  htmlStr += '</div>';

  webRenderer.sendMessageToUI('vulnerabilityDetailTableContent', {
    htmlContent: htmlStr
  });
};

const renderVulnerabilitySummary = async (webRenderer: IWebRenderer) => {
  renderVulnerabilityDetails(webRenderer);

  const renderVulRow = (
    dependencyType: 'Direct' | 'Transitive' | 'Total',
    vulList: Array<INPMAuditResponseType>
  ) => {
    let c = 0;
    let h = 0;
    let m = 0;
    let l = 0;
    vulList.map((vul: INPMAuditResponseType) => {
      c += (vul.vulnerabilities || []).filter(
        (itm: INPMAuditVulnerabilityType) => itm.severity === 'critical'
      ).length;

      h += (vul.vulnerabilities || []).filter(
        (itm: INPMAuditVulnerabilityType) => itm.severity === 'high'
      ).length;

      m += (vul.vulnerabilities || []).filter(
        (itm: INPMAuditVulnerabilityType) => itm.severity === 'moderate'
      ).length;

      l += (vul.vulnerabilities || []).filter(
        (itm: INPMAuditVulnerabilityType) => itm.severity === 'low'
      ).length;
    });

    const t = c + h + m + l;

    return `<tr>
              <td>${dependencyType}
              ${
                dependencyType === 'Total'
                  ? `<div class='percentage'>%</div>`
                  : ''
              }
              </td>
              <td class='b text-right'>
                <div class='b text-critical'>${c}</div>
                 ${
                   dependencyType === 'Total'
                     ? `<div class='percentage'>${getPercentage(c, t)}</div>`
                     : ''
                 }
              </td>

              <td class='b text-right'>
                <div class='b text-high'>${h}</div>
                ${
                  dependencyType === 'Total'
                    ? `<div class='percentage'>${getPercentage(h, t)}</div>`
                    : ''
                }
              </td>

              <td class='b text-right'>
                <div class='b text-moderate'>${m}</div>
                ${
                  dependencyType === 'Total'
                    ? `<div class='percentage'>${getPercentage(m, t)}</div>`
                    : ''
                }
              </td>
              <td class='b text-right'>
                <div class='b text-low'>${l}</div>
                ${
                  dependencyType === 'Total'
                    ? `<div class='percentage'>${getPercentage(l, t)}</div>`
                    : ''
                }
              </td>
              <td class='b text-right text-grey'>${t}
              ${
                dependencyType === 'Total'
                  ? `<div class='percentage'>100%</div>`
                  : ''
              }
              </td>
            </tr>`;
  };

  const allVulCache = await EXTENSION_STATE_MANAGER.getItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.ALL_VULNERABILITY}`
  );

  if (!allVulCache || !allVulCache.data) {
    webRenderer.sendMessageToUI('updateVulnerabilitySummaryContent', {
      htmlContent: null
    });
    return;
  }

  const vulnerabilities = allVulCache.data;

  if (vulnerabilities.length === 0) {
    webRenderer.sendMessageToUI('updateVulnerabilitySummaryContent', {
      htmlContent: null
    });
    return;
  }

  const directVulnerabilities = vulnerabilities.filter(
    (vul: INPMAuditResponseType) => vul.isDirect
  );

  const transientVulnerabilities = vulnerabilities.filter(
    (vul: INPMAuditResponseType) => !vul.isDirect
  );

  const totalDirectVulCount = directVulnerabilities.reduce(
    (acc: number, val: INPMAuditResponseType) => acc + val.count.t,
    0
  );

  const totalTransitiveVulCount = transientVulnerabilities.reduce(
    (acc: number, val: INPMAuditResponseType) => acc + val.count.t,
    0
  );
  const hasVulnerability = totalDirectVulCount + totalTransitiveVulCount > 0;

  let htmlStr = `<div class='content-box bg-white'>
          <h2 class="header-section">Vulnerabilities</h2> 
          <div class="hint mt-1">Count of vulnerabilities in dependencies.</div>

          ${
            hasVulnerability
              ? `<table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th style="max-width: 45px;">Type</th>
                    <th class='text-right text-critical'>Critical</th>
                    <th class='text-right text-high'>High</th>
                    <th class='text-right text-moderate'>Moderate</th>
                    <th class='text-right text-low'>Low</th>
                    <th class='text-right text-grey'>Total</th>
                </tr>
              </thead>

              <tbody>
                ${renderVulRow('Direct', directVulnerabilities)}
                ${renderVulRow('Transitive', transientVulnerabilities)}
                ${renderVulRow('Total', vulnerabilities)}
                
              </tbody>
            </table>

            <div class='flex-direction-column  mt-2 actions-box float-right flex-grow-1'>
              <div class='flex flex-justify-end flex-gap-1'>
                ${splitButton(
                  `${gearIcon()}`,
                  `Auto Fix Vulnerabilities`,
                  `onclick="fixAutoFixableVulnerabilities('${webRenderer.parentPath}')"`,
                  '',
                  'disable-on-browser'
                )}
              </div>
               <div class='text-sm text-right'>This will fix vulnerabilities for dependencies having any fix available.</div>
            </div>
              `
              : `
                <div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no vulnerabilities.</div>
                </div>
              `
          }
        </div>`;

  webRenderer.sendMessageToUI('updateVulnerabilitySummaryContent', {
    htmlContent: htmlStr
  });
};

const renderOutdatedPackageSummary = (webRenderer: IWebRenderer) => {
  const renderOutdatedRow = (
    dependencyType: DEPENDENCY_TYPE,
    count: IRecord
  ) => {
    if (count[dependencyType].o_c === 0 && count[dependencyType].o_m === 0) {
      return '';
    }

    const countVal = count[dependencyType] || {};

    return `<tr>
              <td>${dependencyType}</td>
              <td class='b text-right text-high'>${countVal.o_c}</td>
              <td class='b text-right text-moderate'>${countVal.o_m}</td>
              <td class='b text-right text-grey'>
                  ${countVal.o_c + countVal.o_m}
              </td>
            </tr>`;
  };

  const { outdatedPackages } = webRenderer.summary || {};

  if (outdatedPackages.length === 0) {
    webRenderer.sendMessageToUI('updateOutdatedSummaryContent', {
      htmlContent: null
    });
    return;
  }

  const initCount = { o_c: 0, o_m: 0 };

  let count = {
    Prod: {
      ...initCount
    },
    Dev: {
      ...initCount
    },
    Peer: {
      ...initCount
    },
    Optional: {
      ...initCount
    }
  };

  let wantedVersions: Array<string> = [];
  let latestVersions: Array<string> = [];

  outdatedPackages.map((itm: IOutdatedPackageType) => {
    if (itm.severity !== SEVERITY.NORMAL) {
      wantedVersions = [...wantedVersions, `${itm.packageName}@${itm.wanted}`];
      latestVersions = [...latestVersions, `${itm.packageName}@${itm.latest}`];

      if (itm.severity === SEVERITY.HIGH) {
        count[itm.dependencyType].o_c += 1;
      } else if (itm.severity === SEVERITY.MEDIUM) {
        count[itm.dependencyType].o_m += 1;
      }
    }
  });

  const hasOutdatedPackages =
    count['Prod']?.o_c +
      count['Prod']?.o_m +
      count['Dev']?.o_c +
      count['Dev']?.o_m +
      count['Peer']?.o_c +
      count['Peer']?.o_m +
      count['Optional']?.o_c +
      count['Optional']?.o_m >
    0;

  let htmlStr = `<div class='content-box bg-white'>
            <h2 class="header-section">Outdated Dependencies</h2> 
            <div class="hint mt-1">Count of outdated dependencies.</div>

            ${
              hasOutdatedPackages
                ? `<table class='table table-sm table-bordered simple-table'>
              <thead>
                <tr>
                    <th style="max-width: 45px;">Type</th>
                    <th class='text-high text-right'>High</th>
                    <th class='text-moderate text-right'>Moderate</th>
                    <th class='text-grey text-right'>Total</th>
                </tr>
              </thead>

              <tbody>
                ${renderOutdatedRow('Prod', count)}
                ${renderOutdatedRow('Dev', count)}
                ${renderOutdatedRow('Peer', count)}
                ${renderOutdatedRow('Optional', count)}
              </tbody>
            </table>
            ${
              wantedVersions.length > 0 || latestVersions.length > 0
                ? `<div class='flex-direction-column mt-2 actions-box float-right flex-grow-1'>
                     <div class='flex flex-justify-end flex-gap-1'>
                        ${
                          wantedVersions.length > 0
                            ? splitButton(
                                `${checkIcon()}`,
                                `Install &nbsp;<b>'Wanted'</b>&nbsp;`,
                                `onclick="updateAllOutdatedPackages(
                                    '${wantedVersions.join(' ')}', 
                                    '${webRenderer.parentPath}')"`,
                                '',
                                'disable-on-browser'
                              )
                            : ''
                        }    

                        ${
                          latestVersions.length > 0
                            ? splitButton(
                                `${checkIcon()}`,
                                `Install &nbsp;<b>'Latest'</b>&nbsp;`,
                                `onclick="updateAllOutdatedPackages(
                                    '${latestVersions.join(' ')}', 
                                    '${webRenderer.parentPath}')"`,
                                '',
                                'disable-on-browser'
                              )
                            : ''
                        }    
                      </div>

                      <div class='text-sm text-right'>Click above buttons to install Wanted/Latest versions of all outdated dependencies.</div>
                   </div>

                      
                      `
                : ''
            }`
                : `<div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no outdated dependencies.</div>
                 </div>`
            }
                
      </div>`;

  webRenderer.sendMessageToUI('updateOutdatedSummaryContent', {
    htmlContent: htmlStr
  });
};

const renderSummary = async (
  webRenderer: IWebRenderer,
  timeStamp: string | Date
) => {
  const { outdatedPackages, vulnerabilities } = webRenderer.summary || {};

  if (outdatedPackages.length === 0 && vulnerabilities.length === 0) {
    webRenderer.sendMessageToUI('updateSummaryContent', {
      htmlContent: ''
    });
    return;
  }

  let htmlStr = `
    <div class='flex-group summary'>
      <div id='vulnerability_summary' class='flex-grow-1'></div>
      <div id='packages_summary' style='max-width:33%'></div>
      <div id='outdated_summary' class='flex-grow-1'></div>
  </div>
  `;

  webRenderer.sendMessageToUI('updateSummaryContent', {
    htmlContent: htmlStr,
    scanTime: formatDate(timeStamp + '')
  });

  renderOutdatedPackageSummary(webRenderer);
  renderVulnerabilitySummary(webRenderer);
  renderPackageCount(webRenderer);
};

const vulnerabilityColumn = (
  id: string,
  vulObj?: INPMAuditResponseType,
  count?: IRecord
) => {
  if (!vulObj) {
    return {
      vulNoDataHTML: getLoaderIcon(18),
      vulCountHTML: '-',
      fixAvlHTML: '-'
    };
  }

  const vulCounts = count || vulObj.count;
  let vulBtnHtml = `
    <div class='flex flex-gap-5 flex-justify-start'>`;

  // if (!vulObj.hasVulnerability) {
  //   vulBtnHtml += `${PILLS.SEVERITY.NO_VULNERABILITY}`;
  // } else

  vulBtnHtml += `
        ${
          vulCounts.c > 0
            ? PILLS.SEVERITY.CRITICAL(vulCounts.c, 'C', true)
            : PILLS.GREY(vulCounts.c, 'C', true)
        }
        ${
          vulCounts.h > 0
            ? PILLS.SEVERITY.HIGH(vulCounts.h, 'H', true)
            : PILLS.GREY(vulCounts.h, 'H', true)
        }
        ${
          vulCounts.m > 0
            ? PILLS.SEVERITY.MODERATE(vulCounts.m, 'M', true)
            : PILLS.GREY(vulCounts.m, 'M', true)
        }
        ${
          vulCounts.l > 0
            ? PILLS.SEVERITY.LOW(vulCounts.l, 'L', true)
            : PILLS.GREY(vulCounts.l, 'L', true)
        }
        `;

  vulBtnHtml += `</div>
    `;

  const vulList = vulObj.vulnerabilities || [];
  const fixAvailableCount = vulList.filter(
    (pck: INPMAuditVulnerabilityType) => pck.fixAvailable === 'Yes'
  ).length;

  const noFixAvailableCount = vulList.filter(
    (pck: INPMAuditVulnerabilityType) => pck.fixAvailable === 'No'
  ).length;

  const breakingCount = vulList.filter(
    (pck: INPMAuditVulnerabilityType) => pck.fixAvailable === 'Breaking'
  ).length;

  const fixAvlHTML = `<div class='flex flex-gap-5 flex-justify-start'>
   ${
     fixAvailableCount > 0
       ? PILLS.SUCCESS(
           fixAvailableCount,
           'Yes',
           true,
           'Auto fix available for these dependencies.'
         )
       : PILLS.GREY(fixAvailableCount, 'Yes', true)
   }
      ${
        noFixAvailableCount > 0
          ? PILLS.SEVERITY.MODERATE(
              noFixAvailableCount,
              'No',
              true,
              'No fix available for these dependencies.'
            )
          : PILLS.GREY(noFixAvailableCount, 'No', true)
      }

      ${
        breakingCount > 0
          ? PILLS.SEVERITY.CRITICAL(
              breakingCount,
              'Breaking',
              true,
              'Fix is available, but will result in code break.'
            )
          : PILLS.GREY(breakingCount, 'Breaking', true)
      }
  </div>`;

  return {
    vulNoDataHTML: null,
    vulCountHTML: vulBtnHtml,
    fixAvlHTML: fixAvlHTML
  };
};

const getDirectDependencyCount = (webRenderer: IWebRenderer) => {
  const directDependencies = {
    dev: 0,
    prod: 0,
    peer: 0,
    optional: 0
  };

  if (webRenderer.pkgJSON) {
    const {
      devDependencies,
      dependencies,
      peerDependencies,
      optionalDependencies
    } = webRenderer.pkgJSON;
    directDependencies.dev = Object.keys(devDependencies || {}).length;
    directDependencies.prod = Object.keys(dependencies || {}).length;
    directDependencies.peer = Object.keys(peerDependencies || {}).length;
    directDependencies.optional = Object.keys(
      optionalDependencies || {}
    ).length;
  }

  return directDependencies;
};

const renderNPMAuditResponse = async (webRenderer: IWebRenderer, data: any) => {
  if (Object.keys(data).includes('error')) {
    const errorSummary = data['error'];
    logMsg(
      `Error auditing dependencies [${errorSummary.code || 'ERROR'}:${
        errorSummary.summary || 'Error running npm auditing.'
      }]`,
      true
    );
    return;
  }

  const directPackageVulnerabilities: Array<INPMAuditResponseType> =
    await processAuditResponse(webRenderer, data);

  (directPackageVulnerabilities || []).map((itm: INPMAuditResponseType) => {
    const { vulNoDataHTML, vulCountHTML, fixAvlHTML } = vulnerabilityColumn(
      itm.id,
      itm,
      itm?.count
    );

    webRenderer.sendMessageToUI('updatePackageVulInCell', {
      id: itm.id,
      htmlContent: vulNoDataHTML || vulCountHTML,
      fixAvlContent: fixAvlHTML
    });
  });

  webRenderer.summary.vulnerabilities = directPackageVulnerabilities;

  await EXTENSION_STATE_MANAGER.setItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.VULNERABILITY}`,
    {
      projectID: webRenderer.projectId,
      data: directPackageVulnerabilities,
      meta: data?.metadata,
      timeStamp: new Date()
    }
  );

  await renderSummary(webRenderer, new Date());
};

const getOutdatedCellHTML = (
  id: string,
  webRenderer: IWebRenderer,
  itm?: IOutdatedPackageType
) => {
  if (!itm) {
    return {
      outdatedNoDataHTML: getLoaderIcon(18),
      isOutdatedHTML: `<div class='text-green'>No</div>`,
      wantedHTML: '-',
      latestHTML: '-'
    };
  }

  const severityClass =
    itm.severity === SEVERITY.HIGH ? 'text-danger' : 'text-warning';

  return {
    outdatedNoDataHTML: null,
    isOutdatedHTML:
      itm.severity === SEVERITY.NORMAL
        ? `<div class='text-green'>No</div>`
        : `<div class='${severityClass}'>Yes</div>`,
    wantedHTML:
      itm.severity !== SEVERITY.NORMAL && itm.wanted
        ? splitButton(
            `${installIcon(16)}`,
            itm.wanted,
            `onclick="updatePackage('${itm.packageName}',
                                    '${itm.wanted}',
                                    '${webRenderer.parentPath}')"`,
            '',
            'grey sm disable-on-browser'
          )
        : '-',
    latestHTML:
      itm.severity !== SEVERITY.NORMAL && itm.latest
        ? splitButton(
            `${installIcon(16)}`,
            itm.latest,
            `onclick="updatePackage('${itm.packageName}',
                                    '${itm.latest}',
                                    '${webRenderer.parentPath}')"`,
            '',
            'grey sm disable-on-browser'
          )
        : '-'
  };
};

const getOutdatedSeverity = (
  configuredVersion: string,
  installedVersion: string
) => {
  const ignoreVersions = ['*', 'latest'];

  if (
    !installedVersion ||
    ignoreVersions.includes(installedVersion) ||
    ignoreVersions.includes(configuredVersion)
  ) {
    return SEVERITY.NORMAL;
  }

  const hasLowerInstalledVersion = isLowerVersion(
    cleanVersion(installedVersion),
    configuredVersion
  );

  if (hasLowerInstalledVersion === -1) {
    return SEVERITY.NORMAL;
  }

  return hasLowerInstalledVersion ? SEVERITY.HIGH : SEVERITY.MEDIUM;
};

const renderOutdatedPackages = async (
  webRenderer: IWebRenderer,
  data: IRecord
) => {
  if (!data || Object.keys(data).length === 0) {
    webRenderer.sendMessageToUI('outdatedPackageContent', {
      htmlContent: '',
      Count: 0,
      summaryTableData: `<div class='flex-1 box-1'>
              <div class="content">
                  <div class="content-box box box-success-alt">
                    <div class="field-label">Great</div>
                    <div class="field-value">There are no outdated dependencies.</div>
                 </div>
                </div>
            </div>`
    });

    return;
  }

  if (Object.keys(data).includes('error')) {
    const errorSummary = data['error'];

    const errorSummaryContent = `
            <div class='flex-1'>
                <div class="content">
                  <div class="content-box box box-critical">
                    <div class="field-label">Error finding outdated dependencies.</div>
                    <div class="field-value">
                      ${errorSummary.code || 'ERROR'}:
                       ${
                         errorSummary.summary ||
                         'Error running outdated dependencies.'
                       }
                      </div>
                  </div>
                </div>
            </div>`;

    webRenderer.sendMessageToUI('outdatedPackageContent', {
      htmlContent: null,
      Count: 0,
      summaryTableData: errorSummaryContent
    });

    return;
  }

  const directPackages: IRecord = getDirectPackages(webRenderer);
  let outdatedList: Array<IOutdatedPackageType> = [];
  for (const [key, itm] of Object.entries<any>(data)) {
    outdatedList = [
      ...outdatedList,
      {
        packageName: key,
        version: directPackages[key],
        id: getPackageId(key),
        ...itm
      }
    ];
  }

  const installedPackages = webRenderer.packagesWithVersion;
  let listOfPackages: Array<IOutdatedPackageType> = [];

  Object.keys(directPackages).forEach((key: string) => {
    const pkgId = getPackageId(key);
    const version = directPackages[key];
    const installedVersion = installedPackages[key];

    const found = outdatedList.find(
      (itm: IOutdatedPackageType) => itm.id === pkgId
    );

    let definedProps: IOutdatedPackageType = {
      packageName: key,
      version: version,
      id: pkgId,
      current: installedVersion,
      wanted: '-',
      dependent: '-',
      latest: '-',
      location: '-',
      severity: SEVERITY.NORMAL,
      dependencyType: getDepType(key)
    };

    if (found) {
      definedProps = {
        ...definedProps,
        ...found,
        current: installedVersion,
        wanted: found.wanted,
        latest: found.latest,
        severity: getOutdatedSeverity(found.wanted, installedVersion)
      };
    }

    const { isOutdatedHTML, wantedHTML, latestHTML } = getOutdatedCellHTML(
      pkgId,
      webRenderer,
      definedProps
    );

    webRenderer.sendMessageToUI('updateOutdatedPackage', {
      id: pkgId,
      htmlContent: isOutdatedHTML,
      wantedContent: wantedHTML,
      latestContent: latestHTML
    });

    listOfPackages = [...listOfPackages, definedProps];
  });

  webRenderer.summary.outdatedPackages = listOfPackages;
  await renderSummary(webRenderer, new Date());

  if (listOfPackages.length > 0) {
    await EXTENSION_STATE_MANAGER.setItem(
      webRenderer.context,
      `${webRenderer.projectId}_${CACHE_KEY.OUTDATED_PACKAGES}`,
      {
        projectID: webRenderer.projectId,
        data: listOfPackages,
        timeStamp: new Date()
      }
    );
  }
};

const getOutdatedPackages = async (webRenderer: IWebRenderer) => {
  if (!webRenderer.packageLockFile) {
    renderAuditError(webRenderer, MSGS.PACKAGE_LOCK_JSON_NOT_FOUND);
    webRenderer.auditingOutdatedPackages = false;
    return;
  }

  runNPMCommand(
    webRenderer,
    `npm outdated --json  --prefix `,
    (success: boolean, resp: any) => {
      webRenderer.auditingOutdatedPackages = false;
      handleAuditingState(webRenderer);
      if (success) {
        renderOutdatedPackages(webRenderer, JSON.parse(resp.stdout));
        return;
      }
      renderOutdatedPackages(webRenderer, JSON.parse(resp.stderr));
    }
  );
};

const runNPMAudit = async (webRenderer: IWebRenderer) => {
  if (!webRenderer.packageLockFile) {
    renderAuditError(webRenderer, MSGS.PACKAGE_LOCK_JSON_NOT_FOUND);
    return;
  }

  const exec = util.promisify(require('child_process').exec);

  try {
    exec(
      'npm audit --recursive --json --prefix ' +
        (process.platform !== 'win32' ? '/' : '') +
        dirname(webRenderer.packageLockFile.uri.path.substring(1)),
      { windowsHide: true }
    )
      .then((result: any) => {
        renderNPMAuditResponse(webRenderer, JSON.parse(result.stdout));
      })
      .catch((e: any) => {
        renderNPMAuditResponse(webRenderer, JSON.parse(e.stdout));
      })
      .finally(() => {
        webRenderer.auditingVulnerabilities = false;
        handleAuditingState(webRenderer);
      });
  } catch (output) {
    webRenderer.auditingVulnerabilities = false;
    handleAuditingState(webRenderer);
    webRenderer.sendMessageToUI('npmAuditContent', {
      htmlContent: 'Error while processing...',
      Count: '',
      hideSection: true
    });
  }
};

export const dependencyCommand = async (context: any, uri: any) => {
  webRenderer = await initWebRenderer(webRenderer, context, uri);
  webRenderer.renderLoader();

  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: `Reading ${REPORT_TITLE}...`,
      cancellable: false
    },
    async () => {
      const result = await runDependencyCommand(webRenderer);

      if (result) {
        if (!result.success) {
          renderDependencyError(JSON.stringify(result.data));
          return;
        }

        createHTMLReport(webRenderer, result.data);
      }
    }
  );

  sendAnalyticsEvent(webRenderer, 'DEPENDENCY', 'VIEWED_DEPENDENCY_PAGE');
};

const clearCache = async (webRenderer: IWebRenderer) => {
  await EXTENSION_STATE_MANAGER.clearItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.VULNERABILITY}`
  );

  await EXTENSION_STATE_MANAGER.clearItem(
    webRenderer.context,
    `${webRenderer.projectId}_${CACHE_KEY.OUTDATED_PACKAGES}`
  );
};

export const scanAgain = async (webRenderer: IWebRenderer) => {
  webRenderer.summary.outdatedPackages = [];
  webRenderer.summary.vulnerabilities = [];
  webRenderer.auditingOutdatedPackages = true;
  webRenderer.auditingVulnerabilities = true;

  await clearCache(webRenderer);

  webRenderer.sendMessageToUI('updateAuditingStatusContent', {
    isAuditing: true,
    loader: getScanningHTMLSmall()
  });

  renderDependencyTables(webRenderer, true);

  runNPMAudit(webRenderer);
  getOutdatedPackages(webRenderer);
  sendAnalyticsEvent(webRenderer, 'DEPENDENCY', 'AUDITED', 'SCAN_AGAIN');
};

export const findDirectPackageOfChildPackage = async (
  webRenderer: IWebRenderer,
  packageName: string
) => {
  const id = getPackageId(packageName);
  webRenderer.sendMessageToUI('updateDirectPackageContent', {
    id,
    htmlContent: `<div class='find-direct-pgk' >
                      <button class='direct-pgk-btn flex-justify-center w-100'>
                          ${getLoaderIcon(18)}
                    </button>
                  </div>`
  });

  const { success, resp } = await runNPMCommandAsyncAwait(
    webRenderer,
    `npm list ${packageName} --json `
  );

  let parentPackages: Array<INameVersionType> = [];
  if (success && resp) {
    Object.keys(resp.dependencies || {}).map((key: string) => {
      parentPackages = [
        ...parentPackages,
        {
          packageName: key,
          version: resp.dependencies[key].version
        }
      ];
    });

    if (parentPackages.length === 0) {
      webRenderer.sendMessageToUI('updateDirectPackageContent', {
        id,
        htmlContent: `<div class='text-warning'>No found.</div>`
      });
      return;
    }

    webRenderer.sendMessageToUI('updateDirectPackageContent', {
      id,
      htmlContent: `<div class='flex flex-gap-5 flex-justify-start text-sm'>
        ${parentPackages
          .map((itm: INameVersionType) => itm.packageName)
          .join(', ')}
        </div>`
    });
  } else {
    webRenderer.sendMessageToUI('updateDirectPackageContent', {
      id,
      htmlContent: `<div class='text-danger'>Error</div>`
    });
  }

  sendAnalyticsEvent(
    webRenderer,
    'DEPENDENCY',
    'FIND_PARENT_PACKAGE',
    packageName
  );
};
