import {IInjectedResource} from 'shared/helpers/injectResource';

interface IActivateResource extends IInjectedResource {
  type: 'POLICY_MODULE:ACTIVATE_RESOURCE';
}

interface IActivateResourceSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:ACTIVATE_RESOURCE_SUCCESS';
}

interface IActivateResourceFailed extends IInjectedResource {
  type: 'POLICY_MODULE:ACTIVATE_RESOURCE_FAILED';
}

interface IDeactivateResource extends IInjectedResource {
  type: 'POLICY_MODULE:DEACTIVATE_RESOURCE';
}

interface IDeactivateResourceSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:DEACTIVATE_RESOURCE_SUCCESS';
}

interface IDeactivateResourceFailed extends IInjectedResource {
  type: 'POLICY_MODULE:DEACTIVATE_RESOURCE_FAILED';
}

interface IDeleteResource extends IInjectedResource {
  type: 'POLICY_MODULE:DELETE_RESOURCE';
}

interface IDeleteResourceSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:DELETE_RESOURCE_SUCCESS';
}

interface IDeleteResourceFailed extends IInjectedResource {
  type: 'POLICY_MODULE:DELETE_RESOURCE_FAILED';
}

interface IAcceptDelete extends IInjectedResource {
  type: 'POLICY_MODULE:ACCEPT_DELETE';
}

interface ISwitchRemoveModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_REMOVE_MODAL';
}

interface ISwitchWatermarksModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_WATERMARKS_MODAL';
}

interface ISwitchCreateEditModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_CREATE_EDIT_MODAL';
}

interface ISwitchAddModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_ADD_MODAL';
}

interface ICreateResource extends IInjectedResource {
  type: 'POLICY_MODULE:CREATE_RESOURCE';
}

interface ISaveResource extends IInjectedResource {
  type: 'POLICY_MODULE:SAVE_RESOURCE';
}

interface ICreateResourceSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:CREATE_RESOURCE_SUCCESS';
}

interface ICreateResourceFailed extends IInjectedResource {
  type: 'POLICY_MODULE:CREATE_RESOURCE_FAILED';
}

interface ISetEditPolicy extends IInjectedResource {
  type: 'POLICY_MODULE:SET_EDIT_POLICY';
}

interface IGetGroups extends IInjectedResource {
  type: 'POLICY_MODULE:GET_GROUPS';
}

interface IGetGroupsSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:GET_GROUPS_SUCCESS';
}

interface IGetGroupsFailed extends IInjectedResource {
  type: 'POLICY_MODULE:GET_GROUPS_FAILED';
}

interface IStartEditRule extends IInjectedResource {
  type: 'POLICY_MODULE:START_EDIT_RULE';
}

interface IChangeRuleData extends IInjectedResource {
  type: 'POLICY_MODULE:CHANGE_RULE_DATA';
}

interface IAddRuleData extends IInjectedResource {
  type: 'POLICY_MODULE:ADD_RULE_DATA';
}

interface IStartAddRule extends IInjectedResource {
  type: 'POLICY_MODULE:START_ADD_RULE';
}

interface IStartDeleteRule extends IInjectedResource {
  type: 'POLICY_MODULE:START_DELETE_RULE';
}

interface IAcceptDeleteRule extends IInjectedResource {
  type: 'POLICY_MODULE:ACCEPT_DELETE_RULE';
}

interface ISendRuleData extends IInjectedResource {
  type: 'POLICY_MODULE:SEND_RULE_DATA';
}

interface ISendRuleDataSuccess extends IInjectedResource {
  type: 'POLICY_MODULE:SEND_RULE_DATA_SUCCESS';
}

interface ISendRuleDataFailed extends IInjectedResource {
  type: 'POLICY_MODULE:SEND_RULE_DATA_FAILED';
}

interface ISwitchConfirmModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_CONFIRM_MODAL';
}

interface ISwitchSaveModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_SAVE_MODAL';
}

interface ISwitchMarkModal extends IInjectedResource {
  type: 'POLICY_MODULE:SWITCH_MARK_MODAL';
}

