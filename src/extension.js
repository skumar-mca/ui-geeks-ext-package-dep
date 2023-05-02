const vscode = require('vscode');
const { COMMANDS } = require('./constants');
const { dependencyCommand } = require('./dependency-report');
const { registerCommand } = require('./util');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "skumar-vsc-utilities" is now active!'
  );

  const dependencyCmd = registerCommand(COMMANDS.DEPENDENCY, () =>
    dependencyCommand(context)
  );
  context.subscriptions.push(dependencyCmd);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
