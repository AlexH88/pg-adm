import {IInjectedResource} from 'shared/helpers/injectResource';
import {IMode} from './index';

interface IEditPayload {
  id: number;
  mode: IMode;
}

interface IChangeModalStatusPayload {
  status: boolean;
  mode: IMode;
}

interface ICreateResourceAction extends IInjectedResource {
  type: 'USERS-MODULE:CREATE_RESOURCE';
}

interface ICreateResourceSuccessAction extends IInjectedResource {
  type: 'USERS-MODULE:CREATE_RESOURCE_SUCCESS';
}

interface IEditResourceAction extends IInjectedResource {
  type: 'USERS-MODULE:EDIT_RESOURCE';
}

interface IDeleteUserLogin extends IInjectedResource {
  type: 'USERS-MODULE:DELETE_USER_LOGIN';
}

interface ISaveEditResourceAction extends IInjectedResource {
  type: 'USERS-MODULE:SAVE_EDIT_RESOURCE';
}

interface IDeleteResourceAction extends IInjectedResource {
  type: 'USERS-MODULE:DELETE_RESOURCE';
}

interface IAcceptDeleteAction extends IInjectedResource {
  type: 'USERS-MODULE:ACCEPT_DELETE';
}

interface IEraseSelectedUsers extends IInjectedResource {
  type: 'USERS-MODULE:ERASE_SELECTED_USERS';
}

interface IDeleteResourceSuccessAction extends IInjectedResource {
  type: 'USERS-MODULE:DELETE_RESOURCE_SUCCESS';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_MODAL_STATUS';
}

interface ISwitchModalLoadFileStatusAction extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_MODAL_LOAD_FILE_STATUS';
}

interface ISwitchRemoveModalStatusAction extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_REMOVE_MODAL_STATUS';
}

interface ISwitchSyncModal extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_SYNC_MODAL';
}

interface ISwitchUsersMultiEditStatusAction extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_MULTI_EDIT_STATUS';
}

interface ISwichAllSelectedCheckboxStatus extends IInjectedResource {
  type: 'USERS-MODULE:SWITCH_ALL_SELECTED_CHECKBOX_STATUS';
}

interface IChangeAllItemsSelect extends IInjectedResource {
  type: 'USERS-MODULE:CHANGE_ALL_ITEMS_SELECT';
}

interface ICheckedUserMultiEditAction extends IInjectedResource {
  type: 'USERS-MODULE:CHECKED_USER_MULTI_EDIT';
}

interface IDeleteCheckedUsersAction extends IInjectedResource {
  type: 'USERS-MODULE:CHECKED_USERS_DELETE';
}

interface ICheckedUsersGroupEditAction extends IInjectedResource {
  type: 'USERS-MODULE:CHECKED_USERS_GROUPS_EDIT';
}

interface IChangeCatalogFormField extends IInjectedResource {
  type: 'USERS-MODULE:CHANGE_CATALOG_FORM_FIELD' | 'USERS-MODULE:TEST_CONNECT_SUCCESS';
}


interface ITextConnectSuccess extends IInjectedResource {
  type: 'USERS-MODULE:TEST_CONNECT_SUCCESS';
}

interface ITextConnectClear extends IInjectedResource {
  type: 'USERS-MODULE:TEST_CONNECT_CLEAR';
}

interface IClearUsersOutsideDB extends IInjectedResource {
  type: 'USERS-MODULE:LOAD_FILE_DATA_SUCCESS_CLEAR';
}

interface IClearUpdateCardStatus extends IInjectedResource {
  type: 'USERS-MODULE:LOAD_FILE_DATA_STATUS';
}

interface ILoadFileErrorClear extends IInjectedResource {
  type: 'USERS-MODULE:LOAD_FILE_ERROR_CLEAR';
}

interface ISendCatalogData extends IInjectedResource {
  type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA';
}

interface ISendCatalogDataSuccess extends IInjectedResource {
  type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_SUCCESS';
}

interface ISendCatalogDataFailed extends IInjectedResource {
  type: 'USERS-MODULE:SEND_TEMP_CATALOG_DATA_FAILED';
}

interface ISetEditChoosenCatalogName extends IInjectedResource {
  type: 'USERS-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME';
}

interface ISyncCatalogData extends IInjectedResource  {
  type: 'USERS-MODULE:SYNC_CATALOG_DATA';
}

interface IEnableCatalog extends IInjectedResource  {
  type: 'USERS-MODULE:ENABLE_CATALOG';
}