interface ISetProgrammError extends IInjectedResource {
  type: 'POLICY_MODULE:SET_ERROR_PROGRAMM';
}

interface IChangeOrderItems extends IInjectedResource {
  type: 'SHOW_RESOURCE:CHANGE_ORDER_ITEMS';
}

interface ISetPolicyNoneEdit extends IInjectedResource {
  type : 'POLICY_MODULE:SET_POLICY_NONE_EDIT';
}

interface ISetPolicyEdit extends IInjectedResource {
  type : 'POLICY_MODULE:SET_POLICY_EDIT';
}

interface ISetMarkPolicyEdit extends IInjectedResource {
  type : 'POLICY_MODULE:SET_EDIT_MARK_POLICY';
}

interface IAddMarkPolicy extends IInjectedResource {
  type : 'POLICY_MODULE:ADD_MARK_POLICY';
}

interface ISetTextLablesData extends IInjectedResource {
  type : 'POLICY_MODULE:SET_TEXT_LABELS_DATA';
}

interface ISetImageId extends IInjectedResource {
  type : 'POLICY_MODULE:SET_IMAGE_ID';
}

type PolicyModuleActions = (
  IActivateResource
  | IActivateResourceSuccess
  | IActivateResourceFailed
  | IDeactivateResource
  | IDeactivateResourceFailed
  | IDeactivateResourceSuccess
  | IDeleteResource
  | IDeleteResourceSuccess
  | IDeleteResourceFailed
  | IAcceptDelete
  | ISwitchRemoveModal
  | ISwitchWatermarksModal
  | ISwitchCreateEditModal
  | ICreateResource
  | ISaveResource
  | ICreateResourceSuccess
  | ICreateResourceFailed
  | ISetEditPolicy
  | IGetGroups
  | IGetGroupsSuccess
  | IGetGroupsFailed
  | IStartEditRule
  | IChangeRuleData
  | IAddRuleData // #Addrule
  | ISwitchAddModal // #AddRule
  | IStartAddRule // #AddRule
  | IAddMarkPolicy
  | IStartDeleteRule
  | IAcceptDeleteRule
  | ISendRuleData
  | ISendRuleDataSuccess
  | ISendRuleDataFailed
  | ISwitchConfirmModal
  | ISetProgrammError
  | ISwitchSaveModal
  | IChangeOrderItems
  | ISetPolicyNoneEdit
  | ISetPolicyEdit
  | ISwitchMarkModal
  | ISetMarkPolicyEdit
  | ISetTextLablesData
  | ISetImageId
);

export {
  IActivateResource,
  IActivateResourceSuccess,
  IActivateResourceFailed,
  IDeactivateResource,
  IDeactivateResourceFailed,
  IDeactivateResourceSuccess,
  PolicyModuleActions,
  IDeleteResource,
  IDeleteResourceSuccess,
  IDeleteResourceFailed,
  IAcceptDelete,
  ISwitchRemoveModal,
  ISwitchWatermarksModal,
  ISwitchCreateEditModal,
  ICreateResource,
  ICreateResourceSuccess,
  ICreateResourceFailed,
  ISaveResource,
  ISetEditPolicy,
  IGetGroups,
  IGetGroupsSuccess,
  IGetGroupsFailed,
  IStartEditRule,
  IChangeRuleData,
  IAddRuleData, // #Addrule
  ISwitchAddModal, // #AddRule
  IStartAddRule, // #AddRule
  ISwitchMarkModal,
  IStartDeleteRule,
  IAcceptDeleteRule,
  ISendRuleData,
  IAddMarkPolicy,
  ISendRuleDataSuccess,
  ISendRuleDataFailed,
  ISwitchConfirmModal,
  ISetProgrammError,
  ISwitchSaveModal,
  IChangeOrderItems,
  ISetPolicyNoneEdit,
  ISetPolicyEdit,
  ISetMarkPolicyEdit,
  ISetTextLablesData,
  ISetImageId,
}
