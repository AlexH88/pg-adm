interface ISmtpConfig {
  active: boolean;
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
}

interface ISmtpInfo extends ISmtpConfig {
  active: boolean;
}

interface IReduxState {
  showRemoveModal: boolean;
  showAlertModal?: boolean;
  showSaveModal: boolean;
  showModal: boolean;
  deletingRole: number | null;
  ruleDescription: IRuleDescription[];
  modalMode: IMode;
  featuresData: any;
  isLoading: boolean;
  deletingPrinter: string | null;
  currentVersion: any;
  availableVersions: any[];
  showUpdateDialog: boolean;
  showBlockDialog: boolean;
  showLicenseDialog: boolean;
  licenseData: any; // TODO
  authorities:[];
  error: string;
  editModalId: null | number
}

interface IPayloadTryDeleteResourceSuccess {
  response: {
    printer: string;
  };
  id: number | string;
}

interface IPayloadTryDeleteResourceFailed {
  error: string;
}

interface IPayloadAcceptDeleteSuccess {
  response: {};
}

interface IRule {
  [key: string]: boolean;
}

interface IRole {
  id: number;
  name: string;
  description: string;
  accessRules: IRule;
  access_rules?: IRule;
  authorities: [];
}

interface IData {
  name: string;
  description: string;
  accessRules?: IRule;
  authorities?: [];
}

interface IConvertedRole {
  id: number;
  description: string;
  name: string;
//  [key: string]: boolean | string | number;
  authorities?: [];
}

interface IRuleDescription {
  name: string;
  displayName: string;
}

type IMode = 'edit' | 'create'| '';

export {
  IReduxState,
  IPayloadTryDeleteResourceSuccess,
  IPayloadTryDeleteResourceFailed,
  IPayloadAcceptDeleteSuccess,
  IRole,
  IConvertedRole,
  IRuleDescription,
  IRule,
  IData,
  IMode,
  ISmtpConfig,
  ISmtpInfo
}

export * from './actionTypes';
export * from './apiCommunication';
