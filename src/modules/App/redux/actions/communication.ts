import {IChangeConfigStatusAction, ILoadConfigAction, ILoadConfigActionSuccess, ISendUserData} from '../../actionTypes';
import {IConfigDescription} from 'shared/types/app';

function loadConfig(): ILoadConfigAction {
  return { type: 'APPLICATION-MODULE:CREATE_RESOURCE' };
}

function loadConfigSuccess(config: IConfigDescription): ILoadConfigActionSuccess {
  return { type: 'APPLICATION-MODULE:CREATE_RESOURCE_SUCCES', payload: config };
}

function changeConfigStatus(status: boolean): IChangeConfigStatusAction {
  return { type: 'APPLICATION-MODULE:CHANGE_CONFIG_STATUS', payload: status };
}

function sendUserData(): ISendUserData {
  return { type : 'APPLICATION-MODULE:SEND_USER_DATA'/*, payload: data */};
}

export {
  loadConfig,
  loadConfigSuccess,
  changeConfigStatus,
  sendUserData
};
