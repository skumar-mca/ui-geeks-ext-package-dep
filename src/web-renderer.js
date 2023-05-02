const { readFile } = require('fs-extra');
const { render } = require('mustache');
const { join, posix } = require('path');
const { window, ViewColumn, workspace, Uri } = require('vscode');
// @ts-ignore
const pdfMaster = require('pdf-master');

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
          case 'downloadReport':
            this.createReport();
            return;
        }
      },
      undefined,
      this.context.subscriptions
    );
  };

  createReport = () => {
    createReportFile(this, this.content);
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
  return await readFile(
    join(__dirname, `../assets/templates/${template}.mustache`),
    'utf8'
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

const createReportFile = async (webRenderedRef, content) => {
  const folderUri = workspace.workspaceFolders[0].uri;

  const reportFileName = posix.join(
    folderUri.path,
    `${REPORT_FOLDER_NAME}/${REPORT_FILE_NAME}`
  );

  const fileUriHBS = folderUri.with({ path: `${reportFileName}.hbs` });
  const filePDFUri = folderUri.with({ path: `${reportFileName}.pdf` });

  // Write HTML File
  // await workspace.fs.writeFile(fileUri, Buffer.from(content, 'utf8'));

  try {
    content += `<style>.header-link-actions { display: none;}</style>`;
    await workspace.fs.writeFile(fileUriHBS, Buffer.from(content, 'utf8'));
    const PDF = await pdfMaster.generatePdf(fileUriHBS.fsPath);

    // Write PDF File
    await workspace.fs.writeFile(filePDFUri, PDF);

    //Delete HBS File
    workspace.fs.delete(fileUriHBS, { recursive: true });

    logMsg(MSGS.REPORT_PDF_CREATED, true);
  } catch (e) {
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

module.exports = {
  createPanel,
  getTemplate,
  renderContentOnPanel,
  renderLoader,
  renderError,
  WebRenderer
};
