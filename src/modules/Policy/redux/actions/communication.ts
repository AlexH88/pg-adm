import * as NS from '../../namespace';
import {IRuleGroup} from 'shared/types/policy';
import {IResource} from "../../../../shared/types/app";
import {IChangeOrderItems} from "../../../../features/showResource/namespace/actionTypes";

function activateResource(id: number): NS.IActivateResource {
  return { type: 'POLICY_MODULE:ACTIVATE_RESOURCE', payload: id };
}

function activateResourceSuccess(data: NS.IResponse): NS.IActivateResourceSuccess {
  return { type: 'POLICY_MODULE:ACTIVATE_RESOURCE_SUCCESS', payload: data };
}

function activateResourceFailed(data: NS.IFailedResponse): NS.IActivateResourceFailed {
  return { type: 'POLICY_MODULE:ACTIVATE_RESOURCE_FAILED', payload: data };
}

function deactivateResource(id: number): NS.IDeactivateResource {
  return { type: 'POLICY_MODULE:DEACTIVATE_RESOURCE', payload: id };
}

function deactivateResourceSuccess(data: NS.IResponse): NS.IDeactivateResourceSuccess {
  return { type: 'POLICY_MODULE:DEACTIVATE_RESOURCE_SUCCESS', payload: data };
}

function deactivateResourceFailed(data: NS.IFailedResponse): NS.IDeactivateResourceFailed {
  return { type: 'POLICY_MODULE:DEACTIVATE_RESOURCE_FAILED', payload: data };
}

function deleteResource(id: number): NS.IDeleteResource {
  return { type: 'POLICY_MODULE:DELETE_RESOURCE', payload: id };
}

function deleteResourceSuccess(data: NS.IResponse): NS.IDeleteResourceSuccess {
  return { type: 'POLICY_MODULE:DELETE_RESOURCE_SUCCESS', payload: data };
}

function deleteResourceFailed(data: NS.IFailedResponse): NS.IDeleteResourceFailed {
  return { type: 'POLICY_MODULE:DELETE_RESOURCE_FAILED', payload: data };
}

function acceptDelete(): NS.IAcceptDelete {
  return { type: 'POLICY_MODULE:ACCEPT_DELETE' };
}

function switchRemoveModal(): NS.ISwitchRemoveModal {
  return { type: 'POLICY_MODULE:SWITCH_REMOVE_MODAL' };
}

function switchWatermarksModal(): NS.ISwitchWatermarksModal {
  return { type: 'POLICY_MODULE:SWITCH_WATERMARKS_MODAL' };
}

function switchSaveModal(): NS.ISwitchSaveModal {
  return { type: 'POLICY_MODULE:SWITCH_SAVE_MODAL' };
}

function switchMarkModal(): NS.ISwitchMarkModal {
  return { type: 'POLICY_MODULE:SWITCH_MARK_MODAL' };
}

function switchModalStatus(data: any): NS.ISwitchCreateEditModal {
  return { type: 'POLICY_MODULE:SWITCH_CREATE_EDIT_MODAL', payload: data };
}

function switchAddModal(): NS.ISwitchAddModal {
  return { type: 'POLICY_MODULE:SWITCH_ADD_MODAL' };
}

function createResource(): NS.ICreateResource {
  return { type: 'POLICY_MODULE:CREATE_RESOURCE' };
}

function saveResource(): NS.ISaveResource {
  return { type: 'POLICY_MODULE:SAVE_RESOURCE' };
}

function createResourceSuccess(data: NS.IResponse): NS.ICreateResourceSuccess {
  return { type: 'POLICY_MODULE:CREATE_RESOURCE_SUCCESS', payload: data };
}

function createResourceFailed(data: NS.IFailedResponse): NS.ICreateResourceFailed {
  return { type: 'POLICY_MODULE:CREATE_RESOURCE_FAILED', payload: data };
}

function setEditPolicy(id: number, name: string): NS.ISetEditPolicy {
  return { type: 'POLICY_MODULE:SET_EDIT_POLICY', payload: { id, name } };
}

function getGroups(): NS.IGetGroups {
  return { type: 'POLICY_MODULE:GET_GROUPS' };
}

function getGroupsSuccess(userGroups: IRuleGroup, printerGroups: IRuleGroup): NS.IGetGroupsSuccess {
  return { type: 'POLICY_MODULE:GET_GROUPS_SUCCESS', payload: { userGroups, printerGroups } };
}

function getGroupsFailed({ error }: NS.IFailedResponse): NS.IGetGroupsFailed {
  return { type: 'POLICY_MODULE:GET_GROUPS_FAILED', payload: { error } };
}

function startEditRule(id: number): NS.IStartEditRule {
  return { type: 'POLICY_MODULE:START_EDIT_RULE', payload: { id } };
}

function startAddRule(): NS.IStartAddRule { // #Addrule
  return { type: 'POLICY_MODULE:START_ADD_RULE' };
}

function changeRuleData(): NS.IChangeRuleData {
  
  return { type: 'POLICY_MODULE:CHANGE_RULE_DATA' };
}

function addRuleData(): NS.IAddRuleData {  // #Addrule
  
  return { type: 'POLICY_MODULE:ADD_RULE_DATA' };
}

function startDeleteRule(id: number): NS.IStartDeleteRule {
  return { type: 'POLICY_MODULE:START_DELETE_RULE', payload: { id } };
}

function acceptDeleteRule(): NS.IAcceptDeleteRule {
  return { type: 'POLICY_MODULE:ACCEPT_DELETE_RULE' };
}

function sendRuleData(): NS.ISendRuleData {
  return { type: 'POLICY_MODULE:SEND_RULE_DATA' };
}

