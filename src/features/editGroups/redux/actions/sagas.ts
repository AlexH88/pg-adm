import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {SagaIterator} from 'redux-saga';
import {getErrorMsg, getResourceById, injectResource} from 'shared/helpers';
import * as showResourceFeature from 'features/showResource';
import {IExtraArguments, IReduxState} from 'shared/types/app';
import {IUser} from 'shared/types/users';
import * as actionTypes from '../../actionTypes';
import {IGroup, IResource, IResourceGroup} from './../../namespace';
import {switchGroupModal} from './communication';
import {convertForDataUpdate, convertForShortRequest} from 'shared/helpers/resourceConvertion';

function getSaga({ api }: IExtraArguments) {

  function* executeResourceEditGroups(action: actionTypes.IGroupsEditAction) {
    const resource = action.meta ? action.meta.resource : '';
    const resourceNameForRequest = convertForShortRequest(resource);
    
    try {
      const editedResource: IResource | any = yield select((state: IReduxState) => (
        getResourceById(resource, state, action.payload)
      ));
      const allGroups: any = yield call(api.loadGroups, resourceNameForRequest);
      let groupsList: IGroup[] = [];

      if (allGroups.items) {
        groupsList = allGroups.items.map((group: IGroup) => ({
            ...group,
            isConnected: editedResource['groups'].some((userGroup: any) => userGroup.id === group.id)
        }));
      }

      yield takeLatest(
        'EDIT_GROUPS:SINGLE_GROUPS_EDIT_ACCEPT',
        () => executeAcceptResourceEditGroups([editedResource.id], resource)
      );

      yield put({ type: 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS', payload: groupsList });
      yield put(switchGroupModal(true));
    } catch (error) {
      const message = getErrorMsg(error);
      console.dir(error);
      yield put({ type: 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS_FAILED', payload: message });
    }
  }

  function* executeResourcesEditGroups(action: actionTypes.IMultiGroupsEditAction) {
    const resource = action.meta ? action.meta.resource : '';
    try {
      const resourceNameForRequest = convertForShortRequest(resource);
      const editedResource: IResource[] = action.payload;
      yield put(switchGroupModal(true));

      const allGroups: IResourceGroup = yield call(api.loadGroups, resourceNameForRequest);
      const groupsList: IGroup[] = allGroups.items.map((group: IGroup) => {
        const findUserGroup = ({ groups }: IUser) => groups
          ? groups.find((foundGroup) => foundGroup === group.id)
          : false;
        const editedGroupsCount = editedResource.filter(findUserGroup).length;
        return {
          ...group,
          isConnected: editedGroupsCount === editedResource.length,
          isSomeConnected: editedGroupsCount > 0 && editedGroupsCount !== editedResource.length,
        };
      });

      yield takeLatest(
        'EDIT_GROUPS:MULTI_GROUPS_EDIT_ACCEPT',
        () => executeAcceptResourceEditGroups(editedResource.map((resource) => resource.id), resource)
      );
      
      yield put({ type: 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS', payload: groupsList  });
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'EDIT_GROUPS:SAVE_ALL_GROUPS_WITH_STATUS_FAILED', payload: message });
    }
  }

  function* executeReloadTable(resource: string) {
    yield put(injectResource(resource, showResourceFeature.actions.loadResource)(false, false));
  }

  function* executeAcceptResourceEditGroups(resourceId: number[], resource: string) {
    try {
      const allGroups = yield select((state: IReduxState) => state.editUserGroups.allGroups);
      const acceptGroups: number[] = allGroups
        .filter((group: IGroup) => group.isConnected)
        .map((item: IGroup) => item.id);

      let resourceNameUpdate = convertForDataUpdate(resource);
      let resourceNameShort = convertForShortRequest(resource);

      const data = resourceId.map((itemId: number) => ({
        [`${resourceNameShort}Id`]: itemId,
        groups: acceptGroups,
      }));

      const response = yield call(api.changeUserGroups, data, resourceNameUpdate);
      if (Object.values(response).length) {
        yield call(executeReloadTable, resource);
        yield put(switchGroupModal(false));
      } else {
        throw new Error('Error while save user groups');
      }
    } catch (error) {
      const message = getErrorMsg(error);
      yield put({ type: 'EDIT_GROUPS:GROUPS_EDIT_ACCEPT_FAILED', payload: message });
    }
  }

  function* saga(): SagaIterator {
    const resourceGroupEditType: actionTypes.IGroupsEditAction['type'] = 'EDIT_GROUPS:GROUPS_EDIT';
    const resourcesGroupEditType: actionTypes.IMultiGroupsEditAction['type'] = 'EDIT_GROUPS:MULTI_GROUPS_EDIT';
    yield all([
      takeLatest(resourceGroupEditType, executeResourceEditGroups),
      takeLatest(resourcesGroupEditType, executeResourcesEditGroups),
    ]);
  }

  return saga;
}

export default getSaga;
