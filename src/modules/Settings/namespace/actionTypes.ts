import {IInjectedResource} from 'shared/helpers/injectResource';
import {IMode} from './index';

interface IChangeModalStatusPayload {
  status: boolean;
  mode: IMode;
}

interface IEditResourceAction extends IInjectedResource {
  type: 'SETTINGS_MODULE:EDIT_RESOURCE';
}

interface IEditOperatorsResourceAction extends IInjectedResource {
  type: 'SETTINGS_MODULE:EDIT_OPERATORS_RESOURCE';
}

interface IEditTemplatesResourceAction extends IInjectedResource {
  type: 'SETTINGS_MODULE:EDIT_TEMPLATES_RESOURCE';
}

interface IExecuteTemplatesResourceEdit extends IInjectedResource {
  type: 'SETTINGS_MODULE:EDIT_TEMPLATES_RESOURCE';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_MODAL_STATUS';
}

interface IStartDeleteRole extends IInjectedResource {
  type: 'SETTINGS_MODULE:START_DELETE_ROLE';
}

interface ISwitchRemoveModal extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_REMOVE_MODAL';
}

interface ISwitchAlertModal extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_ALERT_MODAL';
}

interface ISwitchSaveModal extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_SAVE_MODAL';
}

interface IAcceptDeleteResource extends IInjectedResource {
  type: 'SETTINGS_MODULE:ACCEPT_DELETE_ROLE';
}

interface ILoadrRolesTypes extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_ROLES_TYPES';
}

interface ILoadrRolesTypesSucces extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_ROLES_TYPES_SUCCES';
}

interface IAcceptDeleteResourceSuccess extends IInjectedResource {
  type: 'SETTINGS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS';
}

interface IAcceptDeleteResourceFailed extends IInjectedResource {
  type: 'SETTINGS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED';
}

interface IClearError extends IInjectedResource {
  type: 'SETTINGS_MODULE:CLEAR_ERROR';
}

interface ILoadRoleDescription extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_ROLE_DESCRIPTION';
}

interface ICreateRole extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_CREATE_ROLE';
}

interface ISaveChangeRole extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_CHANGE_ROLE';
}

interface ICreateOperatorsResource extends IInjectedResource {
  type: 'SETTINGS_MODULE:CREATE_OPERATORS_RESOURCE';
}

interface IDownloadReport extends IInjectedResource {
  type: 'SETTINGS_MODULE:DOWNLOAD_REPORT';
}

interface ISaveChangesOperatorsResource extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_CHANGES_OPERATORS_RESOURCE';
}

interface IRoleDescriptionSucces extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_ROLE_DESCRIPTION_SUCCES';
}

interface IRoleDescriptionFailed extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_ROLE_DESCRIPTION_FAILED';
}

interface ISaveFeatures extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_FEATURES';
}

interface ISaveTemplate extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_TEMPLATE';
}

interface ISaveBaseTemplate extends IInjectedResource {
  type: 'SETTINGS_MODULE:SAVE_BASE_TEMPLATE';
}

interface ILoadFeatures extends IInjectedResource {
  type: 'SETTINGS_MODULE:LOAD_FEATURES';
}

interface ISetFeaturesData extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_FEATURES_DATA';
}

interface ISetLoading extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_LOADING';
}

interface IAddBlockedPrinter extends IInjectedResource {
  type: 'SETTINGS_MODULE:ADD_BLOCKED_PRINTER';
}

interface IRemoveBlockedPrinter extends IInjectedResource {
  type: 'SETTINGS_MODULE:REMOVE_BLOCKED_PRINTER';
}

interface IStartDeleteBlockedPrinter extends IInjectedResource {
  type: 'SETTINGS_MODULE:START_DELETE_BLOCKED_PRINTER';
}

interface IGetCurrentVersion extends IInjectedResource {
  type: 'SETTINGS_MODULE:GET_CURRENT_VERSION';
}

interface IGetAvailableVersions extends IInjectedResource {
  type: 'SETTINGS_MODULE:GET_AVAILABLE_VERSIONS';
}

interface ISetCurrentVersion extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_CURRENT_VERSION';
}

interface ISetAvailableVersions extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_AVAILABLE_VERSIONS';
}

interface ISetLicenseInfo extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_LICENSE_INFO';
}

interface IGetLicenseInfo extends IInjectedResource {
  type: 'SETTINGS_MODULE:GET_LICENSE_INFO';
}

interface IGetAuthorities extends IInjectedResource {
  type: 'SETTINGS_MODULE:GET_AUTHORITIES';
}

interface ISetAuthorities extends IInjectedResource {
  type: 'SETTINGS_MODULE:GET_AUTHORITIES_SUCCESS';
}

interface ISetLicenseData extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_LICENSE_DATA';
}

interface ISetRoleTypes extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_ROLE_TYPES';
  payload: any;
}

interface ISetUserGroupTypes extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_USER_GROUP_TYPES';
  payload: any;
}

