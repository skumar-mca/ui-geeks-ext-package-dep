import fs from 'fs';
import path from 'path';
import semver from 'semver';
import util from 'util';
import vscode, { commands, window, workspace } from 'vscode';
import { IRecord, IWebRenderer } from './common.types';
import { LOCAL_STORAGE, SEVERITY_TYPE } from './constants';

export const logMsg = (msg: any, inModal: boolean) => {
  msg = typeof msg === 'string' ? msg : JSON.stringify(msg);
  window.showInformationMessage(msg, {
    modal: inModal || false
  });
};

export const logErrorMsg = (msg: string, inModal: boolean) => {
  window.showErrorMessage(msg, { modal: inModal || false });
};

export const logInFile = async (msg: any, extensionPath: string) => {
  if (!msg) {
    return;
  }

  msg = typeof msg === 'string' ? msg : JSON.stringify(msg);

  const filePath = path.join(
    extensionPath,
    `temp-log-file${new Date().getMilliseconds()}.txt`
  );
  fs.writeFileSync(filePath, msg);
  const document = await vscode.workspace.openTextDocument(filePath);
  await vscode.window.showTextDocument(document);
};

export const findFileInParentFolders = (
  filePath: string,
  currentFolder: string
): any => {
  const targetPath = path.join(currentFolder, filePath);
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  const parentFolderPath = path.dirname(currentFolder);
  if (parentFolderPath === currentFolder) {
    // Reached the root directory
    return undefined;
  }
  return findFileInParentFolders(filePath, parentFolderPath);
};

export const findFile = async (fileName: string, parentFolder: string) => {
  const foundFilePath = findFileInParentFolders(fileName, parentFolder);
  if (foundFilePath) {
    return await workspace.openTextDocument(foundFilePath);
  }

  return null;
};

export const getFileData = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    return null;
  }
};

export const getFileContent = async (file: IRecord) => {
  if (!file) {
    return '';
  }

  return await file.getText();
};

export const openFile = async (fileUri: IRecord) => {
  const doc = await workspace.openTextDocument(fileUri);
  await window.showTextDocument(doc, { preview: false });
};

export const registerCommand = (command: string, handlerMethod: any) => {
  return commands.registerCommand(command, async () => {
    await handlerMethod();
  });
};

export const isDarkTheme = () => {
  return window.activeColorTheme.kind === 2;
};

export const sortByKey = (list: Array<any>, key: string) => {
  if (!list || !key) {
    return list;
  }

  return list.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};

export const convertObjectToArray = (
  obj: IRecord,
  keyAttribute: string,
  valueAttribute: string
) => {
  if (!obj || Object.keys(obj).length === 0) {
    return [];
  }

  return Object.keys(obj).map((key) => {
    return { [keyAttribute]: key, [valueAttribute]: obj[key] };
  });
};

export const getExtensionFileSrc = (
  extensionPath: string,
  panel: IRecord,
  resourcePath: string
) => {
  if (!extensionPath || !panel || !resourcePath) {
    return '';
  }

  const resPath = path.resolve(extensionPath, resourcePath);
  return panel.webview.asWebviewUri(vscode.Uri.file(resPath));
};

export const getPackageJSON = async (file: IRecord) => {
  const content = await getFileContent(file);
  if (!content) {
    return null;
  }

  return JSON.parse(content);
};

export const extractPackages = (
  dependencies: IRecord,
  packages: IRecord = {}
) => {
  for (const [name, info] of Object.entries<any>(dependencies)) {
    let pkgName: string | undefined = name;

    if (name.indexOf('@') > -1) {
      pkgName = `@${name.split('@')[1]}`;
    } else {
      pkgName = name.split('/').pop();
    }

    packages[pkgName || ''] = info?.version || info;

    if (info.dependencies) {
      extractPackages(info.dependencies, packages);
    }
  }
  return packages;
};