interface IDisableCatalog extends IInjectedResource  {
  type: 'USERS-MODULE:DISABLE_CATALOG';
}

interface IUpdateUsers extends IInjectedResource  {
  type: 'USERS-MODULE:UPDATE_USERS';
}

interface ITestCatalogConnection extends IInjectedResource  {
  type: 'USERS-MODULE:TEST_CATALOG_CONNECTION';
}

interface IGetCatalogs extends IInjectedResource  {
  type: 'USERS-MODULE:GET_CATALOGS';
}

interface IGetCatalogGroups extends IInjectedResource  {
  type: 'USERS-MODULE:GET_CATALOG_GROUPS';
}

interface IUpdateCatalogGroups extends IInjectedResource  {
  type: 'USERS-MODULE:UPDATE_CATALOG_GROUPS';
}

interface ISetCatalogsList extends IInjectedResource  {
  type: 'USERS-MODULE:SET_CATALOGS_LIST';
}

interface ISetCatalogGroupsList extends IInjectedResource  {
  type: 'USERS-MODULE:SET_CATALOG_GROUPS_LIST';
}

interface ISetEditCatalogData extends IInjectedResource {
  type: 'USERS-MODULE:SET_EDIT_CATALOG_DATA';
}

type UserModuleActionsWithInjectedResource =
  (ICreateResourceAction
  | IEditResourceAction
  | ISaveEditResourceAction
  | ICreateResourceSuccessAction
  | IDeleteResourceSuccessAction
  | IDeleteResourceAction
  | IChangeCatalogFormField
  | ISwichAllSelectedCheckboxStatus
  | IChangeAllItemsSelect
  | ISetEditChoosenCatalogName
  | ISyncCatalogData
  | ISetEditCatalogData
  | IEraseSelectedUsers) & IInjectedResource;

type UserModuleActions =
  UserModuleActionsWithInjectedResource
  | IAcceptDeleteAction
  | ISwitchModalStatusAction
  | ISwitchModalLoadFileStatusAction
  | ISwitchRemoveModalStatusAction
  | ISwitchUsersMultiEditStatusAction
  | ICheckedUserMultiEditAction
  | IDeleteCheckedUsersAction
  | ICheckedUsersGroupEditAction
  | ISendCatalogData
  | ISendCatalogDataSuccess
  | ISendCatalogDataFailed
  | ISwitchSyncModal
  | IDeleteUserLogin
  | ISwichAllSelectedCheckboxStatus
  | IChangeAllItemsSelect
  | ISetEditChoosenCatalogName
  | ISyncCatalogData
  | IEnableCatalog
  | IDisableCatalog
  | IUpdateUsers
  | ITestCatalogConnection
  | IGetCatalogs
  | IGetCatalogGroups
  | IUpdateCatalogGroups
  | ISetEditCatalogData
  | ISetCatalogsList
  | ISetCatalogGroupsList
  | IEraseSelectedUsers
  | ITextConnectSuccess
  | ITextConnectClear
  | ILoadFileErrorClear
  | IClearUsersOutsideDB
  | IClearUpdateCardStatus

export {
  UserModuleActions,
  IEditPayload,
  IChangeModalStatusPayload,
  ICreateResourceAction,
  ICreateResourceSuccessAction,
  IEditResourceAction,
  ISaveEditResourceAction,
  IDeleteResourceAction,
  IAcceptDeleteAction,
  IDeleteResourceSuccessAction,
  ISwitchModalStatusAction,
  ISwitchModalLoadFileStatusAction,
  ISwitchSyncModal,
  ISwitchRemoveModalStatusAction,
  ISwitchUsersMultiEditStatusAction,
  ICheckedUserMultiEditAction,
  IDeleteCheckedUsersAction,
  ICheckedUsersGroupEditAction,
  IChangeCatalogFormField,
  IDeleteUserLogin,
  ISwichAllSelectedCheckboxStatus,
  IChangeAllItemsSelect,
  IEraseSelectedUsers,
  ISetEditChoosenCatalogName,
  ISyncCatalogData,
  IEnableCatalog,
  IDisableCatalog,
  IUpdateUsers,
  ITestCatalogConnection,
  IGetCatalogs,
  IGetCatalogGroups,
  ISetCatalogsList,
  ISetCatalogGroupsList,
  IUpdateCatalogGroups,
  ISetEditCatalogData,
  ITextConnectSuccess,
  ITextConnectClear,
  ILoadFileErrorClear,
  IClearUsersOutsideDB,
  IClearUpdateCardStatus
}
