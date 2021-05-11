interface IReduxState {
  chosenHostId: number;
  showSyncModal: boolean;
  showRemoveModal: boolean;
  tryDeletingItemId: number | string;
  deletingGroupId: number | string;
  showModal: boolean;
  showHostGroupEditModal: boolean;
  deleteAgentId: number;
  showLogModal: boolean;
  logPrinterId: any;
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
}

export * from './actionTypes';