interface ISetPrinterGroupTypes extends IInjectedResource {
  type: 'SETTINGS_MODULE:SET_PRINTER_GROUP_TYPES';
  payload: any;
}

interface IStartEditLicenseInfo extends IInjectedResource {
  type: 'SETTINGS_MODULE:START_EDIT_LICENSE_INFO';
}

interface IExecuteUpdate extends IInjectedResource {
  type: 'SETTINGS_MODULE:EXECUTE_UPDATE';
}

interface ISwitchUpdateDialog extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_UPDATE_DIALOG';
}

interface ISwitchBlockDialog extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_BLOCK_DIALOG';
}

interface ISwitchLicenseDialog extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_LICENSE_DIALOG';
}

interface IAddLicense extends IInjectedResource {
  type: 'SETTINGS_MODULE:ADD_LICENSE';
}

interface IEditLicense extends IInjectedResource {
  type: 'SETTINGS_MODULE:EDIT_LICENSE';
}

interface IPushEditLicense extends IInjectedResource {
  type: 'SETTINGS_MODULE:PUSH_EDIT_LICENSE';
}

interface ISwitchLicenseModalStatusAction extends IInjectedResource {
  type: 'SETTINGS_MODULE:SWITCH_LICENSE_MODAL_STATUS';
}


type SettingsModuleActions = (
    ISwitchSaveModal
  | ISwitchRemoveModal
  | ISwitchAlertModal
  | IAcceptDeleteResource
  | IAcceptDeleteResourceSuccess
  | IAcceptDeleteResourceFailed
  | IClearError
  | ISwitchModalStatusAction
  | IStartDeleteRole
  | ILoadRoleDescription
  | IRoleDescriptionSucces
  | IRoleDescriptionFailed
  | ISaveChangeRole
  | ICreateRole
  | IEditOperatorsResourceAction
  | IEditTemplatesResourceAction
  | IExecuteTemplatesResourceEdit
  | ILoadrRolesTypesSucces
  | ICreateOperatorsResource
  | IDownloadReport
  | ISaveChangesOperatorsResource
  | ISaveFeatures
  | ISaveTemplate
  | ISaveBaseTemplate
  | ILoadFeatures
  | ISetFeaturesData
  | ISetLoading
  | IAddBlockedPrinter
  | IRemoveBlockedPrinter
  | IStartDeleteBlockedPrinter
  | IGetAvailableVersions
  | IGetCurrentVersion
  | ISetAvailableVersions
  | ISetCurrentVersion
  | ISetRoleTypes
  | ISetUserGroupTypes
  | ISetPrinterGroupTypes
  | IExecuteUpdate
  | ISwitchUpdateDialog
  | ISwitchBlockDialog
  | IStartEditLicenseInfo
  | IGetLicenseInfo
  | IGetAuthorities
  | ISetLicenseInfo
  | ISwitchLicenseDialog
  | ISetLicenseData
  | ISetAuthorities
  | IEditLicense
  | IPushEditLicense
  | IAddLicense
  | ISwitchLicenseModalStatusAction

  );

export {
  SettingsModuleActions,
  ISwitchLicenseModalStatusAction,
  IEditLicense,
  IPushEditLicense,
  IAddLicense,
  ISwitchRemoveModal,
  ISwitchAlertModal,
  ISwitchSaveModal,
  IAcceptDeleteResource,
  IAcceptDeleteResourceFailed,
  IClearError,
  IAcceptDeleteResourceSuccess,
  IEditResourceAction,
  ISwitchModalStatusAction,
  IStartDeleteRole,
  ILoadRoleDescription,
  IRoleDescriptionSucces,
  IRoleDescriptionFailed,
  ISaveChangeRole,
  IMode,
  IChangeModalStatusPayload,
  ICreateRole,
  IEditOperatorsResourceAction,
  IEditTemplatesResourceAction,
  IExecuteTemplatesResourceEdit,
  ILoadrRolesTypes,
  ILoadrRolesTypesSucces,
  ICreateOperatorsResource,
  IDownloadReport,
  ISaveChangesOperatorsResource,
  ISaveFeatures,
  ISaveTemplate,
  ISaveBaseTemplate,
  ILoadFeatures,
  ISetFeaturesData,
  ISetLoading,
  IAddBlockedPrinter,
  IRemoveBlockedPrinter,
  IStartDeleteBlockedPrinter,
  IGetCurrentVersion,
  IGetAvailableVersions,
  ISetCurrentVersion,
  ISetAvailableVersions,
  ISetLicenseInfo,
  IGetLicenseInfo,
  IGetAuthorities,
  ISetLicenseData,
  ISetRoleTypes,
  ISetUserGroupTypes,
  ISetPrinterGroupTypes,
  IExecuteUpdate,
  IStartEditLicenseInfo,
  ISwitchLicenseDialog,
  ISwitchUpdateDialog,
  ISwitchBlockDialog,
  ISetAuthorities
}
