import {IUser} from 'shared/types/users';
import {IGroup} from 'shared/types/groups';

type IMode = 'edit' | 'create' | 'partial-edit' | '';

interface IReduxState {
  success: string;
  currentOperator: any;
  showModal: boolean;
  showRemoveModal: boolean;
  isMultiEdit: boolean;
  isAllSelected: boolean;
  modalMode: IMode;
  selectedUsers: IUser[];
  sendingCatalogData: boolean;
  showSyncModal: boolean;
  deleteResourceField?: IGroup | IUser;
  choosenCatalogEditName: string;
  availableCatalogs: any[];
  availableCatalogGroups: any;
  showModalLoadFile: boolean;
  error: string;
  usersOutsideDB: [];
  updateCardStatus: boolean;
}

interface IGroupHeaderConfigs {
  [index: string]: any;
  initialRestricted: string[];
  type: string[];
  period: {
    day: string;
    week: string;
    month: string;
  };
}

interface ICatalogHeaderConfigs {
  type: {
    ad: string;
    edir: string;
  };
}

interface IAgregate {
  value: string;
  title: string;
}

export {
  IReduxState,
  IAgregate,
  IMode,
  IGroupHeaderConfigs,
  ICatalogHeaderConfigs,
};

export * from './actionTypes'