export const initWebRenderer = async (
  webRenderer: IWebRenderer,
  context: IRecord,
  uri: IRecord,
  pckName?: string
) => {
  if (webRenderer.initialized) {
    webRenderer.pckName = pckName;
    return webRenderer;
  }

  webRenderer.summary = {
    outdatedPackages: [],
    vulnerabilities: []
  };

  webRenderer.initialized = true;
  const parentPath = path.dirname(uri.fsPath);

  await webRenderer.init(context);

  webRenderer.pckName = pckName;

  webRenderer.packageLockFile = await findFile('package-lock.json', parentPath);

  webRenderer.pkgJSON = await getPackageJSON(
    (await findFile('package.json', parentPath)) || {}
  );

  const { name, version } = webRenderer.pkgJSON;

  webRenderer.projectId = `${name}_${version}`;
  webRenderer.parentPath = path.dirname(
    webRenderer.packageLockFile?.uri?.path.substring(1)
  );

  webRenderer.extensionPath = context.extensionPath;
  webRenderer.uri = uri;

  let packageLockContent = await getPackageJSON(
    (await findFile('package-lock.json', parentPath)) || {}
  );

  if (packageLockContent) {
    webRenderer.packagesWithVersion = extractPackages(
      packageLockContent.packages
    );
  }
  return webRenderer;
};

export const gearIcon = (
  size?: number
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size || 16}" height="${
  size || 16
}" fill="currentColor" class="bi bi-gear-wide-connected" viewBox="0 0 16 16">
  <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
</svg>`;

export const checkIcon = (
  size?: number
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size || 16}" height="${
  size || 16
}" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
</svg>`;

export const refreshIcon = (width?: number, height?: number) => `
    <div style="width: ${width || '16'}px; height: ${height || '16'}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
        </svg>
  </div>`;

export const getLoaderIcon = (width?: number, height?: number) => `
  <div class='small-loader-wrapper'>
    <div class="loader-small-flat" 
          style="width: ${width || '16'}px; height: ${height || '16'}px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
          <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9"/>
          <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z"/>
        </svg>
    </div>
  </div>`;

export const getScanningHTML = (text: string) => {
  return `<div class='loader-wrapper box-1 mb-2'>
    <div class="loader"></div>
    <p class='loader-text'>Scanning ${text}...</p>
  </div>`;
};

export const getScanningHTMLSmall = (width?: number, height?: number) =>
  `<div class='small-loader-wrapper'><div class="loader-small" style="width: ${
    width || '20'
  }px; height: ${height || '20'}px;"></div></div>`;

export const getSearchingHTML = (text: string) => {
  return `<div class='loader-wrapper box-1 mb-2'>
    <div class="loader"></div>
    <p class='loader-text'>${text}...</p>
  </div>`;
};

export const filterBySeverity = (
  vulnerabilityList: Array<IRecord>,
  vulnerabiliy: string
) => {
  return vulnerabilityList.filter((pck) => pck.severity == vulnerabiliy);
};

export const formatNumber = (num: number) => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  } else {
    return num.toString();
  }
};

