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

interface IEditResourceAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:EDIT_RESOURCE';
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS';
}

interface ISwitchModalStatusModeAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS_MODE';
}

interface ISaveEditResourceAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE';
}

interface ISaveEditResourceGroupAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE_GROUP';
}

interface ICreatePrinterGroup extends IInjectedResource {
  type: 'PRINTERS_MODULE:CREATE_PRINTER_GROUP';
}

interface ICreatePlanFloor extends IInjectedResource {
  type: 'PRINTERS_MODULE:CREATE_PLAN_FLOOR';
}

interface IEditPlanFloor extends IInjectedResource {
  type: 'PRINTERS_MODULE:EDIT_PLAN_FLOOR';
}

interface ICreateResourceSuccessAction extends IInjectedResource {
  type: 'PRINTERS_MODULE:CREATE_RESOURCE_SUCCESS';
}


interface ITryDeleteResource extends IInjectedResource {
  type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE';
}

interface IStartDeletePrinterGroup extends IInjectedResource {
  type: 'PRINTERS_MODULE:START_DELETE_PRINTER_GROUP';
}

interface ITryDeleteResourceSuccess extends IInjectedResource {
  type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE_SUCCESS';
}

interface ITryDeleteResourceFailed extends IInjectedResource {
  type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE_FAILED';
}

interface ISwitchRemoveModal extends IInjectedResource {
  type: 'PRINTERS_MODULE:SWITCH_REMOVE_MODAL';
}

interface IAcceptDeleteResource extends IInjectedResource {
  type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE';
}

interface IAcceptDeleteResourceSuccess extends IInjectedResource {
  type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS';
}

interface IAcceptDeleteResourceFailed extends IInjectedResource {
  type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED';
}

interface ISwitchSyncModal extends IInjectedResource {
  type: 'PRINTERS_MODULE:SWITCH_SYNC_MODAL';
}

interface ISetEditPrintServerData extends IInjectedResource {
  type : 'PRINTERS_MODULE:SET_EDIT_PRINT_SERVER_DATA';
}

interface ISetEditChoosenPrintServerName extends IInjectedResource {
  type: 'PRINTERS_MODULE:SET_EDIT_CHOOSEN_PRINT_SERVER_NAME';
}

interface ISyncPrintServersData extends IInjectedResource {
  type: 'PRINTERS_MODULE:SYNC_PRINT_SERVER_DATA';
}

interface IStartDeleteAgent extends IInjectedResource {
  type: 'PRINTERS_MODULE:START_DELETE_AGENT';
}

interface IDeleteAgent extends IInjectedResource  {
  type: 'PRINTERS_MODULE:DELETE_AGENT';
}

interface IToggleWebInterface extends IInjectedResource {
  type: 'PRINTERS_MODULE:TOGGLE_WEB_INTERFACE' 
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
  | ISaveEditResourceGroupAction
  | ICreatePrinterGroup
  | ICreatePlanFloor
  | IEditPlanFloor
  | IStartDeletePrinterGroup
  | ICreateResourceSuccessAction
  | ISwitchSyncModal
  | ISetEditPrintServerData
  | ISetEditChoosenPrintServerName
  | IStartDeleteAgent
  | IDeleteAgent
  | ISyncPrintServersData
  | IToggleWebInterface;

export {
  ITryDeleteResource,
  PrinterModuleActions,
  ISwitchRemoveModal,
  IAcceptDeleteResource,
  IToggleWebInterface,
  ITryDeleteResourceSuccess,
  ITryDeleteResourceFailed,
  IAcceptDeleteResourceFailed,
  IAcceptDeleteResourceSuccess,
  IEditResourceAction,
  ISwitchModalStatusAction,
  ISaveEditResourceAction,
  ISaveEditResourceGroupAction,
  ICreatePrinterGroup,
  ICreatePlanFloor,
  IEditPlanFloor,
  ICreateResourceSuccessAction,
  IStartDeletePrinterGroup,
  ISwitchSyncModal,
  ISetEditPrintServerData,
  ISetEditChoosenPrintServerName,
  ISyncPrintServersData,
  IStartDeleteAgent,
  IDeleteAgent,
  IEditPayload,
  IChangeModalStatusPayload,
  ISwitchModalStatusModeAction
}
