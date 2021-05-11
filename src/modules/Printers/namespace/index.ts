type IMode = 'edit' | 'create' | 'partial-edit' | '';

interface IReduxState {
  choosenPrintServerEditName: string;
  showSyncModal: boolean;
  showRemoveModal: boolean;
  tryDeletingItemId: number | string;
  deletingGroupId: number | string;
  showModal: boolean;
  showHostGroupEditModal: boolean;
  deleteAgentId: number;
  showLogModal: boolean;
  logPrinterId: any;
  modalMode: IMode;
  printerGroups: boolean
}

interface IPayloadTryDeleteResourceSuccess {
  response: {
    printer: string;
  };
  id: number | string;
}

interface IPayloadTryDeleteResourceFailed {
  error: string;
}

interface IPayloadAcceptDeleteSuccess {
  response: {};
}

export {
  IReduxState,
  IPayloadTryDeleteResourceSuccess,
  IPayloadTryDeleteResourceFailed,
  IPayloadAcceptDeleteSuccess,
  IMode
}

export * from './actionTypes';
