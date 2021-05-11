import {IInjectedResource} from 'shared/helpers/injectResource';

interface ISwitchGroupModalAction extends IInjectedResource {
  type: 'EDIT_GROUPS:SWITCH_GROUP_MODAL_STATUS';
}

interface IGroupsEditAction extends IInjectedResource {
  type: 'EDIT_GROUPS:GROUPS_EDIT';
}

interface IMultiGroupsEditAction extends IInjectedResource {
  type: 'EDIT_GROUPS:MULTI_GROUPS_EDIT';
}

interface ILoadAllGroupsSuccessAction extends IInjectedResource {
  type: 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS';
}

interface IChangeGroupAction extends IInjectedResource {
  type: 'EDIT_GROUPS:SWITCH_GROUPS_STATUS';
}

interface IAcceptSingleEditGroupsAction extends IInjectedResource {
  type: 'EDIT_GROUPS:SINGLE_GROUPS_EDIT_ACCEPT';
}

interface IAcceptMultiEditGroupsAction extends IInjectedResource {
  type: 'EDIT_GROUPS:MULTI_GROUPS_EDIT_ACCEPT';
}

type EditUserGroups =
  | ISwitchGroupModalAction
  | ILoadAllGroupsSuccessAction
  | IChangeGroupAction
  | IGroupsEditAction
  | IAcceptSingleEditGroupsAction
  | IAcceptMultiEditGroupsAction
  | IMultiGroupsEditAction;

export {
  EditUserGroups,
  ISwitchGroupModalAction,
  ILoadAllGroupsSuccessAction,
  IChangeGroupAction,
  IGroupsEditAction,
  IAcceptSingleEditGroupsAction,
  IAcceptMultiEditGroupsAction,
  IMultiGroupsEditAction,
};
