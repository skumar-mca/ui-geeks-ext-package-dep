// @ts-nocheck
const vscode = require('vscode');
import { writeFile } from 'fs';
import path, { posix } from 'path';
import { Uri, ViewColumn, window, workspace } from 'vscode';

import {
  MSGS,
  REPORT_FILE_NAME,
  REPORT_FOLDER_NAME,
  REPORT_TITLE
} from './constants';

import { scanAgain } from './dependency-report';
import { getExtensionFileSrc, logErrorMsg, logMsg } from './util';

const scriptFunctionStr = `
var vscode = acquireVsCodeApi();

function downloadReport(reportType) {
  vscode.postMessage({
    command:
      reportType === 'html' ? 'downloadReportAsHTML' : 'downloadReportAsPDF',
    text: 'Download Report Now',
    webContent: document.documentElement.outerHTML
  });
}

function scanAgain() {
  vscode.postMessage({
    command: 'scanAgain'
  });
}

function fixAutoFixableVulnerabilities(rootFolder) {
  vscode.postMessage({
    command: 'autoFixVulnerabilities',
    rootFolder
  });
}

function updateAllOutdatedPackages(packages, rootFolder) {
  vscode.postMessage({
    command: 'updateAllOutdatedPackages',
    packages,
    rootFolder
  });
}

function updatePackage(pkgName, pkgNumber, rootFolder){
  vscode.postMessage({
    command: 'updatePackage',
    pkgNumber: pkgNumber,
    pkgName:pkgName,
    rootFolder:rootFolder
  });
}

function scrollToElement(id) {
  const elm = document.getElementById(id);
  if(elm){
    elm.scrollTo({top: 100, behavior: 'smooth'});
  }
}
`;

let webviews = new Map();

export class WebRenderer {
  projectId = '';
  initialized = false;
  template = null;
  title = '';
  panel = null;
  panelId = null;
  context = null;
  content = null;
  appMeta = null;
  auditingOutdatedPackages: false;
  auditingVulnerabilities: false;

  parentPath = '';
  extensionPath = '';
  outdatedPackages = [];
  packagesWithVersion = {};
  pkgJSON = null;
  uri = {};
  packageLockFile = null;
  pckName = '';

  summary: {
    vulnerabilities: [];
    outdatedPackages: [];
  };

  constructor(template, title) {
    this.title = title;
    this.template = template;
  }

  get isAuditing() {
    return this.auditingOutdatedPackages || this.auditingVulnerabilities;
  }

  get applicationName() {
    if (this.appMeta) {
      return this.appMeta.appName;
    }
    return null;
  }

  init = async (context) => {
    this.context = context;
    this.initializePanel(context);
    this.onClosePanel();
  };

  initializePanel = (context) => {
    if (!this.panel) {
      this.panel = createPanel(this.title, context.extensionPath);
      this.panelId = new Date().getMilliseconds();
      webviews.set(this.panelId, this.panel);
    }

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        let terminal = null;
        switch (message.command) {
          case 'downloadReportAsHTML':
            this.createReport('html', message.webContent);
            return;

          case 'scanAgain':
            scanAgain(this);
            return;

          case 'updatePackage':
            terminal = vscode.window.createTerminal(`Update Package`);
            terminal.sendText(`cd ${message.rootFolder}`);
            terminal.show();
            terminal.sendText(
              `npm install ${message.pkgName}@${message.pkgNumber} --legacy-peer-deps`
            );
            return;

          case 'autoFixVulnerabilities':
            terminal = vscode.window.createTerminal(`Autofix Vulnerabilities`);
            terminal.sendText(`cd ${message.rootFolder}`);
            terminal.show();
            terminal.sendText(`npm audit fix --force`);
            return;

          case 'updateAllOutdatedPackages':
            terminal = vscode.window.createTerminal(`Update Packages`);
            terminal.sendText(`cd ${message.rootFolder}`);
            terminal.show();
            terminal.sendText(
              `npm install ${message.packages} --legacy-peer-deps`
            );
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );

    this.panel.onDidDispose(
      () => {
        webviews.delete(this.panelId);
      },
      null,
      context.subscriptions
    );
  };

