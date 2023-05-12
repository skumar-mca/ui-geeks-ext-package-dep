const { writeFile } = require('fs');
const { posix } = require('path');
const { window, ViewColumn, workspace, Uri } = require('vscode');

const {
  COMMON_CSS,
  REPORT_FILE_NAME,
  REPORT_FOLDER_NAME,
  MSGS,
  REPORT_TITLE
} = require('./constants');
const { logMsg, logErrorMsg } = require('./util');

class WebRenderer {
  template = null;
  title = '';
  panel = null;
  context = null;
  content = null;
  appMeta = null;

  constructor(template, title) {
    this.title = title;
    this.template = template;
  }

  get applicationName() {
    if (this.appMeta) {
      return this.appMeta.appName;
    }
    return null;
  }

  init = async (context) => {
    this.context = context;
    this.initializePanel();
    this.onClosePanel();
  };

  initializePanel = () => {
    this.panel = createPanel(this.title);

    // Handle messages from the webview
    this.panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'downloadReportAsHTML':
            this.createReport('html');
            return;

          case 'downloadReportAsPDF':
            this.createReport('pdf');
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );
  };

  sendMessageToUI = (msg) => {
    this.panel.webview.postMessage({ command: msg });
  };

  createReport = (reportType) => {
    createReportFile(this, this.content, reportType);
  };

  onClosePanel = () => {
    this.panel.onDidDispose(() => {}, null);
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

        <style>
          ${COMMON_CSS}
          .table-dep { margin-bottom:40px; }
          .table-dep th:nth-child(1){ width: 80px;}
          .table-dep th:nth-child(3){ width: 120px;}
        </style>
    </head>

    
    <script>
      const vscode = acquireVsCodeApi();    
      function downloadReport(reportType) {
          vscode.postMessage({
              command: reportType === 'html' ? 'downloadReportAsHTML' : 'downloadReportAsPDF' ,
              text: 'Download Report Now'
          })
      }

      window.addEventListener('message', event => {
        const message = event.data; 
        const downloadBtn = document.getElementById('downloadLink');
        
        switch (message.command) {
            case 'downloadingStart': 
                if(downloadBtn) { downloadBtn.textContent = 'Downloading...'; }
            break;
    
            case 'downloadingEnd': 
                if(downloadBtn) {  downloadBtn.textContent = 'Download as'; }
            break;
        }
    });
    </script>

    <body>
        <div>
            <div style="display: flex;">
                <h2 class="header">
                    NPM Dependency Report
                    <span class='email-link header-link-actions'>
                        <span class='color-grey'> <span id='downloadLink'>Download as</span>&nbsp;<a class='no-link' href='javascript:void(0)' title='Download Report in HTML Format' onclick="downloadReport('html')">HTML</a>
                        </span>
                    </span>
                </h2>

            </div>

            <div style="border-bottom: 1px solid #8b8989; margin-bottom: 15px;"> </div>

            <div class="content">
                <div class="content-box box box-info">
                    <div class="field-label">Application Name</div>
                    <div class="field-value">${this.appMeta.appName}</div>
                </div>

                <div class="content-box box box-info">
                    <div class="field-label">Version</div>
                    <div class="field-value">${this.appMeta.version}</div>
                </div>

                <div class="content-box box box-info">
                    <div class="field-label">Description</div>
                    <div class="field-value">${this.appMeta.description}</div>
                </div>
            </div>
        <br/>
        <br/>
    </div>


    ${content}

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

const createPanel = (title) => {
  return window.createWebviewPanel(
    title.replace(' ', '').trim(),
    title,
    ViewColumn.One,
    { localResourceRoots: [], enableScripts: true }
  );
};

const renderContentOnPanel = (panel, content) => {
  panel.webview.html = content;
};

const renderLoader = async (_this, panel, title) => {
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
            ${COMMON_CSS}
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

const renderError = async (_this, panel, meta) => {
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
            ${COMMON_CSS}
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

const createReportFile = async (webRenderedRef, content, reportType) => {
  const folderUri = workspace.workspaceFolders[0].uri;

  const reportFileName = posix.join(
    folderUri.path,
    `${REPORT_FOLDER_NAME}/${REPORT_FILE_NAME}`
  );

  try {
    webRenderedRef.sendMessageToUI('downloadingStart');
    content += `<style>.header-link-actions { display: none;} body, table { font-size:12px!important;}</style>`;
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

      uri &&
        writeFile(uri.fsPath, reportContent, () => {
          logMsg(MSGS.REPORT_CREATED, true);
          webRenderedRef.sendMessageToUI('downloadingEnd');
        });
    }
  } catch (e) {
    webRenderedRef.sendMessageToUI('downloadingEnd');
    logErrorMsg(MSGS.PDF_ERROR, true);
  }
};

const createFolder = async (folderName) => {
  const workSpaceUri = workspace.workspaceFolders[0].uri;
  const folderUri = Uri.parse(`${workSpaceUri.path}/${folderName}`);
  await workspace.fs.createDirectory(folderUri);
};

module.exports = {
  createPanel,
  renderContentOnPanel,
  renderLoader,
  renderError,
  createFolder,
  WebRenderer
};
