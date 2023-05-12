const { MSGS } = require('./constants');
const { window, workspace, commands } = require('vscode');

const logMsg = (msg, inModal) => {
  window.showInformationMessage(msg, { modal: inModal || false });
};

const logErrorMsg = (msg, inModal) => {
  window.showErrorMessage(msg, { modal: inModal || false });
};

const findFile = (fileName) => {
  return new Promise((resolve, reject) => {
    workspace.findFiles(`**/${fileName}`).then(
      async (resp) => {
        if (resp) {
          resp = resp.filter((r) => r.path.indexOf('node_modules') === -1);
          if (resp.length === 1) {
            return resolve(await workspace.openTextDocument(resp[0].path));
          }

          const selectedFile = await window.showQuickPick(
            resp.map((r) => r.path)
          );

          if (selectedFile) {
            return resolve(await workspace.openTextDocument(selectedFile));
          }

          return reject(MSGS.INVALID_SELECTION);
        }

        resolve(null);
      },
      () => {
        reject('File Not Found');
      }
    );
  });
};

const getFileContent = async (file) => {
  if (!file) {
    return '';
  }

  return await file.getText();
};

const openFile = async (fileUri) => {
  const doc = await workspace.openTextDocument(fileUri);
  await window.showTextDocument(doc, { preview: false });
};

const registerCommand = (command, handlerMethod) => {
  return commands.registerCommand(command, async () => {
    await handlerMethod();
  });
};

const isDarkTheme = () => {
  return window.activeColorTheme.kind === 2;
};

const sortByKey = (list, key) => {
  if (!list || !key) {
    return list;
  }

  return list.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};

const convertObjectToArray = (obj, keyAttribute, valueAttribute) => {
  if (!obj || Object.keys(obj).length === 0) {
    return [];
  }

  return Object.keys(obj).map((key) => {
    return { [keyAttribute]: key, [valueAttribute]: obj[key] };
  });
};

module.exports = {
  logMsg,
  logErrorMsg,
  findFile,
  getFileContent,
  openFile,
  registerCommand,
  convertObjectToArray,
  sortByKey,
  isDarkTheme
};