  sendMessageToUI = (msg, data) => {
    this.panel.webview.postMessage({ command: msg, data });
  };

  createReport = (reportType, content) => {
    createReportFile(this, content, reportType);
  };

  onClosePanel = () => {
    this.panel.onDidDispose(() => {
      this.panel = null;
      this.panelId = null;
      this.initialized = false;
    }, null);
  };

  getStyleSrc = () => {
    return getExtensionFileSrc(this.extensionPath, this.panel, 'out/style.css');
  };

  getScriptSrc = () => {
    return getExtensionFileSrc(
      this.extensionPath,
      this.panel,
      'out/scripts/web-script.js'
    );
  };

  getExtensionSrc = () => {
    return getExtensionFileSrc(
      this.extensionPath,
      this.panel,
      'out/extension.js'
    );
  };

  renderAppHeaderContent = (reportTitle) => {
    const uiGeeksLogo = getExtensionFileSrc(
      this.extensionPath,
      this.panel,
      'images/ui-geeks-logo.png'
    );

    return `
    <div class='app-header-section'>
        <div class='header-left-section'>
          <h1 class='app-name'>

            <img src='${uiGeeksLogo}' class='ui-geeks-logo hide-on-browser' />
            <img src='/images/ui-geeks-logo.png' class='ui-geeks-logo show-on-browser' style='display:none' />


            <a href='https://ui-geeks.in' target='_blank' class='ui-geeks-link'>
              <div class='ui-geeks-name'>
                <span class='ui'>UI</span>
                <span class='geeks'>Geeks</span>
              </div>
            </a>
          </h1>

          <div class="app-desc i">"UI Learning Platform"</div>
        </div>

        <div class='header-right-section'>
          <h3 class="header">
            ${reportTitle}
          </h3>

          <span class='email-link header-link-actions'>
            <a 
              class='color-grey no-link' 
              id='downloadLink' 
              href='javascript:void(0)' 
              onclick="downloadReport('html')">
              Download
            </a>
          </span>
        </div>
    </div>`;
  };

  renderAppFooterContent = () => {
    return `
      &copy; UI Geeks, All rights reserved
      <span class='float-right'>
        <a href='https://ui-geeks.in/#/vscode-extensions' target='_blank' class='internal-link'> Other Extensions</a>
      </span>
    `;
  };

