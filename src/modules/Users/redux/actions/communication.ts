import {
    IAcceptDeleteAction,
    IChangeAllItemsSelect,
    IChangeCatalogFormField,
    IChangeModalStatusPayload,
    ICheckedUserMultiEditAction,
    ICheckedUsersGroupEditAction,
    ICreateResourceAction,
    IDeleteCheckedUsersAction,
    IDeleteResourceAction,
    IEditPayload,
    IEditResourceAction,
    IEraseSelectedUsers,
    ISaveEditResourceAction,
    ISwichAllSelectedCheckboxStatus,
    ISwitchModalStatusAction,
    ISwitchModalLoadFileStatusAction,
    ISwitchRemoveModalStatusAction,
    ISwitchSyncModal,
    ISwitchUsersMultiEditStatusAction,
    ITextConnectSuccess,
    ITextConnectClear,
    ILoadFileErrorClear,
    IClearUsersOutsideDB,
    IClearUpdateCardStatus,
} from '../../namespace';
import {IUser} from 'shared/types/users';
import {
    IDisableCatalog,
    IUpdateUsers,
    IEnableCatalog,
    IGetCatalogGroups,
    IGetCatalogs,
    ISetCatalogGroupsList,
    ISetCatalogsList,
    ISetEditCatalogData,
    ISetEditChoosenCatalogName,
    ISyncCatalogData,
    ITestCatalogConnection,
    IUpdateCatalogGroups
} from '../../namespace/actionTypes';

function createResource(): ICreateResourceAction {
  return { type: 'USERS-MODULE:CREATE_RESOURCE' };
}

function switchAllSelectedCheckboxStatus(status: boolean): ISwichAllSelectedCheckboxStatus {
  return { type: 'USERS-MODULE:SWITCH_ALL_SELECTED_CHECKBOX_STATUS', payload: status };
}

function changeAllItemsSelect(): IChangeAllItemsSelect {
  return { type: 'USERS-MODULE:CHANGE_ALL_ITEMS_SELECT' };
}

function switchUsersMultiEditStatus(): ISwitchUsersMultiEditStatusAction {
  return { type: 'USERS-MODULE:SWITCH_MULTI_EDIT_STATUS' };
}

function editResource({ id, mode }: IEditPayload): IEditResourceAction {
  return { type: 'USERS-MODULE:EDIT_RESOURCE', payload: { id, mode } };
}

function saveEditResource(): ISaveEditResourceAction {
  return { type: 'USERS-MODULE:SAVE_EDIT_RESOURCE' };
}

function deleteResource(id: number): IDeleteResourceAction {
  return { type: 'USERS-MODULE:DELETE_RESOURCE', payload: id };
}

function switchModalStatus({ status, mode }: IChangeModalStatusPayload): ISwitchModalStatusAction {
  return { type: 'USERS-MODULE:SWITCH_MODAL_STATUS', payload: { status, mode } };
}

function switchModalLoadFileStatus(status: boolean): ISwitchModalLoadFileStatusAction {
  return { type: 'USERS-MODULE:SWITCH_MODAL_LOAD_FILE_STATUS', payload: status };
}

function switchRemoveModalStatus(value: boolean): ISwitchRemoveModalStatusAction {
  return { type: 'USERS-MODULE:SWITCH_REMOVE_MODAL_STATUS', payload: value };
}

function switchSyncModal(): ISwitchSyncModal {
  return { type: 'USERS-MODULE:SWITCH_SYNC_MODAL' };
}

function acceptDelete(): IAcceptDeleteAction {
  return { type: 'USERS-MODULE:ACCEPT_DELETE' };
}

function eraseSelectedUsers(): IEraseSelectedUsers {
  return { type: 'USERS-MODULE:ERASE_SELECTED_USERS' };
}

function checkedUserMultiEdit(user: IUser): ICheckedUserMultiEditAction {
  return { type: 'USERS-MODULE:CHECKED_USER_MULTI_EDIT', payload: user };
}

function deleteCheckedUsers(users: IUser[]): IDeleteCheckedUsersAction {
  return { type: 'USERS-MODULE:CHECKED_USERS_DELETE', payload: users };
}