export const PILLS = {
  renderPill: (
    val: number,
    label: string,
    showZero: boolean = false,
    severity: string,
    tooltip?: string,
    hideTooltip?: boolean
  ) => {
    if (!val && !showZero) {
      return '';
    }

    return `<div class='vul-pill vul-pill-${severity.toLowerCase()}' 
    ${!hideTooltip ? `data-tooltip="${tooltip || severity}"` : ''} >
        <div class='label'>${label}</div>
        <div class='value'>${formatNumber(val)}</div>
      </div>`;
  },
  SUCCESS: (
    val: number,
    label: string,
    showZero?: boolean,
    tooltip?: string,
    hideTooltip?: boolean
  ) => {
    return PILLS.renderPill(
      val,
      label,
      showZero,
      SEVERITY_TYPE.SUCCESS,
      tooltip,
      hideTooltip ?? true
    );
  },
  GENERAL: (
    val: number,
    label: string,
    showZero?: boolean,
    tooltip?: string,
    hideTooltip?: boolean
  ) => {
    return PILLS.renderPill(
      val,
      label,
      showZero,
      SEVERITY_TYPE.GENERAL,
      tooltip,
      hideTooltip ?? true
    );
  },
  GREY: (
    val: number,
    label: string,
    showZero?: boolean,
    tooltip?: string,
    hideTooltip?: boolean
  ) => {
    return PILLS.renderPill(
      val,
      label,
      showZero,
      SEVERITY_TYPE.GREY,
      tooltip,
      hideTooltip ?? true
    );
  },
  SEVERITY: {
    CRITICAL: (
      val: number,
      label: string,
      showZero?: boolean,
      tooltip?: string,
      hideTooltip?: boolean
    ) => {
      return PILLS.renderPill(
        val,
        label === undefined ? 'C' : label,
        showZero,
        SEVERITY_TYPE.CRITICAL,
        tooltip,
        hideTooltip
      );
    },
    HIGH: (
      val: number,
      label: string,
      showZero?: boolean,
      tooltip?: string,
      hideTooltip?: boolean
    ) => {
      return PILLS.renderPill(
        val,
        label === undefined ? 'H' : label,
        showZero,
        SEVERITY_TYPE.HIGH,
        tooltip,
        hideTooltip
      );
    },
    MODERATE: (
      val: number,
      label: string,
      showZero?: boolean,
      tooltip?: string,
      hideTooltip?: boolean
    ) => {
      return PILLS.renderPill(
        val,
        label ?? 'M',
        showZero,
        SEVERITY_TYPE.MODERATE,
        tooltip,
        hideTooltip
      );
    },
    LOW: (
      val: number,
      label: string,
      showZero?: boolean,
      tooltip?: string,
      hideTooltip?: boolean
    ) => {
      return PILLS.renderPill(
        val,
        label ?? 'L',
        showZero,
        SEVERITY_TYPE.LOW,
        tooltip,
        hideTooltip
      );
    },
    INFO: (
      val: number,
      label: string,
      showZero?: boolean,
      tooltip?: string,
      hideTooltip?: boolean
    ) => {
      return PILLS.renderPill(
        val,
        label,
        showZero,
        SEVERITY_TYPE.INFO,
        tooltip,
        hideTooltip
      );
    },
    NO_VULNERABILITY: `<div class='pill-sm white-space-no-wrap box-success-alt text-center' data-tooltip='No Vulnerabilities'>No Vulnerability</div>`,
    TOTAL: (val: number) =>
      `<div class='severity-box severity-info' data-tooltip="Total">${val}</div>`,
    GENERAL: (val: string) => {
      return `<div class='severity-box'>${val}</div>`;
    }
  }
};

