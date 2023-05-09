const { readFileSync, writeFile } = require('fs');
const { render } = require('mustache');
const { join, posix } = require('path');
const { window, ViewColumn, workspace, Uri } = require('vscode');

const puppeteer = require('puppeteer');

const {
  COMMON_CSS,
  REPORT_FILE_NAME,
  REPORT_FOLDER_NAME,
  REPORT_TITLE,
  MSGS
} = require('./constants');
const { logMsg } = require('./util');

class WebRenderer {
  template = null;
  title = '';
  panel = null;
  context = null;
  content = null;

  constructor(template, title) {
    this.title = title;
    this.template = template;
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
    this.panel.onDidDispose(() => {
      this.deleteReportFile();
    }, null);
  };

  renderContent = (content) => {
    this.content = content;
    renderContentOnPanel(this.panel, content);
  };

  renderLoader = () => {
    renderLoader(this.panel, this.title);
  };

  renderError = (meta) => {
    renderError(this.panel, meta);
  };

  deleteReportFile = () => {
    deleteReportFile();
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

const getTemplate = async (template) => {
  return await readFileSync(
    join(__dirname, `../assets/templates/${template}.mustache`),
    'utf-8'
  );
};

const renderContentOnPanel = (panel, content) => {
  panel.webview.html = content;
};

const renderLoader = async (panel, title) => {
  const template = await getTemplate('loader');
  const view = { commonCSS: COMMON_CSS, actionHeader: title };
  let content = render(template, view);
  renderContentOnPanel(panel, content);
};

const renderError = async (panel, meta) => {
  const template = await getTemplate('error');
  const { actionHeader, hasSolution, message } = meta;
  const view = {
    commonCSS: COMMON_CSS,
    actionHeader
  };

  let content = render(template, view);

  content += `<div class="text-danger b mb-2">${
    message || 'Something went wrong, please try again after sometime.'
  }</div>`;

  if (hasSolution) {
    content += `<div class="box box-info">${hasSolution}</div>`;
  }

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
    content += `<style>.header-link-actions { display: none;}</style>`;
    let fileUri = folderUri.with({ path: `${reportFileName}.html` });
    let filters = null;
    let reportContent = content;
    switch (reportType) {
      case 'html':
        filters = { WebPages: ['html'] };

        break;

      case 'pdf':
        fileUri = folderUri.with({ path: `${reportFileName}.pdf` });
        filters = { PDF: ['pdf'] };
        await createFolder(REPORT_FOLDER_NAME);
        const PDF = await createPDF(content);
        reportContent = PDF;
        break;
    }

    if (filters) {
      const uri = await window.showSaveDialog({
        filters,
        defaultUri: fileUri
      });

      uri &&
        writeFile(uri.fsPath, reportContent, () => {
          logMsg(MSGS.REPORT_CREATED, true);
          webRenderedRef.sendMessageToUI('downloadingEnd');
        });
    }
  } catch (e) {
    webRenderedRef.sendMessageToUI('downloadingEnd');
    webRenderedRef.renderError(webRenderedRef.panel, {
      actionHeader: REPORT_TITLE,
      hasSolution: false,
      message: MSGS.PDF_ERROR.replace('##MESSAGE##', e.message)
    });
  }
};

const deleteReportFile = async () => {
  const folderUri = workspace.workspaceFolders[0].uri;
  const folderPath = folderUri.with({
    path: posix.join(folderUri.path, `${REPORT_FOLDER_NAME}`)
  });

  try {
    await workspace.fs.stat(folderPath);
    workspace.fs.delete(folderPath, { recursive: true });
  } catch {}
};

const createFolder = async (folderName) => {
  const workSpaceUri = workspace.workspaceFolders[0].uri;
  const folderUri = Uri.parse(`${workSpaceUri.path}/${folderName}`);
  await workspace.fs.createDirectory(folderUri);
};

const createPDF = async (content) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(content);
  const PDF = await page.pdf();
  return PDF;
};

module.exports = {
  createPanel,
  getTemplate,
  renderContentOnPanel,
  renderLoader,
  renderError,
  createPDF,
  createFolder,
  WebRenderer
};
