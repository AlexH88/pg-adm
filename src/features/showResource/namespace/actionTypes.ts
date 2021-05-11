import {IInjectedResource} from 'shared/helpers/injectResource';

interface IInitResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:INIT_RESOURCE';
}

interface IInitHeadersTableConfig extends IInjectedResource {
  type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG';
}

interface IInitHeadersTableConfigFinished extends IInjectedResource {
  type: 'SHOW_RESOURCE:INIT_HEADERS_CONFIG_FINISHED';
}

interface IChangeHeader extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_HEADER';
}

interface ILoadResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_RESOURCE';
}

interface ILoadShortResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_SHORT_RESOURCE';
}

interface ISetShortResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:SET_SHORT_RESOURCE';
}

interface ISetRoleResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:SET_ROLE_RESOURCE';
}

interface ILoadRecursiveResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_RECURSIVE_RESOURCE';
}

interface IStopLoadRecursiveResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:STOP_LOAD_RECURSIVE_RESOURCE';
}

interface ILoadResourceFailed extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_RESOURCE_FAILED';
}

interface ILoadResourceSuccessAction extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_RESOURCE_SUCCESS';
}

interface ILoadAggregateSuccessAction extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_AGGREGATE_SUCCESS';
}
/***/
interface ILoadBaseTemplate extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_BASE_TEMPLATE_SUCCESS';
}

interface ISortResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:SORT_RESOURCE';
}

interface IChangePage extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_PAGE';
}

interface IChangeLoader extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_LOADER';
}

interface IPutTimerId extends IInjectedResource {
  type: 'SHOW_RESOURCE:PUT_TIMER_ID';
}

interface IClearTimerId extends IInjectedResource {
  type: 'SHOW_RESOURCE:CLEAR_TIMER_ID';
}

interface ILoadPageFailed extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_PAGE_FAILED';
}

interface ILoadPolicyRule extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_POLICY_RULE';
}

interface ILoadPolicyRuleSuccess extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_POLICY_RULE_SUCCESS';
}

interface ILoadPolicyRuleFailed extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_POLICY_RULE_FAILED';
}

interface IChangeRuleResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:EDIT_RULE_RESOURCE';
}

interface IAddRuleResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:ADD_RULE_RESOURCE';
}

interface IDeleteRule extends IInjectedResource {
  type: 'SHOW_RESOURCE:DELETE_RULE';
}

interface IChangeOrderItems extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS';
}

interface ISwitchSaveModal extends IInjectedResource {
  type: 'SHOW_RESOURCE:SWITCH_SAVE_MODAL';
}

interface IShowSaveModal extends IInjectedResource {
  type: 'SHOW_RESOURCE:SHOW_SAVE_MODAL';
}

interface ILoadCurrentOperator extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_CURRENT_OPERATOR'
}

interface ISetCurrentOperator extends IInjectedResource {
  type: 'SHOW_RESOURCE:SET_CURRENT_OPERATOR'
}

interface IToggleSpinner extends IInjectedResource {
  type: 'SHOW_RESOURCE:TOGGLE_SPINNER'
}

interface IShowAlert extends IInjectedResource {
  type: 'SHOW_RESOURCE:SET_ALERT_DATA'
}

interface IUpdateIndividualResourceItem extends IInjectedResource {
  type: 'SHOW_RESOURCE:UPDATE_INDIVIDUAL_RESOURCE_ITEM';
}

interface IUpdateTableReloadPrompt extends IInjectedResource {
  type: 'SHOW_RESOURCE:UPDATE_TABLE_RELOAD_PROMPT';
}

type ShowResourceActions = (
  IInitResource
  | ILoadResource
  | ILoadShortResource
  | ISetShortResource
  | ISetRoleResource
  | ILoadResourceSuccessAction
  | ILoadAggregateSuccessAction
  | ILoadBaseTemplate
  | ISortResource
  | IChangePage
  | IChangeLoader
  | IAddRuleResource
  | ILoadPageFailed
  | ILoadPolicyRule
  | ILoadPolicyRuleSuccess
  | ILoadPolicyRuleFailed
  | IChangeRuleResource
  | IDeleteRule
  | IChangeOrderItems
  | ILoadRecursiveResource
  | IStopLoadRecursiveResource
  | IInitHeadersTableConfig
  | IChangeHeader
  | IInitHeadersTableConfigFinished
  | ISwitchSaveModal
  | IShowSaveModal
  | ILoadCurrentOperator
  | ISetCurrentOperator
  | IPutTimerId
  | IClearTimerId
  | IToggleSpinner
  | IShowAlert
  | IUpdateIndividualResourceItem
  | IUpdateTableReloadPrompt
  ) & IInjectedResource;

export {
  IInitResource,
  ILoadResource,
  ILoadShortResource,
  ISetRoleResource,
  ISetShortResource,
  ISortResource,
  IChangePage,
  IChangeLoader,
  ShowResourceActions,
  ILoadResourceSuccessAction,
  ILoadAggregateSuccessAction,
  ILoadBaseTemplate,
  ILoadResourceFailed,
  ILoadPageFailed,
  ILoadRecursiveResource,
  IStopLoadRecursiveResource,
  ILoadPolicyRule,
  ILoadPolicyRuleSuccess,
  ILoadPolicyRuleFailed,
  IChangeRuleResource,
  IAddRuleResource,
  IDeleteRule,
  IChangeOrderItems,
  IInitHeadersTableConfig,
  IChangeHeader,
  IInitHeadersTableConfigFinished,
  ISwitchSaveModal,
  IShowSaveModal,
  ILoadCurrentOperator,
  ISetCurrentOperator,
  IPutTimerId,
  IClearTimerId,
  IToggleSpinner,
  IShowAlert,
  IUpdateIndividualResourceItem,
  IUpdateTableReloadPrompt
}
