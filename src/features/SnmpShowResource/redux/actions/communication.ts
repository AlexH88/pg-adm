import { IResource } from 'shared/types/app';
import { IRule } from 'shared/types/policy';
import {
  IInitResource,
  ISnmpLoadResource,
  ISnmpLoadPicture,
  IAddPrinterToFloor,
  IAddCoordinatesPrinterToFloor,
  ILoadShortResource,
  ISetShortResource,
  ISetRoleResource,
  ISortResource,
  IChangePage,
  ISnmpChangeLoader,
  ILoadResourceSuccessAction,
  ILoadAggregateSuccessAction,
  ILoadResourceFailed,
  ILoadPageFailed,
  ILoadPolicyRule,
  ILoadPolicyRuleSuccess,
  ILoadPolicyRuleFailed,
  IChangeRuleResource,
  IDeleteRule,
  IStopLoadRecursiveResource,
  ISnmpResourceReduxState,
  IAggregate,
  IFailedResponse,
  IChangeOrderItems,
  IInitHeadersTableConfig,
  IInitHeadersTableConfigFinished,
  IChangeHeader,
  ILoadRecursiveResource,
  IUpdateIndividualResourceItem,
  IUpdateTableReloadPrompt
} from '../../namespace';
import {
  IAddRuleResource,
  ILoadCurrentOperator,
  ISetCurrentOperator,
  IPutTimerId,
  IClearTimerId,
  IShowAlert,
  IdeletePrinter,
  IdeleteFloor,
  IPrinterSizeRate
} from '../../namespace/actionTypes';

function initResource(configs: Partial<ISnmpResourceReduxState>): IInitResource {
  return { type: 'SHOW_RESOURCE:INIT_RESOURCE', payload: configs };
}

