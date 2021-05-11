
interface IReduxState {
  showModal: boolean;
  modalMode: IMode;
  settings: any;
}

type IMode = 'edit' | 'create'| '';

interface IAgregate {
  value: string;
  title: string;
}

export {
  IReduxState,
  IMode,
  IAgregate
}

export * from './actionTypes';
export * from './apiCommunication';
