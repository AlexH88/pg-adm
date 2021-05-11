import {IInjectedResource} from 'shared/helpers/injectResource';

interface IEditResourceAction extends IInjectedResource {
  type: 'AGENTS_MODULE:EDIT_RESOURCE';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'AGENTS_MODULE:SWITCH_MODAL_STATUS';
}

interface ISaveEditResourceAction extends IInjectedResource {
  type: 'AGENTS_MODULE:SAVE_EDIT_RESOURCE';
}

interface ICreatePrinterGroup extends IInjectedResource {
  type: 'AGENTS_MODULE:CREATE_PRINTER_GROUP';
}

interface ICreateResourceSuccessAction extends IInjectedResource {
  type: 'AGENTS_MODULE:CREATE_RESOURCE_SUCCESS';
}


interface ITryDeleteResource extends IInjectedResource {
  type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE';
}

interface IStartDeletePrinterGroup extends IInjectedResource {
  type: 'AGENTS_MODULE:START_DELETE_PRINTER_GROUP';
}

interface ITryDeleteResourceSuccess extends IInjectedResource {
  type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE_SUCCESS';
}

interface ITryDeleteResourceFailed extends IInjectedResource {
  type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE_FAILED';
}

interface ISwitchRemoveModal extends IInjectedResource {
  type: 'AGENTS_MODULE:SWITCH_REMOVE_MODAL';
}

interface IAcceptDeleteResource extends IInjectedResource {
  type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE';
}

interface IAcceptDeleteResourceSuccess extends IInjectedResource {
  type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS';
}

interface IAcceptDeleteResourceFailed extends IInjectedResource {
  type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED';
}

interface ISwitchSyncModal extends IInjectedResource {
  type: 'AGENTS_MODULE:SWITCH_SYNC_MODAL';
}

interface ISetEditPrintServerData extends IInjectedResource {
  type : 'AGENTS_MODULE:SET_EDIT_PRINT_SERVER_DATA';
}

interface ISetChosenHostId extends IInjectedResource {
  type: 'AGENTS_MODULE:SET_CHOSEN_HOST_ID';
}

interface ISyncPrintServersData extends IInjectedResource {
  type: 'AGENTS_MODULE:SYNC_PRINT_SERVER_DATA';
}

interface IStartDeleteAgent extends IInjectedResource {
  type: 'AGENTS_MODULE:START_DELETE_AGENT';
}

interface IDeleteAgent extends IInjectedResource {
  type: 'AGENTS_MODULE:DELETE_AGENT';
}

type PrinterModuleActions =
  ITryDeleteResource
  | ISwitchRemoveModal
  | IAcceptDeleteResource
  | ITryDeleteResourceSuccess
  | ITryDeleteResourceFailed
  | IAcceptDeleteResourceSuccess
  | IAcceptDeleteResourceFailed
  | ISwitchModalStatusAction
  | ISaveEditResourceAction
  | ICreatePrinterGroup
  | IStartDeletePrinterGroup
  | ICreateResourceSuccessAction
  | ISwitchSyncModal
  | ISetEditPrintServerData
  | ISetChosenHostId
  | IStartDeleteAgent
  | IDeleteAgent
  | ISyncPrintServersData;

export {
  ITryDeleteResource,
  PrinterModuleActions,
  ISwitchRemoveModal,
  IAcceptDeleteResource,
  ITryDeleteResourceSuccess,
  ITryDeleteResourceFailed,
  IAcceptDeleteResourceFailed,
  IAcceptDeleteResourceSuccess,
  IEditResourceAction,
  ISwitchModalStatusAction,
  ISaveEditResourceAction,
  ICreatePrinterGroup,
  ICreateResourceSuccessAction,
  IStartDeletePrinterGroup,
  ISwitchSyncModal,
  ISetEditPrintServerData,
  ISetChosenHostId,
  ISyncPrintServersData,
  IStartDeleteAgent,
  IDeleteAgent,
}
