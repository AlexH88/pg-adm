// import { IUser } from 'shared/types/users';
// import { IGroup } from 'shared/types/groups';

type IMode = 'edit' | 'create' | 'partial-edit' | '';

interface IReduxState {
  currentOperator: any;
  showRegularModal?: boolean;
  showRemoveModal?: boolean;
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
