export const extensionPrefix = `ui-geeks-ext-package-dep`;
export const REPORT_TITLE = 'UI Geeks: Dependencies Audit Report';
export const REPORT_TEMPLATE = 'dependency-report';
export const REPORT_FOLDER_NAME = 'ui-geeks-ext-npm-dependencies';
export const REPORT_FILE_NAME = 'package-dep-report';

export const COMMANDS = {
  DEPENDENCY: `${extensionPrefix}.runGetDependency`
};

export const LOCAL_STORAGE = {
  OUTDATED_PACKAGES: 'outdatedPackages',
  VULNERABILITIES: 'vulnerabilities',
  ALL_VULNERABILITIES: 'all_vulnerabilities'
};

export const DEPENDENCY_META = {
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

export const MSGS = {
  PACKAGE_LOCK_JSON_NOT_FOUND: `Error: package-lock.json file not found!`,
  PACKAGE_JSON_NOT_FOUND: `Error: package.json file not found!`,
  INVALID_SELECTION: `Invalid Selection`,
  REPORT_CREATED: `Report downloaded successfully!`,
  PDF_ERROR: `Error generating PDF Report. Please try again later. You may need to open VSCode in Administrator mode.`,
  PREPARING_PDF: `Generating PDF, please wait...`
};

export const SEVERITY_TYPE = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MODERATE: 'Moderate',
  LOW: 'Low',
  INFO: 'Info',
  SUCCESS: 'Success',
  GENERAL: 'General',
  GREY: 'Grey'
};

export const VUL_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low'
};
