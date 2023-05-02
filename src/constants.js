const extensionPrefix = `ui-geeks-ext-package-dep`;
const REPORT_TITLE = 'Package Dependency Report';
const REPORT_TEMPLATE = 'dependency-report';
const REPORT_FOLDER_NAME = 'ui-geeks-ext-npm-dependencies';
const REPORT_FILE_NAME = 'package-dep-report';

const COMMANDS = {
  DEPENDENCY: `${extensionPrefix}.runGetDependency`
};

const DEPENDENCY_META = {
  dependency: {
    dependencyType: 'Dependencies',
    hint: `It contains all the packages that are required in the production or testing environments. These will be included in bundled code.`
  },
  devDependency: {
    dependencyType: 'Dev Dependencies',
    hint: `It contains all the packages that are required in the development || phase of the project and not in the production or testing environments.`
  },

  peerDependencies: {
    dependencyType: 'Peer Dependencies',
    hint: `Having a peer dependency means that our package needs a dependency that is the same exact dependency as the person installing our package.`
  }
};

const MSGS = {
  PACKAGE_JSON_NOT_FOUND: `Error: package.json file not found!`,
  INVALID_SELECTION: `Invalid Selection`,
  REPORT_PDF_CREATED: `A PDF file named '${REPORT_FILE_NAME}.pdf' is download in folder '${REPORT_FOLDER_NAME}'.\n\n
  Note: Folder will automatically be deleted on closing the '${REPORT_TITLE}' tab.`,
  PDF_ERROR: `Error generating PDF Report. Please try again later. Error: ##MESSAGE##.`
};

const COMMON_CSS = `
body { font-size: 1.2em; background-color: #f6f6f6; color: black;}
.b { font-weight: bold; }
.i { font-style: italic; }
.text-center { text-align:center; }
.text-right { text-align:right; }
.mb-1 { margin-bottom:10px; }
.pl-1 { padding-left:10px; }
.pl-2 { padding-left:20px; }
.mb-2 { margin-bottom:20px; }
.mt-1 { margin-top:10px; }
.mt-2 { margin-top:20px; }
.p-2 { padding:20px; }
.color-grey { color: #7a7a7a}
.text-danger{ color:red}
.text-warning { color:#9a5919}
.no-link { text-decoration:none;  }
.no-link:hover { color: #7a7a7a;}
.content { display: flex; flex-direction: row; justify-content: space-between; gap:10px; }
.content-box{ flex:1;} 
.field-label { text-align:center; font-style: italic; }
.field-value { font-weight: bold; text-align:center; }
.header-section { margin-bottom: 0;font-size: 1em;  }
.hint { font-size: 0.9em;font-style: italic; color: #a5a4a4; margin-bottom: 20px; }
.table { width: 100%;max-width: 100%; margin-bottom: 1rem;}
.table th, .table td { padding: 0.75rem;vertical-align: top; border-top: 1px solid #eceeef;background-color: #e7e9eb;color: black;}
.table thead th { vertical-align: bottom; border-bottom: 2px solid #eceeef; text-align: left; }
.table tbody + tbody { border-top: 2px solid #eceeef; }
.table { background-color: #fff; }
.table-sm th,.table-sm td { padding: 0.3rem;}
.table-bordered { border: 1px solid #eceeef;}
.table-bordered th, .table-bordered td { border: 1px solid #eceeef;}
.table-bordered thead th, .table-bordered thead td { border-bottom-width: 2px; }
.box{ padding:10px; border:1px solid #c0c0c0; margin-bottom: 20px; border-radius: 4px; background:#c0c0c0; }
.box-critical {background: #ff2f2f; }
.box-high { background: #ffa9a9; }
.box-moderate { background: #ffd49f; }
.box-low { background: #f8ffe5; }
.box-info { background: #e2faff; }
.box-success { background: green;}
.compat-update { border-left: 5px solid green; }
.breaking-update { border-left: 5px solid #cf6321; }
.fix-green { color: green; }
.fix-yellow { color: cf6321; }
.email-link { font-size:20px; position:absolute; right: 20px; margin-top:20px; }
.email-link a.no-link { font-size:16px; }
`;

module.exports = {
  MSGS,
  extensionPrefix,
  COMMANDS,
  COMMON_CSS,
  REPORT_FILE_NAME,
  REPORT_FOLDER_NAME,
  REPORT_TITLE,
  REPORT_TEMPLATE,
  DEPENDENCY_META
};
