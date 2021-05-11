import { 
  IEditResourceAction,
	ITestPostConnection,
  IEditPayload,
  ICreateResourceAction,
	ISwitchModalStatusAction, 
	IChangeModalStatusPayload, 
	ITestConnentSuccess,
	IGetCurrentStatusIntegration,
  ITextConnectClear,
  IDisableIntegration,
  IEnableIntegration,
  IChangeCatalogFormField,
  IDeleteResourceAction,
  ISaveEditResourceAction,
  IAcceptDeleteAction,
  ISwitchRemoveModalStatusAction,
  ISwitchSyncModal,
  } from '../../namespace';

import {
    IDisableCatalog,
    IEnableCatalog,
    ITestCatalogConnection,
    ISetEditCatalogData,
    ISetEditChoosenCatalogName,
    ISyncCatalogData,
    IGetCatalogs,
    IGetCatalogGroups,
    IUpdateCatalogGroups,
    ISetCatalogGroupsList,
    ISetCatalogsList
} from '../../namespace/actionTypes';


function editResource({ id, mode }: IEditPayload): IEditResourceAction {
  return { type: 'INTEGRATION-MODULE:EDIT_RESOURCE', payload: { id, mode } };
}

function createResource(): ICreateResourceAction {
  return { type: 'INTEGRATION-MODULE:CREATE_RESOURCE' };
}

function switchModalStatus({ status, mode }: IChangeModalStatusPayload): ISwitchModalStatusAction {
  return { type: 'INTEGRATION-MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function testPostConnection(data: any): ITestPostConnection {
  return { type: 'INTEGRATION-MODULE:TEST_POST_CONNECTION', payload: data };
}

function testConnentSuccess(message: string): ITestConnentSuccess {
  return { type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS', payload: message };
}

function getCurrentStatusIntegration(): IGetCurrentStatusIntegration {
  return { type: 'INTEGRATION-MODULE:GET_CURRENT_STATUS_INTEGRATION' };
}

function testConnentClear(): ITextConnectClear {
  return { type: 'INTEGRATION-MODULE:TEST_CONNECT_CLEAR' };
}

function disableIntegration(id: number): IDisableIntegration {
  return { type: 'INTEGRATION-MODULE:DISABLE_INTEGRATION', payload: id };
}

function enableIntegration(id: number): IEnableIntegration {
  return { type: 'INTEGRATION-MODULE:ENABLE_INTEGRATION', payload: id };
}

function changeCatalogFormField(field: string): IChangeCatalogFormField {
  return { type: 'INTEGRATION-MODULE:CHANGE_CATALOG_FORM_FIELD', payload: field };
}

function deleteResource(id: number): IDeleteResourceAction {
  return { type: 'INTEGRATION-MODULE:DELETE_RESOURCE', payload: id };
}

function saveEditResource(): ISaveEditResourceAction {
  return { type: 'INTEGRATION-MODULE:SAVE_EDIT_RESOURCE' };
}

function acceptDelete(): IAcceptDeleteAction {
  return { type: 'INTEGRATION-MODULE:ACCEPT_DELETE' };
}

function switchRemoveModalStatus(value: boolean): ISwitchRemoveModalStatusAction {
  return { type: 'INTEGRATION-MODULE:SWITCH_REMOVE_MODAL_STATUS', payload: value };
}

function disableCatalog(id: number): IDisableCatalog {
  return { type: 'INTEGRATION-MODULE:DISABLE_CATALOG', payload: id };
}

function enableCatalog(id: number): IEnableCatalog {
  return { type: 'INTEGRATION-MODULE:ENABLE_CATALOG', payload: id };
}

function testCatalogConnection(id: number | null): ITestCatalogConnection {
  return { type: 'INTEGRATION-MODULE:TEST_CATALOG_CONNECTION', payload: id };
}

function setEditCatalogData(data: string): ISetEditCatalogData {
  return { type: 'INTEGRATION-MODULE:SET_EDIT_CATALOG_DATA', payload: data };
}

function setEditChoosenCatalogName(data: string): ISetEditChoosenCatalogName {
  return { type: 'INTEGRATION-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME', payload: data };
}

function switchSyncModal(): ISwitchSyncModal {
  return { type: 'INTEGRATION-MODULE:SWITCH_SYNC_MODAL' };
}

function syncCatalogData(id: number): ISyncCatalogData {
  return { type: 'INTEGRATION-MODULE:SYNC_CATALOG_DATA', payload: id };
}

function getCatalogs(): IGetCatalogs {
  return { type: 'INTEGRATION-MODULE:GET_CATALOGS' };
}

function getCatalogGroups(id: number | null): IGetCatalogGroups {
  return { type: 'INTEGRATION-MODULE:GET_CATALOG_GROUPS', payload: id };
}

function updateCatalogGroups(id: number | null, data: number[]): IUpdateCatalogGroups {
  return { type: 'INTEGRATION-MODULE:UPDATE_CATALOG_GROUPS', payload: { id, data } };
}

function setCatalogGroupsList(id: number, data: any): ISetCatalogGroupsList {
  return { type: 'INTEGRATION-MODULE:SET_CATALOG_GROUPS_LIST', payload: { id, data } };
}

function setCatalogsList(data: any): ISetCatalogsList {
  return { type: 'INTEGRATION-MODULE:SET_CATALOGS_LIST', payload: data };
}

export {
  editResource,
  createResource,
  switchModalStatus,
  testConnentSuccess,
  testPostConnection,
  getCurrentStatusIntegration,
  testConnentClear,
  disableIntegration,
  enableIntegration,
  changeCatalogFormField,
  deleteResource,
  saveEditResource,
  acceptDelete,
  switchRemoveModalStatus,
  disableCatalog,
  enableCatalog,
  testCatalogConnection,
  setEditCatalogData,
  setEditChoosenCatalogName,
  switchSyncModal,
  syncCatalogData,
  getCatalogs,
  getCatalogGroups,
  updateCatalogGroups,
  setCatalogGroupsList,
  setCatalogsList
};