function initHeadersConfig(configs: Partial<ISnmpResourceReduxState>): IInitHeadersTableConfig {
  return { type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG', payload: configs };
}

function initHeadersConfigFinished(configs: Partial<ISnmpResourceReduxState>): IInitHeadersTableConfigFinished {
  return { type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG_FINISHED', payload: configs };
}

function changeHeader(value: string, isCheck: boolean): IChangeHeader {
  return { type: 'SHOW_RESOURCE:CHANGE_HEADER', payload: { value, isCheck } };
}

function SnmpLoadResource(cacheMode: boolean = false, byWebsocket: boolean): ISnmpLoadResource {
  return { type: 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE', payload: { cacheMode, byWebsocket} };
}

function snmpLoadPicture(id: number | null): ISnmpLoadPicture {
  return { type: 'SNMP_SHOW_RESOURCE:LOAD_PICTURE', payload: { id } };
}

function addPrinterToFloor(idPrinter: number, floorNumber: number): IAddPrinterToFloor {
  return { type: 'SNMP_SHOW_RESOURCE:ADD_PRINTER_TO_FLOOR', payload: { idPrinter, floorNumber } };
}

function deletePrinter(idPrinter: number, floorNumber: number): IdeletePrinter {
  return { type: 'SNMP_SHOW_RESOURCE:DELITE_PRINTER', payload: { idPrinter, floorNumber } };
}

function deleteFloor(floorNumber: number): IdeleteFloor {
  return { type: 'SNMP_SHOW_RESOURCE:DELITE_FLOOR', payload: { floorNumber } };
}

function addCoordinatesPrinterToFloor(idPrinter: number, floorNumber: number, x: number, y: number): IAddCoordinatesPrinterToFloor {
  return { type: 'SNMP_SHOW_RESOURCE:ADD_COORDINATES_PRINTER_TO_FLOOR', payload: { idPrinter, floorNumber, x, y } };
}

function loadShortResource(id: number | null): ILoadShortResource {
  return { type: 'SHOW_RESOURCE:LOAD_SHORT_RESOURCE', payload: { id } };
}

function setShortResource(payload: any): ISetShortResource {
  return { type: 'SHOW_RESOURCE:SET_SHORT_RESOURCE', payload }
}

function setRoleResource(payload: any): ISetRoleResource {
  return { type: 'SHOW_RESOURCE:SET_ROLE_RESOURCE', payload }
}

function loadRecursiveResource(): ILoadRecursiveResource {
  return { type: 'SHOW_RESOURCE:LOAD_RECURSIVE_RESOURCE' };
}

function stopLoadRecursiveResource(): IStopLoadRecursiveResource {
  return { type: 'SHOW_RESOURCE:STOP_LOAD_RECURSIVE_RESOURCE' };
}

function loadResourceFailed(message: string): ILoadResourceFailed {
  return { type: 'SHOW_RESOURCE:LOAD_RESOURCE_FAILED', payload: message };
}

function loadSnmpResourceSuccess(data: { [page: number]: IResource[] }, addPrinters: any): ILoadResourceSuccessAction {
  return { type: 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE_SUCCESS', payload: {data, addPrinters}  };
}

function updateIndividualResourceItem(data: any, sort: any): IUpdateIndividualResourceItem {
  return { type: 'SHOW_RESOURCE:UPDATE_INDIVIDUAL_RESOURCE_ITEM', payload: { data, sort } }
}

function updateTableReloadPrompt(data?: any): IUpdateTableReloadPrompt {
  return { type: 'SHOW_RESOURCE:UPDATE_TABLE_RELOAD_PROMPT', payload: { data } }
}

function sortResource(by: string): ISortResource {
  return { type: 'SHOW_RESOURCE:SORT_RESOURCE', payload: by };
}

function changePage(page: number): IChangePage {
  return { type: 'SHOW_RESOURCE:CHANGE_PAGE', payload: { page } };
}

function SnmpChangeLoader(value: boolean): ISnmpChangeLoader {
  return { type: 'SNMP_SHOW_RESOURCE:CHANGE_LOADER', payload: value };
}

function putTimerId(value: any): IPutTimerId {
  return { type: 'SHOW_RESOURCE:PUT_TIMER_ID', payload: value };
}

function clearTimerId(): IClearTimerId {
  return { type: 'SHOW_RESOURCE:CLEAR_TIMER_ID' };
}

function loadPageFailed(message: string): ILoadPageFailed {
  return { type: 'SHOW_RESOURCE:LOAD_PAGE_FAILED', payload: message };
}

function loadAggregateSuccess(data: IAggregate): ILoadAggregateSuccessAction {
  return { type: 'SHOW_RESOURCE:LOAD_AGGREGATE_SUCCESS', payload: data };
}

function loadPolicyRule(id: number): ILoadPolicyRule {
  return { type: 'SHOW_RESOURCE:LOAD_POLICY_RULE', payload: id };
}

function loadPolicyRuleSuccess(data: ISnmpResourceReduxState): ILoadPolicyRuleSuccess {
  return { type: 'SHOW_RESOURCE:LOAD_POLICY_RULE_SUCCESS', payload: data };
}

function loadPolicyRuleFailed({ error }: IFailedResponse): ILoadPolicyRuleFailed {
  return { type: 'SHOW_RESOURCE:LOAD_POLICY_RULE_FAILED', payload: { error } };
}

function editRuleResource(data: IRule, index: number): IChangeRuleResource {
  return { type: 'SHOW_RESOURCE:EDIT_RULE_RESOURCE', payload: { editedRule: data, index } };
}

function addRuleResource(data: IRule, index: number): IAddRuleResource {
  return { type: 'SHOW_RESOURCE:ADD_RULE_RESOURCE', payload: { editedRule: data, index } };
}

function deleteRule(id: number): IDeleteRule {
  return { type: 'SHOW_RESOURCE:DELETE_RULE', payload: { id } };
}

function changeOrderItems(data: IResource[][]): IChangeOrderItems {
  return { type: 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS', payload: data };
}

function loadCurrentOperator(): ILoadCurrentOperator {
  return { type: 'SHOW_RESOURCE:LOAD_CURRENT_OPERATOR' };
}

function setCurrentOperator(data: any): ISetCurrentOperator {
  return { type: 'SHOW_RESOURCE:SET_CURRENT_OPERATOR', payload: data };
}

function showAlertMessage(type: string, message: string): IShowAlert {
  return { type: 'SHOW_RESOURCE:SET_ALERT_DATA', payload: { type, message } };
}

function getImages(jobId: number, pages: number) {
  return { type: 'SHOW_RESOURCE:GET_IMAGES', payload: { jobId, pages } };
}

function printerSizeRate(rate: string | void): IPrinterSizeRate {
  return { type: 'SNMP_SHOW_RESOURCE:PRINTER_SIZE_RATE', payload: rate };
}


export {
  initResource,
  SnmpLoadResource,
  snmpLoadPicture,
  addPrinterToFloor,
  deletePrinter,
  deleteFloor,
  printerSizeRate,
  addCoordinatesPrinterToFloor,
  loadShortResource,
  setShortResource,
  setRoleResource,
  sortResource,
  changePage,
  SnmpChangeLoader,
  loadSnmpResourceSuccess,
  loadAggregateSuccess,
  loadResourceFailed,
  loadPageFailed,
  loadPolicyRule,
  loadPolicyRuleSuccess,
  loadPolicyRuleFailed,
  editRuleResource,
  addRuleResource, // #AddRule
  deleteRule,
  changeOrderItems,
  loadRecursiveResource,
  stopLoadRecursiveResource,
  initHeadersConfig,
  initHeadersConfigFinished,
  changeHeader,
  loadCurrentOperator,
  setCurrentOperator,
  putTimerId,
  clearTimerId,
  showAlertMessage,
  updateIndividualResourceItem,
  updateTableReloadPrompt,
  getImages
};