function checkedUsersGroupsEdit(users: IUser[]): ICheckedUsersGroupEditAction {
  return { type: 'USERS-MODULE:CHECKED_USERS_GROUPS_EDIT', payload: users };
}

function changeCatalogFormField(field: string): IChangeCatalogFormField {
  return { type: 'USERS-MODULE:CHANGE_CATALOG_FORM_FIELD', payload: field };
}

function setEditChoosenCatalogName(data: string): ISetEditChoosenCatalogName {
  return { type: 'USERS-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME', payload: data };
}

function setEditCatalogData(data: string): ISetEditCatalogData {
  return { type: 'USERS-MODULE:SET_EDIT_CATALOG_DATA', payload: data };
}

function disableCatalog(id: number): IDisableCatalog {
  return { type: 'USERS-MODULE:DISABLE_CATALOG', payload: id };
}

function updateUsers(data: any): IUpdateUsers {
  return { type: 'USERS-MODULE:UPDATE_USERS', payload: data };
}

function enableCatalog(id: number): IEnableCatalog {
  return { type: 'USERS-MODULE:ENABLE_CATALOG', payload: id };
}

function syncCatalogData(id: number): ISyncCatalogData {
  return { type: 'USERS-MODULE:SYNC_CATALOG_DATA', payload: id };
}

function testCatalogConnection(id: number | null): ITestCatalogConnection {
  return { type: 'USERS-MODULE:TEST_CATALOG_CONNECTION', payload: id };
}

function getCatalogs(): IGetCatalogs {
  return { type: 'USERS-MODULE:GET_CATALOGS' };
}

function getCatalogGroups(id: number | null): IGetCatalogGroups {
  return { type: 'USERS-MODULE:GET_CATALOG_GROUPS', payload: id };
}

function updateCatalogGroups(id: number | null, data: number[]): IUpdateCatalogGroups {
  return { type: 'USERS-MODULE:UPDATE_CATALOG_GROUPS', payload: { id, data } };
}

function setCatalogsList(data: any): ISetCatalogsList {
  return { type: 'USERS-MODULE:SET_CATALOGS_LIST', payload: data };
}

function setCatalogGroupsList(id: number, data: any): ISetCatalogGroupsList {
  return { type: 'USERS-MODULE:SET_CATALOG_GROUPS_LIST', payload: { id, data } };
}

function testConnentSuccess(message: string): ITextConnectSuccess {
  return { type: 'USERS-MODULE:TEST_CONNECT_SUCCESS', payload: message };
}

function testConnentClear(): ITextConnectClear {
  return { type: 'USERS-MODULE:TEST_CONNECT_CLEAR' };
}

function loadFileErrorClear(): ILoadFileErrorClear {
  return { type: 'USERS-MODULE:LOAD_FILE_ERROR_CLEAR' };
}

function clearUsersOutsideDB(): IClearUsersOutsideDB {
  return { type: 'USERS-MODULE:LOAD_FILE_DATA_SUCCESS_CLEAR' };
}

function clearUpdateCardStatus(): IClearUpdateCardStatus {
  return { type: 'USERS-MODULE:LOAD_FILE_DATA_STATUS', payload: false };
}

export {
  createResource,
  editResource,
  saveEditResource,
  deleteResource,
  acceptDelete,
  switchModalStatus,
  switchModalLoadFileStatus,
  switchSyncModal,
  switchRemoveModalStatus,
  switchUsersMultiEditStatus,
  checkedUserMultiEdit,
  deleteCheckedUsers,
  checkedUsersGroupsEdit,
  changeCatalogFormField,
  switchAllSelectedCheckboxStatus,
  changeAllItemsSelect,
  eraseSelectedUsers,
  setEditChoosenCatalogName,
  syncCatalogData,
  setEditCatalogData,
  disableCatalog,
  updateUsers,
  enableCatalog,
  testCatalogConnection,
  getCatalogs,
  getCatalogGroups,
  updateCatalogGroups,
  setCatalogsList,
  setCatalogGroupsList,
  testConnentSuccess,
  testConnentClear,
  loadFileErrorClear,
  clearUsersOutsideDB,
  clearUpdateCardStatus
};
