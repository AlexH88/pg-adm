import {
    IAcceptMultiEditGroupsAction,
    IAcceptSingleEditGroupsAction,
    IChangeGroupAction,
    IGroupsEditAction,
    IMultiGroupsEditAction,
    ISwitchGroupModalAction,
} from '../../actionTypes';
import {IResource} from '../../namespace';

function switchGroupModal(status: boolean): ISwitchGroupModalAction {
  return { type: 'EDIT_GROUPS:SWITCH_GROUP_MODAL_STATUS', payload: status };
}

function changeGroup(id: number, isConected: boolean): IChangeGroupAction {
  return { type: 'EDIT_GROUPS:SWITCH_GROUPS_STATUS', payload: { id, isConected } };
}

function groupsEdit(id: number ): IGroupsEditAction {
  return { type: 'EDIT_GROUPS:GROUPS_EDIT', payload: id };
}

function multiGroupsEdit(resource: IResource[]): IMultiGroupsEditAction {
  return { type: 'EDIT_GROUPS:MULTI_GROUPS_EDIT', payload: resource };
}

function acceptSingleEditGroups(): IAcceptSingleEditGroupsAction {
  return { type: 'EDIT_GROUPS:SINGLE_GROUPS_EDIT_ACCEPT' };
}

function acceptMultiEditGroups(): IAcceptMultiEditGroupsAction {
  return { type: 'EDIT_GROUPS:MULTI_GROUPS_EDIT_ACCEPT' };
}

export {
  switchGroupModal,
  changeGroup,
  groupsEdit,
  acceptSingleEditGroups,
  acceptMultiEditGroups,
  multiGroupsEdit,
}
