import { IInjectedResource } from 'shared/helpers/injectResource';
import { IMode } from './index';

interface IEditPayload {
  id: number;
  mode: IMode;
}

interface IChangeModalStatusPayload {
  status: boolean;
  mode: IMode;
}

interface IEditResourceAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:EDIT_RESOURCE';
}

interface ICreateResourceAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:CREATE_RESOURCE';
}

interface ICreateResourceSuccessAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:CREATE_RESOURCE_SUCCESS';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SWITCH_MODAL_STATUS';
}

interface ITestPostConnection extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:TEST_POST_CONNECTION';
}

interface ITestConnentSuccess extends IInjectedResource {
  type: 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS';
}

interface IGetCurrentStatusIntegration extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:GET_CURRENT_STATUS_INTEGRATION';
}

interface ISetCurrentStatus extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SET_CURRENT_STATUS';
}

interface ITextConnectClear extends IInjectedResource {
  type: 'INTEGRATION-MODULE:TEST_CONNECT_CLEAR';
}

interface IEnableIntegration extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:ENABLE_INTEGRATION';
}

interface IDisableIntegration extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:DISABLE_INTEGRATION';
}

interface IChangeCatalogFormField extends IInjectedResource {
  type: 'INTEGRATION-MODULE:CHANGE_CATALOG_FORM_FIELD' | 'INTEGRATION-MODULE:TEST_CONNECT_SUCCESS';
}

interface IDeleteResourceAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:DELETE_RESOURCE';
}

interface ISaveEditResourceAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SAVE_EDIT_RESOURCE';
}

interface IAcceptDeleteAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:ACCEPT_DELETE';
}

interface ISwitchRemoveModalStatusAction extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SWITCH_REMOVE_MODAL_STATUS';
}

interface IDisableCatalog extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:DISABLE_CATALOG';
}

interface IEnableCatalog extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:ENABLE_CATALOG';
}

interface ITestCatalogConnection extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:TEST_CATALOG_CONNECTION';
}

interface ISetEditCatalogData extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SET_EDIT_CATALOG_DATA';
}

interface ISetEditChoosenCatalogName extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SET_EDIT_CHOOSEN_CATALOG_NAME';
}

interface ISwitchSyncModal extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SWITCH_SYNC_MODAL';
}

interface ISyncCatalogData extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:SYNC_CATALOG_DATA';
}

interface IGetCatalogs extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:GET_CATALOGS';
}

interface IUpdateCatalogGroups extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:UPDATE_CATALOG_GROUPS';
}

interface ISetCatalogGroupsList extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:SET_CATALOG_GROUPS_LIST';
}

interface IGetCatalogGroups extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:GET_CATALOG_GROUPS';
}

interface ISetCatalogsList extends IInjectedResource  {
  type: 'INTEGRATION-MODULE:SET_CATALOGS_LIST';
}

interface ISendCatalogData extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA';
}

interface ISendCatalogDataSuccess extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA_SUCCESS';
}

interface ISendCatalogDataFailed extends IInjectedResource {
  type: 'INTEGRATION-MODULE:SEND_TEMP_CATALOG_DATA_FAILED';
}


type UserModuleActionsWithInjectedResource =
  ITestPostConnection

type UserModuleActions =
  UserModuleActionsWithInjectedResource
  | IEditResourceAction
  | ICreateResourceAction
  | ICreateResourceSuccessAction
  | ISwitchModalStatusAction
  | ITestPostConnection
  | ITestConnentSuccess
  | IGetCurrentStatusIntegration
  | ISetCurrentStatus
  | ITextConnectClear
  | IEnableIntegration
  | IDisableIntegration
  | IChangeCatalogFormField
  | IDeleteResourceAction
  | ISaveEditResourceAction
  | IAcceptDeleteAction
  | ISwitchRemoveModalStatusAction
  | IDisableCatalog
  | IEnableCatalog
  | ITestCatalogConnection
  | ISetEditCatalogData
  | ISetEditChoosenCatalogName
  | ISwitchSyncModal
  | ISyncCatalogData
  | IGetCatalogs
  | IUpdateCatalogGroups
  | ISetCatalogGroupsList
  | IGetCatalogGroups
  | ISetCatalogsList
  | ISendCatalogData
  | ISendCatalogDataSuccess
  | ISendCatalogDataFailed

export {
  UserModuleActions,
  IEditPayload,
  IEditResourceAction,
  ICreateResourceAction,
  ICreateResourceSuccessAction,
  IChangeModalStatusPayload,
  ISwitchModalStatusAction,
  ITestConnentSuccess,
  ITestPostConnection,
  IGetCurrentStatusIntegration,
  ISetCurrentStatus,
  ITextConnectClear,
  IEnableIntegration,
  IDisableIntegration,
  IChangeCatalogFormField,
  IDeleteResourceAction,
  ISaveEditResourceAction,
  IAcceptDeleteAction,
  ISwitchRemoveModalStatusAction,
  IDisableCatalog,
  IEnableCatalog,
  ITestCatalogConnection,
  ISetEditCatalogData,
  ISetEditChoosenCatalogName,
  ISwitchSyncModal,
  ISyncCatalogData,
  IGetCatalogs,
  IUpdateCatalogGroups,
  ISetCatalogGroupsList,
  IGetCatalogGroups,
  ISetCatalogsList
}
