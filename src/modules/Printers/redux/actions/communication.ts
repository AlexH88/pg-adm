import * as NS from '../../namespace';

function editResource(id: number): NS.IEditResourceAction {
  return { type: 'PRINTERS_MODULE:EDIT_RESOURCE', payload: id };
}

function switchModalStatus(status: boolean): NS.ISwitchModalStatusAction {
  return { type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS', payload: status };
}

function switchModalStatusMode({ status, mode }: NS.IChangeModalStatusPayload): NS.ISwitchModalStatusModeAction {
  return { type: 'PRINTERS_MODULE:SWITCH_MODAL_STATUS_MODE', payload: { status, mode } };
}

function saveEditPrinter(): NS.ISaveEditResourceAction {
  return { type: 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE' };
}

function saveEditPrinterGroup(): NS.ISaveEditResourceGroupAction {
  return { type: 'PRINTERS_MODULE:SAVE_EDIT_RESOURCE_GROUP' };
}

function createPrinterGroup(): NS.ICreatePrinterGroup {
  return { type: 'PRINTERS_MODULE:CREATE_PRINTER_GROUP' };
}

function createPlanFloor(id: any): NS.ICreatePlanFloor {
  return { type: 'PRINTERS_MODULE:CREATE_PLAN_FLOOR', payload: { id } };
}

function editPlanFloor(id: any): NS.IEditPlanFloor {
  return { type: 'PRINTERS_MODULE:EDIT_PLAN_FLOOR', payload: { id } };
}



function tryDeleteResource(id: number): NS.ITryDeleteResource {
  return { type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE', payload: id };
}

function startDeletePrinterGroup(id: number): NS.IStartDeletePrinterGroup {
  return { type: 'PRINTERS_MODULE:START_DELETE_PRINTER_GROUP', payload: id };
}

function setEditPrintServerData(data : string) : NS.ISetEditPrintServerData { // #PrintServer
  return { type : 'PRINTERS_MODULE:SET_EDIT_PRINT_SERVER_DATA', payload: data };
}

function acceptDeleteResource(id: number | string): NS.IAcceptDeleteResource {
  return { type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE', payload: id };
}

function acceptDeleteResourceSuccess(data: NS.IPayloadAcceptDeleteSuccess): NS.IAcceptDeleteResourceSuccess {
  return { type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS', payload: data };
}

function acceptDeleteResourceFailed({ error }: NS.IPayloadTryDeleteResourceFailed): NS.IAcceptDeleteResourceFailed {
  return { type: 'PRINTERS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED', payload: { error } };
}

function switchRemoveModal(): NS.ISwitchRemoveModal {
  return { type: 'PRINTERS_MODULE:SWITCH_REMOVE_MODAL' };
}

function tryDeleteResourceSuccess(data: NS.IPayloadTryDeleteResourceSuccess): NS.ITryDeleteResourceSuccess {
  return { type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE_SUCCESS', payload: data };
}

function tryDeleteResourceFailed(data: NS.IPayloadTryDeleteResourceFailed): NS.ITryDeleteResourceFailed {
  return { type: 'PRINTERS_MODULE:TRY_DELETE_RESOURCE_FAILED', payload: data };
}

function switchSyncModal(): NS.ISwitchSyncModal {
  return { type: 'PRINTERS_MODULE:SWITCH_SYNC_MODAL' };
}

function setEditChoosenPrintServerName(data: string) : NS.ISetEditChoosenPrintServerName {
  return { type: 'PRINTERS_MODULE:SET_EDIT_CHOOSEN_PRINT_SERVER_NAME', payload: data }
}

function syncPrintServersData() : NS.ISyncPrintServersData {
  return { type: 'PRINTERS_MODULE:SYNC_PRINT_SERVER_DATA' }
}

function startDeleteAgent(id: number): NS.IStartDeleteAgent {
  return { type: 'PRINTERS_MODULE:START_DELETE_AGENT', payload: id }
}

function deleteAgent(): NS.IDeleteAgent {
  return { type: 'PRINTERS_MODULE:DELETE_AGENT' }
}

function switchHostGroupEditModal(): any {
  return { type: 'PRINTERS_MODULE:SWITCH_HOST_GROUP_EDIT_MODAL' }
}

function startEditHostGroup(editableData: any): any {
  return { type: 'PRINTERS_MODULE:START_EDIT_HOST_GROUP', payload: editableData }
}

function saveEditHostGroup(): any {
  return { type: 'PRINTERS_MODULE:EDIT_HOST_GROUP' }
}

function toggleWebInterface( id: number, web: boolean ): NS.IToggleWebInterface {
  return { type: 'PRINTERS_MODULE:TOGGLE_WEB_INTERFACE', payload: { id, web } }
}


function forceRestart(): any {
  return { type: 'PRINTERS_MODULE:FORCE_RESTART' }
}

function forceActivate(state: boolean): any {
  return { type: 'PRINTERS_MODULE:FORCE_ACTIVATE', payload: state }
}

function startLog(printerId: number): any {
  return { type: 'PRINTERS_MODULE:START_LOG', payload: printerId }
}

function executeLog(): any {
  return { type: 'PRINTERS_MODULE:EXECUTE_LOG' }
}

function switchLogModal(): any {
  return { type: 'PRINTERS_MODULE:SWITCH_LOG_MODAL' }
}

function setLogPrinterId(id: any): any {
  return { type: 'PRINTERS_MODULE:SET_LOG_PRINTER_ID', payload: id }
}

function getPrinterGroup(): any {
  return { type: 'PRINTERS_MODULE:GET_PRINTER_GROUP'}
}

function printerGroupSwitch(indicator: boolean): any {
  return { type: 'PRINTERS_MODULE:PRINTER_GROUPS_SWITCH', payload: indicator}
}



export {
  printerGroupSwitch,
  tryDeleteResource,
  switchRemoveModal,
  acceptDeleteResource,
  tryDeleteResourceSuccess,
  tryDeleteResourceFailed,
  acceptDeleteResourceSuccess,
  acceptDeleteResourceFailed,
  editResource,
  switchModalStatus,
  saveEditPrinter,
  saveEditPrinterGroup,
  createPrinterGroup,
  createPlanFloor,
  editPlanFloor,
  startDeletePrinterGroup,
  switchSyncModal,
  setEditPrintServerData,
  setEditChoosenPrintServerName,
  syncPrintServersData,
  startDeleteAgent,
  deleteAgent,
  switchHostGroupEditModal,
  startEditHostGroup,
  saveEditHostGroup,
  forceRestart,
  forceActivate,
  startLog,
  executeLog,
  switchLogModal,
  setLogPrinterId,
  switchModalStatusMode,
  toggleWebInterface,
  getPrinterGroup
};
