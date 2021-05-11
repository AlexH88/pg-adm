import {IUser} from 'shared/types/users';
import {IPrinter} from 'shared/types/printers';

interface IGroup {
  id: number;
  name: string;
  isConnected?: boolean;
  isSomeConnected?: boolean;
  ldapSource?: any;
}

interface IGroupData {
  id: number;
  name: string;
}

interface IResourceGroup {
  items: IGroupData[];
}

type IResource = IUser | IPrinter;

interface IReduxState {
  allGroups: IGroup[];
  showUserGroupModal: boolean;
}

interface IUsersResponse {
  id: string;
  name: string;
}

interface IData {
  id: number;
  groups: number[];
}

export {
  IData,
  IReduxState,
  IUsersResponse,
  IGroup,
  IResource,
  IResourceGroup,
}
