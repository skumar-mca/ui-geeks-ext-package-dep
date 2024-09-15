import { IRecord } from './common.types';

const vscode = require('vscode');
const { COMMANDS } = require('./constants');
const { dependencyCommand } = require('./dependency-report');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context: IRecord) {
  console.log(
    'Congratulations, your extension "npm-dependencies-ui-geeks" is now active!'
  );

  const dependencyCmd = vscode.commands.registerCommand(
    COMMANDS.DEPENDENCY,
    async (uri: IRecord) => {
      dependencyCommand(context, uri);
    }
  );

  context.subscriptions.push(dependencyCmd);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
