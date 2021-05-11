import * as NS from '../../namespace';

function switchRemoveModal(): NS.ISwitchRemoveModal {
  return { type: 'SETTINGS_MODULE:SWITCH_REMOVE_MODAL' };
}

function switchAlertModal(): NS.ISwitchAlertModal {
  return { type: 'SETTINGS_MODULE:SWITCH_ALERT_MODAL' };
}

function switchSaveModal(): NS.ISwitchSaveModal {
  return { type: 'SETTINGS_MODULE:SWITCH_SAVE_MODAL' };
}

function switchModalStatus({ status, mode }: NS.IChangeModalStatusPayload): NS.ISwitchModalStatusAction {
  return { type: 'SETTINGS_MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function createRole(): NS.ICreateRole {
  return { type: 'SETTINGS_MODULE:SAVE_CREATE_ROLE' };
}

function editResource(id: number): NS.IEditResourceAction {
  return { type: 'SETTINGS_MODULE:EDIT_RESOURCE', payload: id };
}

function editOperatorsResource(id: number): NS.IEditOperatorsResourceAction {
  return { type: 'SETTINGS_MODULE:EDIT_OPERATORS_RESOURCE', payload: id };
}

function editTemplatesResource(id: number): NS.IEditTemplatesResourceAction {
  return { type: 'SETTINGS_MODULE:EDIT_TEMPLATES_RESOURCE', payload: id };
}

function startDeleteRole(id: number): NS.IStartDeleteRole {
  return { type: 'SETTINGS_MODULE:START_DELETE_ROLE', payload: id };
}

function acceptDeleteRole(id: number): NS.IAcceptDeleteResource {
  return { type: 'SETTINGS_MODULE:ACCEPT_DELETE_ROLE', payload: id };
}

function acceptDeleteResourceSuccess(data: NS.IPayloadAcceptDeleteSuccess): NS.IAcceptDeleteResourceSuccess {
  return { type: 'SETTINGS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS', payload: data };
}

function acceptDeleteResourceFailed({ error }: NS.IPayloadTryDeleteResourceFailed): NS.IAcceptDeleteResourceFailed {
  return { type: 'SETTINGS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED', payload: { error } };
}

function clearError(): NS.IClearError {
  return { type: 'SETTINGS_MODULE:CLEAR_ERROR' };
}

function saveChangeRole(): NS.ISaveChangeRole {
  return { type: 'SETTINGS_MODULE:SAVE_CHANGE_ROLE' };
}

function createOperatorsResourse(): NS.ICreateOperatorsResource {
  return { type: 'SETTINGS_MODULE:CREATE_OPERATORS_RESOURCE' };
}

function downloadReport(): NS.IDownloadReport {
  return { type: 'SETTINGS_MODULE:DOWNLOAD_REPORT' };
}

function saveChangesOperatorsResource(): NS.ISaveChangesOperatorsResource {
  return { type: 'SETTINGS_MODULE:SAVE_CHANGES_OPERATORS_RESOURCE' };
}

function saveFeatures(data: any): NS.ISaveFeatures { // TODO Type
  return { type: 'SETTINGS_MODULE:SAVE_FEATURES', payload: data };
}

function saveTemplate(): NS.ISaveTemplate { // TODO Type
  return { type: 'SETTINGS_MODULE:SAVE_TEMPLATE' };
}

function saveBaseTemplate(): NS.ISaveBaseTemplate { // TODO Type
  return { type: 'SETTINGS_MODULE:SAVE_BASE_TEMPLATE' };
}

function loadFeatures(): NS.ILoadFeatures {
  return { type: 'SETTINGS_MODULE:LOAD_FEATURES' };
}

function setFeaturesData(data: any): NS.ISetFeaturesData {
  return { type: 'SETTINGS_MODULE:SET_FEATURES_DATA', payload: data };
}

function addBlockedPrinter(data: string): NS.IAddBlockedPrinter {
  return { type: 'SETTINGS_MODULE:ADD_BLOCKED_PRINTER', payload: data };
}

function removeBlockedPrinter(data: string | null): NS.IRemoveBlockedPrinter {
  return { type: 'SETTINGS_MODULE:REMOVE_BLOCKED_PRINTER', payload: data };
}

function startDeleteBlockedPrinter(data: string): NS.IStartDeleteBlockedPrinter {
  return { type: 'SETTINGS_MODULE:START_DELETE_BLOCKED_PRINTER', payload: data };
}

function getCurrentVersion(): NS.IGetCurrentVersion {
  return { type: 'SETTINGS_MODULE:GET_CURRENT_VERSION' };
}

function getAvailableVersions(): NS.IGetAvailableVersions {
  return { type: 'SETTINGS_MODULE:GET_AVAILABLE_VERSIONS' };
}

function setCurrentVersion(version: any): NS.ISetCurrentVersion {
  return { type: 'SETTINGS_MODULE:SET_CURRENT_VERSION', payload: version };
}

function setAvailableVersions(versions: any[]): NS.ISetAvailableVersions {
  return { type: 'SETTINGS_MODULE:SET_AVAILABLE_VERSIONS', payload: versions };
}

function saveLicenseInfo(): NS.ISetLicenseInfo {
  return { type: 'SETTINGS_MODULE:SET_LICENSE_INFO' };
}

function getLicenseInfo(): NS.IGetLicenseInfo {
  return { type: 'SETTINGS_MODULE:GET_LICENSE_INFO' };
}

function setLicenseData(data: any): NS.ISetLicenseData {
  return { type: 'SETTINGS_MODULE:SET_LICENSE_DATA', payload: data };
}

function startEditLicenseInfo(): NS.IStartEditLicenseInfo {
  return { type: 'SETTINGS_MODULE:START_EDIT_LICENSE_INFO' };
}

function switchLicenseDialog(): NS.ISwitchLicenseDialog {
  return { type: 'SETTINGS_MODULE:SWITCH_LICENSE_DIALOG' };
}

function executeUpdate(): NS.IExecuteUpdate {
  return { type: 'SETTINGS_MODULE:EXECUTE_UPDATE' };
}

function switchUpdateModal(): NS.ISwitchUpdateDialog {
  return { type: 'SETTINGS_MODULE:SWITCH_UPDATE_DIALOG' };
}

function switchBlockModal(): NS.ISwitchBlockDialog {
  return { type: 'SETTINGS_MODULE:SWITCH_BLOCK_DIALOG' };
}

function switchLicenseModal(): NS.ISwitchLicenseDialog {
  return { type: 'SETTINGS_MODULE:SWITCH_LICENSE_DIALOG' };
}

function loadSmtpConfig() {
  return { type: 'SETTING_MODULE:LOAD_SMTP' }
}

function saveSmtpConfig() {
  return { type: 'SETTING_MODULE:SAVE_SMTP' }
}

function getAuthorities(): NS.IGetAuthorities {
  return { type: 'SETTINGS_MODULE:GET_AUTHORITIES' };
}

function addLicense(): NS.IAddLicense {
  return { type: 'SETTINGS_MODULE:ADD_LICENSE'}
}

function editLicense(id: number): NS.IEditLicense {
  return { type: 'SETTINGS_MODULE:EDIT_LICENSE', payload: id }
}

function pushEditLicense(id: number): NS.IPushEditLicense {
  return { type: 'SETTINGS_MODULE:PUSH_EDIT_LICENSE', payload: id }
}

function switchLicenseModalStatus({ status, mode, licenseId }): NS.ISwitchLicenseModalStatusAction {
  return { type: 'SETTINGS_MODULE:SWITCH_LICENSE_MODAL_STATUS', payload: { status, mode, licenseId } };
}

export {
  addLicense,
  pushEditLicense,
  editLicense,
  editResource,
  switchLicenseModalStatus,
  switchRemoveModal,
  switchAlertModal,
  startDeleteRole,
  acceptDeleteRole,
  acceptDeleteResourceSuccess,
  acceptDeleteResourceFailed,
  clearError,
  switchModalStatus,
  saveChangeRole,
  createRole,
  editOperatorsResource,
  editTemplatesResource,
  createOperatorsResourse,
  downloadReport,
  saveChangesOperatorsResource,
  switchSaveModal,
  saveFeatures,
  saveTemplate,
  saveBaseTemplate,
  loadFeatures,
  setFeaturesData,
  addBlockedPrinter,
  removeBlockedPrinter,
  startDeleteBlockedPrinter,
  getCurrentVersion,
  getAvailableVersions,
  setCurrentVersion,
  setAvailableVersions,
  executeUpdate,
  switchUpdateModal,
  switchBlockModal,
  loadSmtpConfig,
  saveSmtpConfig,
  startEditLicenseInfo,
  switchLicenseModal,
  saveLicenseInfo,
  getLicenseInfo,
  setLicenseData,
  getAuthorities
};