  renderContent = (content) => {
    const htmlStr = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${REPORT_TITLE}${
      this.applicationName ? ` | ${this.applicationName}` : ''
    }</title>

        <link href="${this.getStyleSrc()}" rel="stylesheet">

        <script>
          ${scriptFunctionStr}
        </script>

        <script src="${this.getScriptSrc()}"></script> 
        <script src="${this.getExtensionSrc()}"></script> 
        <style>
          
          .table-dep { margin-bottom:40px; }
          .table-dep th:nth-child(1){ width: 80px;}
          .table-dep th:nth-child(3){ width: 120px;}
        </style>
    </head>

    <body>
    <div id='react_app'></div>
      <div class='app'>
          <div class='app-header'>
              ${this.renderAppHeaderContent(REPORT_TITLE)}
          </div>

          <div class='app-body'>
            <div class='body-content'>
              <div class='right-section'>
                  ${content}
              </div>
            </div>
          </div>

          <div class='app-footer'>${this.renderAppFooterContent()}</div>
        </div>
      </body>
    </html>`;

    this.content = htmlStr;

    renderContentOnPanel(this.panel, htmlStr);
  };

  renderLoader = () => {
    renderLoader(this, this.panel, this.title);
  };

  renderError = (meta) => {
    renderError(this, this.panel, meta);
  };

  setAppMetaData = (appData) => {
    this.appMeta = appData;
  };
}

export const createPanel = (title, extensionPath) => {
  return window.createWebviewPanel(
    title.replace(' ', '').trim(),
    title,
    ViewColumn.One,
    {
      localResourceRoots: [
        Uri.file(path.join(extensionPath, 'images')),
        Uri.file(path.join(extensionPath, 'out'))
      ],
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );
};

export const renderContentOnPanel = (panel, content) => {
  panel.webview.html = content;
};

export const renderLoader = async (_this, panel, title) => {
  const content = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${REPORT_TITLE}${
    _this.applicationName ? ` | ${_this.applicationName}` : ''
  }</title>
          <style>
            <link href="${_this.getStyleSrc()}" rel="stylesheet">
            <script src="${_this.getScriptSrc()}"></script> 
          </style>
    </head>
    
      <body>
        <h1 class="header">${title}</h1>
        <div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px"></div>
        <div>Running ${title}...</div>
        <br />
      </body>
    </html>
`;

  renderContentOnPanel(panel, content);
};

export const renderError = async (_this, panel, meta) => {
  const { actionHeader, hasSolution, message } = meta;

  const content = `
  <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${REPORT_TITLE}${
    _this.applicationName ? ` | ${_this.applicationName}` : ''
  }</title>
          <style>
            <link href="${_this.getStyleSrc()}" rel="stylesheet">
            body{ background: #ffa9a9; color:black; }
          </style>
    </head>
    
      <body>
        <h1 class="header">${actionHeader} Failed</h1>
        <div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px;"> </div>
        <br/>
    
        <div class="text-danger b mb-2">${
          message || 'Something went wrong, please try again after sometime.'
        }</div>
    
        ${hasSolution ? `<div class="box box-info">${hasSolution}</div>` : ''}
      </body>
    </html>
`;

  _this.content = content;
  panel.webview.html = content;
};

const createReportFile = async (
  webRenderedRef: any,
  content: any,
  reportType: string
) => {
  const folderUri = workspace.workspaceFolders[0].uri;

  const reportFileName = posix.join(
    folderUri.path,
    `${REPORT_FOLDER_NAME}/${REPORT_FILE_NAME}`
  );

  try {
    webRenderedRef.sendMessageToUI('downloadingStart');
    content += `<style>.header-link-actions { display: none;} body, table { font-size:12px!important;}
    .hide-on-browser { display:none}
    .show-on-browser { display:flex}
    .disable-on-browser { pointer-events: none; opacity: 0.3;}
    .remove-link-on-browser { text-decoration:none; color:black; pointer-events:none; cursor:none; }
    .text-with-icon { justify-content: center!important; }
    </style>`;

    content += `
        <link href="out/style.css" rel="stylesheet">
        <script src="out/scripts/web-scripts.js"></script> 
        <script src="out/extension.js"></script>
        `;

    let fileUri = folderUri.with({ path: `${reportFileName}.${reportType}` });
    let filters = null;
    let reportContent = content;
    let saveDialogTitle = `Save ${REPORT_TITLE}`;

    switch (reportType) {
      case 'html':
        filters = { WebPages: ['html'] };
        break;
    }

    if (filters) {
      if (webRenderedRef.appMeta) {
        fileUri = folderUri.with({
          path: `${reportFileName}-${webRenderedRef.appMeta.appName}.${reportType}`
        });

        saveDialogTitle = `Save ${REPORT_TITLE} for ${
          webRenderedRef.appMeta.appName || 'Application'
        }`;
      }

      const uri = await window.showSaveDialog({
        filters,
        defaultUri: fileUri,
        saveLabel: `Save Report`,
        title: saveDialogTitle
      });

      if (!uri) {
        webRenderedRef.sendMessageToUI('downloadingEnd');
      }

      writeFile(uri.fsPath, reportContent, () => {
        logMsg(MSGS.REPORT_CREATED, true);
        webRenderedRef.sendMessageToUI('downloadingEnd');
      });
    }
  } catch (e) {
    webRenderedRef.sendMessageToUI('downloadingEnd');
    if (reportType === 'pdf') {
      logErrorMsg(MSGS.PDF_ERROR, true);
    }
  }
};

export const createFolder = async (folderName) => {
  const workSpaceUri = workspace.workspaceFolders[0].uri;
  const folderUri = Uri.parse(`${workSpaceUri.path}/${folderName}`);
  await workspace.fs.createDirectory(folderUri);
};
