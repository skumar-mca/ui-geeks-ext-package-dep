export type IRecord = Record<string, any>;

export interface IAppMetaInfo {
  appName: string;
  version: string;
  description?: string;
}

export interface IWebRenderer {
  initialized: boolean;
  projectId: string;
  template?: any;
  title?: string;
  panel?: any;
  panelId?: string | null;
  context: any;
  content: any;
  appMeta: any;
  parentPath: string;
  extensionPath: string;
  outdatedPackages?: Array<any>;
  packagesWithVersion: Record<string, any>;
  pkgJSON: any | null;
  uri: any;
  packageLockFile: any;
  pckName?: string;
  scanAudit?: boolean;
  scanOutdated?: boolean;
  auditingOutdatedPackages?: boolean;
  auditingVulnerabilities?: boolean;

  summary: {
    vulnerabilities: Array<INPMAuditResponseType>;
    outdatedPackages: Array<IOutdatedPackageType>;
  };

  init: (context: IRecord) => void;
  setAppMetaData: (appInfo: IAppMetaInfo) => void;
  renderContent: (content: string) => void;
  renderError: (data: Record<string, any>) => void;
  renderLoader: () => void;
  sendMessageToUI: (command: string, data: IRecord) => void;
  isAuditing: boolean;
}

interface VulFixType {
  isSemVerMajor: boolean;
  name: string;
  version: string;
}

export interface INPMAuditVulnerabilityType {
  isNoVul?: boolean;
  configuredVersion: string;
  installedVersion: string;
  range?: string;
  severity: 'critical' | 'high' | 'moderate' | 'low';
  title?: string;
  url?: string;
  viaPackage?: string;
  fixAvailable?: 'Yes' | 'No' | 'Breaking';
  isBreakingChange?: boolean;
  fixPackageName?: string;
  fixPackageVersion?: string;
  cwe?: Array<string>;
  cvss?: { score: number; vectorString: string };
  recommendation?: string;
}

export interface INPMAuditResponseType {
  id: string;
  packageName: string;
  dependencyType: 'Prod' | 'Dev' | 'Peer' | 'Optional';
  version: string;
  hasVulnerability: boolean;
  count: { c: number; h: number; m: number; l: number; t: number };
  vulnerabilities?: Array<INPMAuditVulnerabilityType>;
}

export interface IOutdatedPackageType {
  packageName: string;
  version: string;
  id: string;
  current: string;
  wanted: string;
  latest: string;
  dependent: string;
  location: string;
  severity?: number;
  dependencyType: 'Prod' | 'Dev' | 'Peer' | 'Optional';
}

export type DEPENDENCY_TYPE = 'Prod' | 'Dev' | 'Peer' | 'Optional';
