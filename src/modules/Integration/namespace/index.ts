import { IUser } from 'shared/types/users';
import { IGroup } from 'shared/types/groups';

type IMode = 'edit' | 'create' | 'partial-edit' | '';

interface IReduxState {
  success: string;
  showModal: boolean;
  modalMode: IMode;
  currentStatus: any;
  settingsIntegration: any;
  sendingCatalogData: boolean;
  showSyncModal: boolean;
  showRemoveModal: boolean;
  availableCatalogs: any;
  availableCatalogGroups: any;
}

interface IAgregate {
  value: string;
  title: string;
}

export {
  IReduxState,
  IAgregate,
  IMode,
};

export * from './actionTypes'