function sendRuleDataSuccess(data: NS.IResponse): NS.ISendRuleDataSuccess {
  return { type: 'POLICY_MODULE:SEND_RULE_DATA_SUCCESS', payload: data };
}

function sendRuleDataFailed({ error }: NS.IFailedResponse): NS.ISendRuleDataFailed {
  return { type: 'POLICY_MODULE:SEND_RULE_DATA_FAILED', payload: { error } };
}

function switchConfirmModal(): NS.ISwitchConfirmModal {
  return { type: 'POLICY_MODULE:SWITCH_CONFIRM_MODAL' };
}

function setProgrammErrorToRedux({ error }: NS.IFailedResponse): NS.ISetProgrammError {
  return { type: 'POLICY_MODULE:SET_ERROR_PROGRAMM', payload: { error } };
}

function changeOrderItems(data: IResource[][]): IChangeOrderItems {
  return { type: 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS', payload: data };
}

function setPolicyNoneEdit () {
  return { type : 'POLICY_MODULE:SET_POLICY_NONE_EDIT' }
}

function setPolicyEdit() {
  return { type : 'POLICY_MODULE:SET_POLICY_EDIT' }
}

function setMarkPolicyEdit(payload: any) {
  return { type : 'POLICY_MODULE:SET_MARK_POLICY_EDIT', payload }
}

function saveMarkPolicy(payload: any) {
  return { type : 'POLICY_MODULE:SAVE_MARK_POLICY', payload }
}

function loadTextData() {
  return { type : 'POLICY_MODULE:LOAD_TEXT_DATA' }
}

function uploadImage(file: any) {
  return { type : 'POLICY_MODULE:UPLOAD_IMAGE', payload: file }
}

function getImage() {
  return { type : 'POLICY_MODULE:GET_IMAGE' }
}

function setImageId() {
  return { type : 'POLICY_MODULE:SET_IMAGE_ID' }
}

function loadHostGroups() {
  return { type : 'POLICY_MODULE:LOAD_HOST_GROUPS' }
}

function setHostGroups(data: any[]) {
  return { type : 'POLICY_MODULE:SET_HOST_GROUPS', payload: data };
}

function startEditPolicy(data: any) {
  return { type : 'POLICY_MODULE:START_EDIT_POLICY', payload: data };
}

function activateAgentPolicy(state: boolean) {
  return { type : 'POLICY_MODULE:ACTIVATE_AGENT_POLICY', payload: state };
}

function startEditCopyPolicy(data: any) {
  return { type : 'POLICY_MODULE:START_EDIT_COPY_POLICY', payload: data };
}

function saveCopyPolicy() {
  return { type : 'POLICY_MODULE:SAVE_COPY_POLICY' };
}

function startEditEconomyPolicy(data: any) {
  return { type : 'POLICY_MODULE:START_EDIT_ECONOMY_POLICY', payload: data };
}

function saveEconomyPolicy() {
  return { type : 'POLICY_MODULE:SAVE_ECONOMY_POLICY' };
}

function switchDecryptModal() {
  return { type : 'POLICY_MODULE:SWITCH_DECRYPT_MODAL' };
}

function decrypt() {
  return { type : 'POLICY_MODULE:DECRYPT' };
}

function setDecryptMessage(message: string) {
  return { type: 'POLICY_MODULE:SET_DECRYPT_MESSAGE', payload: message }
}

function startEditTextMark(data: any) {
  return { type: 'POLICY_MODULE:START_EDIT_TEXT_MARK', payload: data }
}

function getWatermarksSettings(data: number) {
  return { type: 'POLICY_MODULE:GET_WATERMARKS_SETTINGS', payload: data };
}

function setWatermarksSettings(id: number, data: any) {
  return { type: 'POLICY_MODULE:SET_WATERMARKS_SETTINGS', payload: { id, data } };
}

function setWatermarks(data: any) {
  return { type: 'POLICY_MODULE:SET_WATERMARKS', payload: data };
}

function clearSetWatermarks() {
  return { type: 'POLICY_MODULE:CLEAR_TOAST_WATERMARK' };
}

export {
  activateResource,
  activateResourceSuccess,
  activateResourceFailed,
  deactivateResource,
  deactivateResourceSuccess,
  deactivateResourceFailed,
  deleteResource,
  deleteResourceSuccess,
  deleteResourceFailed,
  acceptDelete,
  switchRemoveModal,
  switchWatermarksModal,
  switchModalStatus,
  createResource,
  createResourceSuccess,
  createResourceFailed,
  saveResource,
  setEditPolicy,
  getGroups,
  getGroupsSuccess,
  getGroupsFailed,
  startEditRule,
  changeRuleData,
  addRuleData, // #Addrule
  switchAddModal, // #AddRule
  startAddRule, // #AddRule,
  switchMarkModal,
  startDeleteRule,
  acceptDeleteRule,
  sendRuleData,
  sendRuleDataSuccess,
  sendRuleDataFailed,
  switchConfirmModal,
  setProgrammErrorToRedux,
  changeOrderItems,
  switchSaveModal,
  setPolicyNoneEdit,
  setPolicyEdit,
  setMarkPolicyEdit,
  saveMarkPolicy,
  loadTextData,
  uploadImage,
  getImage,
  setImageId,
  loadHostGroups,
  setHostGroups,
  startEditPolicy,
  activateAgentPolicy,
  startEditCopyPolicy,
  startEditEconomyPolicy,
  saveCopyPolicy,
  saveEconomyPolicy,
  switchDecryptModal,
  decrypt,
  setDecryptMessage,
  startEditTextMark,
  getWatermarksSettings,
  setWatermarksSettings,
  setWatermarks,
  clearSetWatermarks
};
