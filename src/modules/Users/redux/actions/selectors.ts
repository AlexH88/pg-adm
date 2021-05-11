import {IReduxState} from 'shared/types/app';
import {IUser} from 'shared/types/users';
import {IGroup} from 'shared/types/groups';

function getUserById(state: IReduxState, id: number, resource: string): IUser | undefined {
  let user: IUser | undefined;
  Object.keys(state.showResource[resource].data).find((page: string) => {
    user = (state.showResource[resource].data[parseInt(page, 10)] as IUser[]).find((item: IUser) => item.id === id);
    return Boolean(user);
  });
  return user;
}

function getGroupById(state: IReduxState, id: number, resource: string) {
  let group: IGroup | undefined;
  Object.keys(state.showResource[resource].data).find((page: string) => {
    group = (state.showResource[resource].data[+page] as IGroup[]).find((item: IGroup) => item.id === id);
    return Boolean(group);
  });
  return group;
}

function selectIsAllSelected(state: IReduxState, all: IUser[]): boolean {
  const selected = state.users.selectedUsers;
  return all.every(user => Boolean(selected.find(_user => user.id === _user.id)));
}

export {
  getUserById,
  getGroupById,
  selectIsAllSelected,
}
