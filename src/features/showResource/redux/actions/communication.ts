import {IResource} from 'shared/types/app';
import {IRule} from 'shared/types/policy';
import {
    IAggregate,
    IChangeHeader,
    IChangeLoader,
    IChangeOrderItems,
    IChangePage,
    IChangeRuleResource,
    IDeleteRule,
    IFailedResponse,
    IInitHeadersTableConfig,
    IInitHeadersTableConfigFinished,
    IInitResource,
    ILoadAggregateSuccessAction,
    ILoadBaseTemplate,
    ILoadPageFailed,
    ILoadPolicyRule,
    ILoadPolicyRuleFailed,
    ILoadPolicyRuleSuccess,
    ILoadRecursiveResource,
    ILoadResource,
    ILoadResourceFailed,
    ILoadResourceSuccessAction,
    ILoadShortResource,
    IResourceReduxState,
    ISetRoleResource,
    ISetShortResource,
    ISortResource,
    IStopLoadRecursiveResource,
    IUpdateIndividualResourceItem,
    IUpdateTableReloadPrompt
} from '../../namespace';
import {
    IAddRuleResource,
    IClearTimerId,
    ILoadCurrentOperator,
    IPutTimerId,
    ISetCurrentOperator,
    IShowAlert,
} from '../../namespace/actionTypes';

function initResource(configs: Partial<IResourceReduxState>): IInitResource {
  return { type: 'SHOW_RESOURCE:INIT_RESOURCE', payload: configs };
}

function initHeadersConfig(configs: Partial<IResourceReduxState>): IInitHeadersTableConfig {
  return { type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG', payload: configs };
}

function initHeadersConfigFinished(configs: Partial<IResourceReduxState>): IInitHeadersTableConfigFinished {
  return { type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG_FINISHED', payload: configs };
}

function changeHeader(value: string, isCheck: boolean): IChangeHeader {
  return { type: 'SHOW_RESOURCE:CHANGE_HEADER', payload: { value, isCheck } };
}

function loadResource(cacheMode: boolean = false, byWebsocket: boolean): ILoadResource {
  return { type: 'SHOW_RESOURCE:LOAD_RESOURCE', payload: { cacheMode, byWebsocket } };
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

function loadResourceSuccess(data: { [page: number]: IResource[] }): ILoadResourceSuccessAction {
  return { type: 'SHOW_RESOURCE:LOAD_RESOURCE_SUCCESS', payload: data };
}

function updateIndividualResourceItem(data: any, sort?: any): IUpdateIndividualResourceItem {
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

function changeLoader(value: boolean): IChangeLoader {
  return { type: 'SHOW_RESOURCE:CHANGE_LOADER', payload: value };
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
/***/
function loadBaseTemplate(data: IAggregate): ILoadBaseTemplate {
  return { type: 'SHOW_RESOURCE:LOAD_BASE_TEMPLATE_SUCCESS', payload: data };
}

function loadPolicyRule(id: number): ILoadPolicyRule {
  return { type: 'SHOW_RESOURCE:LOAD_POLICY_RULE', payload: id };
}

function loadPolicyRuleSuccess(data: IResourceReduxState): ILoadPolicyRuleSuccess {
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

export {
  initResource,
  loadResource,
  loadShortResource,
  setShortResource,
  setRoleResource,
  sortResource,
  changePage,
  changeLoader,
  loadResourceSuccess,
  loadAggregateSuccess,
  loadBaseTemplate,
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