export const formatDate = (dateObj: string) => {
  return new Date(dateObj).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const clearExtensionState = async (keyName: string, context: any) => {
  await context.globalState.update(keyName, undefined);
};

export const removeExtensionState = async (
  keyName: string,
  data: string,
  id: string,
  context: IRecord
) => {
  let currentValue = (await context.globalState.get(keyName)) || [];

  if (currentValue && currentValue.length > 0) {
    const foundIndex = currentValue.findIndex((c: IRecord) => c[id] === data);

    if (foundIndex >= 0) {
      currentValue.splice(foundIndex, 1);
    }
  }

  await context.globalState.update(keyName, currentValue);
};

export const saveVulDataInExtensionState = (
  data: Array<IRecord>,
  context: IRecord
) => {
  if (Array.isArray(data) && data.length > 0) {
    data.map(async (vulForCache) => {
      if (Object.keys(vulForCache).length > 0) {
        await appendInExtensionState(
          LOCAL_STORAGE.VULNERABILITIES,
          [vulForCache],
          'id',
          context
        );
      }
    });
  }
};

export const EXTENSION_STATE_MANAGER = {
  setItem: async (context: IRecord, keyName: String, data: any) => {
    await context.globalState.update(keyName, data);
  },
  getItem: async (context: IRecord, keyName: String) => {
    return await context.globalState.get(keyName);
  },
  clearItem: async (context: IRecord, keyName: String) => {
    await context.globalState.update(keyName, undefined);
  }
};

export const appendInExtensionState = async (
  keyName: String,
  data: Array<IRecord>,
  id: string,
  context: IRecord
) => {
  let currentValue = (await context.globalState.get(keyName)) || [];

  if (currentValue && currentValue.length > 0) {
    data.map((item) => {
      const foundIndex = currentValue.findIndex(
        (c: IRecord) => c[id] === item[id]
      );
      if (foundIndex === -1) {
        currentValue = [...currentValue, item];
      } else {
        currentValue[foundIndex] = item;
      }
    });
  } else {
    currentValue = data;
  }

  await context.globalState.update(keyName, currentValue);
};

export const readFromExtensionState = async (
  keyName: string,
  context: IRecord
) => {
  return await context.globalState.get(keyName);
};

export const isStringifiedObject = (value: any) => {
  if (typeof value !== 'string') {
    return false;
  }

  try {
    const parsedValue = JSON.parse(value);
    return typeof parsedValue === 'object' && parsedValue !== null;
  } catch (e) {
    return false;
  }
};

export const runNPMCommand = (
  webRenderer: IWebRenderer,
  command: string,
  cb: (success: boolean, resp: IRecord) => void
) => {
  const workingDir = path.dirname(
    webRenderer.packageLockFile.uri.path.substring(1)
  );
  const exec = util.promisify(require('child_process').exec);

  try {
    exec(command + (process.platform !== 'win32' ? '/' : '') + workingDir, {
      windowsHide: true,
      cwd: workingDir
    })
      .then((result: IRecord) => {
        cb &&
          cb(
            true,
            isStringifiedObject(result.stdout)
              ? JSON.parse(result.stdout)
              : result.stdout || result
          );
      })
      .catch((e: IRecord) => {
        cb && cb(true, e);
      });
  } catch (output: any) {
    cb && cb(false, output);
  }
};

export const runNPMCommandAsyncAwait = async (
  webRenderer: IWebRenderer,
  command: string
) => {
  const workingDir = path.dirname(
    webRenderer.packageLockFile.uri.path.substring(1)
  );
  const exec = util.promisify(require('child_process').exec);

  try {
    const result: IRecord = await exec(
      command + (process.platform !== 'win32' ? '/' : '') + workingDir,
      {
        windowsHide: true,
        cwd: workingDir
      }
    );

    return {
      success: true,
      resp: isStringifiedObject(result.stdout)
        ? JSON.parse(result.stdout)
        : result.stdout || result
    };
  } catch (output: any) {
    return {
      success: false,
      resp: output
    };
  }
};

export const installIcon = (
  size: number = 16
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
</svg>`;

export const eyeIcon = (
  size: number
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size || 16}" height="${
  size || 16
}" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
</svg>`;

export const isLowerVersion = (
  version1: string,
  version2: string
): boolean | number => {
  try {
    return semver.lt(version1, version2);
  } catch (e) {
    return -1;
  }
};

export const cleanVersion = (version: string) => {
  if (!version) {
    return '';
  }

  return version
    .replace(/\~/g, '')
    .replaceAll(/\^/g, '')
    .replaceAll(/\>=/g, '');
};

export const getPackageId = (pckName: string, version?: string) => {
  let pckTxt = pckName || '';

  if (version) {
    const ver = cleanVersion(version);
    pckTxt = `${pckTxt}_${ver || ''}`;
  }

  return pckTxt
    .toString()
    .replace(/\@/g, '_')
    .replace(/\./g, '_')
    .replace(/\-/g, '_')
    .replace(/\^/g, '_');
};

export const vulFixType = (
  fixAvailable:
    | boolean
    | { isSemVerMajor: boolean; name: string; version: string }
    | undefined
): 'Breaking' | 'Yes' | 'No' => {
  if (fixAvailable === undefined) {
    return 'No';
  }
  return typeof fixAvailable === 'object'
    ? 'Breaking'
    : fixAvailable
    ? 'Yes'
    : 'No';
};

export const splitButton = (
  leftContent: string,
  rightContent: string,
  onClick?: string,
  hint?: string,
  className?: string
) => {
  return `
  <div class='split-btn ${className}' ${onClick}>
    <div class='btn-content'>
      <div class='left-content'>${leftContent}</div>
      <div class='right-content'>${rightContent}</div>
    </div>

    ${hint ? `<div class='hint mt-1'>${hint}</div>` : ''}
  </div>
  `;
};

export const hrDivider = `<div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px; margin-top: 15px"></div>`;

export const capitalizeFirstLetter = (txt: string) => {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
};

export const getPercentage = (val: number, total: number) => {
  return ((val / total) * 100).toFixed(1) + '%';
};

export const BADGE = {
  GREY: (txt: string | number) => `<div class="vul-pill vul-pill-grey">
        <div class="label">${txt}</div>
      </div>`
};
