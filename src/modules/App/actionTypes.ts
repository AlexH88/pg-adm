import {IAction, IConfigDescription, IEmptyAction} from 'shared/types/app';

interface ILoadConfigAction extends IEmptyAction {
  type: 'APPLICATION-MODULE:CREATE_RESOURCE';
}

interface ILoadConfigActionSuccess extends IAction<IConfigDescription> {
  type: 'APPLICATION-MODULE:CREATE_RESOURCE_SUCCES';
}

interface IChangeConfigStatusAction extends IAction<boolean> {
  type: 'APPLICATION-MODULE:CHANGE_CONFIG_STATUS';
}

interface ISendUserData extends IEmptyAction/*<{login: string, password: string}>*/ {
  type: 'APPLICATION-MODULE:SEND_USER_DATA'
}

type AppModuleActions = ILoadConfigActionSuccess | IChangeConfigStatusAction | ISendUserData;

export {
  AppModuleActions,
  ILoadConfigAction,
  ILoadConfigActionSuccess,
  IChangeConfigStatusAction,
  ISendUserData
};
