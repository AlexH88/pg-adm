import {IInjectedResource} from 'shared/helpers/injectResource';

interface ISendUserData extends IInjectedResource {
  type: 'LOGIN_MODULE:SEND_USER_DATA'
}

interface ISetServerData extends IInjectedResource {
  type: 'LOGIN_MODULE:SET_SERVER_DATA'
}

interface ISetErrorData extends IInjectedResource {
  type: 'LOGIN_MODULE:SET_ERROR_DATA'
}

interface ILogout extends IInjectedResource {
  type: 'LOGIN_MODULE:LOGOUT'
}

interface IGetAuthoritiesCurrent extends IInjectedResource {
  type: 'LOGIN_MODULE:GET_AUTHORITIES_CURRENT'
}

type LoginModuleActions = (
    ISendUserData
  | ISetServerData
  | ISetErrorData
  | ILogout
  | IGetAuthoritiesCurrent
);

export {
  LoginModuleActions,
  ISendUserData,
  ISetServerData,
  ISetErrorData,
  ILogout,
  IGetAuthoritiesCurrent
}
