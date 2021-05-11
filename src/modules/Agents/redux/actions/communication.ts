import * as NS from '../../namespace';

function editResource(id: number): NS.IEditResourceAction {
  return { type: 'AGENTS_MODULE:EDIT_RESOURCE', payload: id };
}

function switchModalStatus(status: boolean): NS.ISwitchModalStatusAction {
  return { type: 'AGENTS_MODULE:SWITCH_MODAL_STATUS', payload: status };
}

function saveEditPrinter(): NS.ISaveEditResourceAction {
  return { type: 'AGENTS_MODULE:SAVE_EDIT_RESOURCE' };
}

function createPrinterGroup(): NS.ICreatePrinterGroup {
  return { type: 'AGENTS_MODULE:CREATE_PRINTER_GROUP' };
}

function tryDeleteResource(id: number): NS.ITryDeleteResource {
  return { type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE', payload: id };
}

function startDeletePrinterGroup(id: number): NS.IStartDeletePrinterGroup {
  return { type: 'AGENTS_MODULE:START_DELETE_PRINTER_GROUP', payload: id };
}

function setEditPrintServerData(data : number) : NS.ISetEditPrintServerData {
  return { type : 'AGENTS_MODULE:SET_EDIT_PRINT_SERVER_DATA', payload: data };
}

function acceptDeleteResource(id: number | string): NS.IAcceptDeleteResource {
  return { type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE', payload: id };
}

function acceptDeleteResourceSuccess(data: NS.IPayloadAcceptDeleteSuccess): NS.IAcceptDeleteResourceSuccess {
  return { type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE_SUCCESS', payload: data };
}

function acceptDeleteResourceFailed({ error }: NS.IPayloadTryDeleteResourceFailed): NS.IAcceptDeleteResourceFailed {
  return { type: 'AGENTS_MODULE:ACCEPT_DELETE_RESOURCE_FAILED', payload: { error } };
}

function switchRemoveModal(): NS.ISwitchRemoveModal {
  return { type: 'AGENTS_MODULE:SWITCH_REMOVE_MODAL' };
}

function tryDeleteResourceSuccess(data: NS.IPayloadTryDeleteResourceSuccess): NS.ITryDeleteResourceSuccess {
  return { type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE_SUCCESS', payload: data };
}

function tryDeleteResourceFailed(data: NS.IPayloadTryDeleteResourceFailed): NS.ITryDeleteResourceFailed {
  return { type: 'AGENTS_MODULE:TRY_DELETE_RESOURCE_FAILED', payload: data };
}

function switchSyncModal(): NS.ISwitchSyncModal {
  return { type: 'AGENTS_MODULE:SWITCH_SYNC_MODAL' };
}

function setChosenHostId(data: number) : NS.ISetChosenHostId {
  return { type: 'AGENTS_MODULE:SET_CHOSEN_HOST_ID', payload: data }
}

function syncPrintServersData() : NS.ISyncPrintServersData {
  return { type: 'AGENTS_MODULE:SYNC_PRINT_SERVER_DATA' }
}

function startDeleteAgent(id: number): NS.IStartDeleteAgent {
  return { type: 'AGENTS_MODULE:START_DELETE_AGENT', payload: id }
}

function deleteAgent(): NS.IDeleteAgent {
  return { type: 'AGENTS_MODULE:DELETE_AGENT' }
}

function switchHostGroupEditModal(): any {
  return { type: 'AGENTS_MODULE:SWITCH_HOST_GROUP_EDIT_MODAL' }
}

function startEditHostGroup(editableData: any): any {
  return { type: 'AGENTS_MODULE:START_EDIT_HOST_GROUP', payload: editableData }
}

function saveEditHostGroup(): any {
  return { type: 'AGENTS_MODULE:EDIT_HOST_GROUP' }
}

function forceRestart(): any {
  return { type: 'AGENTS_MODULE:FORCE_RESTART' }
}

function forceActivate(state: boolean): any {
  return { type: 'AGENTS_MODULE:FORCE_ACTIVATE', payload: state }
}

function startLog(printerId: number): any {
  return { type: 'AGENTS_MODULE:START_LOG', payload: printerId }
}

function executeLog(): any {
  return { type: 'AGENTS_MODULE:EXECUTE_LOG' }
}

function switchLogModal(): any {
  return { type: 'AGENTS_MODULE:SWITCH_LOG_MODAL' }
}

function setLogPrinterId(id: any): any {
  return { type: 'AGENTS_MODULE:SET_LOG_PRINTER_ID', payload: id }
}

export {
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
  createPrinterGroup,
  startDeletePrinterGroup,
  switchSyncModal,
  setEditPrintServerData,
  setChosenHostId,
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
  setLogPrinterId
};
