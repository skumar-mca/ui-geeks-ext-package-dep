const { render } = require('mustache');
const { window, ProgressLocation } = require('vscode');
const {
  MSGS,
  COMMON_CSS,
  REPORT_TEMPLATE,
  REPORT_TITLE,
  DEPENDENCY_META
} = require('./constants');
const { findFile, getFileContent, convertObjectToArray } = require('./util');

const { WebRenderer, getTemplate } = require('./web-renderer');
const { copySync } = require('fs-extra');

const webRenderer = new WebRenderer(REPORT_TEMPLATE, REPORT_TITLE);

const runDependencyCommand = async () => {
  const packageFile = await findFile('package.json');
  if (!packageFile) {
    renderDependencyError(MSGS.PACKAGE_JSON_NOT_FOUND);
    return;
  }

  const fileContent = await getFileContent(packageFile);
  if (!fileContent) {
    return {
      success: false,
      data: 'Error: Reading content of package.json'
    };
  }

  const packageJSON = JSON.parse(fileContent);

  const {
    name,
    version,
    description,
    devDependencies: dev,
    dependencies: prod,
    peerDependencies: peer
  } = packageJSON;

  const data = {
    projectName: name,
    version: version,
    description: description,
    devDependencies: convertObjectToArray(dev, 'name', 'version'),
    dependencies: convertObjectToArray(prod, 'name', 'version'),
    peerDependencies: convertObjectToArray(peer, 'name', 'version')
  };

  return { success: true, data };
};

const createHTMLReport = async (data) => {
  const {
    projectName,
    version,
    description,
    devDependencies: dev,
    dependencies: prod,
    peerDependencies: peer
  } = data;

  const view = {
    commonCSS: COMMON_CSS,
    projectName,
    version,
    description
  };

  let content = render(await getTemplate(webRenderer.template), view);

  content += renderDependency(prod, DEPENDENCY_META.dependency);
  content += renderDependency(dev, DEPENDENCY_META.devDependency);
  content += renderDependency(peer, DEPENDENCY_META.peerDependencies);

  webRenderer.renderContent(content);
};

const renderDependency = (dependencyList, meta) => {
  if (!dependencyList || dependencyList.length === 0) {
    return '';
  }

  let htmlStr = `
    <div>
      <h2 class="header-section">${meta.dependencyType} (${dependencyList.length})</h2> 
      <div class="hint ">${meta.hint}</div>
        <table class='table table-sm table-bordered table-dep'>
          <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Version</th>
            </tr>
          </thead>
          <tbody>`;

  dependencyList.map((dep, index) => {
    htmlStr = `${htmlStr}
          <tr>
            <td>${index + 1}</td>
            <td><a href='https://www.npmjs.com/package/${dep.name}'>${
      dep.name
    }</a></td>
            <td>${dep.version}</td>
          </tr>`;
  });

  htmlStr = `${htmlStr}
          </tbody>
      </table>
</div>`;

  return htmlStr;
};

const renderDependencyError = (error) => {
  webRenderer.renderError({
    actionHeader: REPORT_TITLE,
    hasSolution: false,
    message: error || ''
  });
};

const dependencyCommand = async (context) => {
  await webRenderer.init(context);
  webRenderer.renderLoader();

  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: `Reading ${REPORT_TITLE}...`,
      cancellable: false
    },
    async () => {
      const result = await runDependencyCommand();

      if (result) {
        if (!result.success) {
          renderDependencyError(JSON.stringify(result.data));
          return;
        }

        createHTMLReport(result.data);
      }
    }
  );
};

module.exports = {
  dependencyCommand
};
