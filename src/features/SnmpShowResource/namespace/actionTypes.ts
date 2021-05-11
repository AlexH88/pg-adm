import { IInjectedResource } from 'shared/helpers/injectResource';

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

interface ISnmpLoadResource extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE';
}

interface IdeletePrinter extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:DELITE_PRINTER';
}

interface IdeleteFloor extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:DELITE_FLOOR';
}

interface ISnmpLoadPicture extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:LOAD_PICTURE';
}

interface IAddPrinterToFloor extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:ADD_PRINTER_TO_FLOOR';
}

interface IAddCoordinatesPrinterToFloor extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:ADD_COORDINATES_PRINTER_TO_FLOOR';
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
  type: 'SNMP_SHOW_RESOURCE:LOAD_RESOURCE_SUCCESS';
}

interface ILoadAggregateSuccessAction extends IInjectedResource {
  type: 'SHOW_RESOURCE:LOAD_AGGREGATE_SUCCESS';
}

interface ISortResource extends IInjectedResource {
  type: 'SHOW_RESOURCE:SORT_RESOURCE';
}

interface IChangePage extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_PAGE';
}

interface ISnmpChangeLoader extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:CHANGE_LOADER';
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

interface IPrinterSizeRate extends IInjectedResource {
  type: 'SNMP_SHOW_RESOURCE:PRINTER_SIZE_RATE';
}

type ShowResourceActions = (
  IInitResource
  | ISnmpLoadResource
  | ISnmpLoadPicture
  | IdeletePrinter
  | IdeleteFloor
  | IPrinterSizeRate
  | ILoadShortResource
  | ISetShortResource
  | ISetRoleResource
  | ILoadResourceSuccessAction
  | ILoadAggregateSuccessAction
  | ISortResource
  | IChangePage
  | ISnmpChangeLoader
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
  ISnmpLoadResource,
  ISnmpLoadPicture,
  IPrinterSizeRate,
  IdeletePrinter,
  IdeleteFloor,
  IAddPrinterToFloor,
  IAddCoordinatesPrinterToFloor,
  ILoadShortResource,
  ISetRoleResource,
  ISetShortResource,
  ISortResource,
  IChangePage,
  ISnmpChangeLoader,
  ShowResourceActions,
  ILoadResourceSuccessAction,
  ILoadAggregateSuccessAction,
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
