import {IConfigResourse} from 'shared/types/app';

interface IReduxState {
  description: {
    users: IConfigResourse,
    [key: string]: IConfigResourse,
  };
  status: boolean;
}

export { IReduxState };
