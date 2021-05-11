import {IInjectedResource} from 'shared/helpers/injectResource';

interface ISetServerData extends IInjectedResource {
  type: 'LOGIN_MODULE:SET_SERVER_DATA'
}

interface ISetErrorData extends IInjectedResource {
  type: 'LOGIN_MODULE:SET_ERROR_DATA'
}

interface IAuthorize extends IInjectedResource {
  type: 'LOGIN_MODULE:AUTHORIZE'
}

interface IILoadAuthorities extends IInjectedResource {
  type: 'LOGIN_MODULE:LOAD_AUTHORITIES'
}

interface ILogout extends IInjectedResource {
  type: 'LOGIN_MODULE:LOGOUT'
}
interface IChangePassword extends IInjectedResource {
  type: 'LOGIN_MODULE:CHANGE_PASSWORD'
}

interface IGetAuthoritiesCurrent extends IInjectedResource {
  type: 'LOGIN_MODULE:GET_AUTHORITIES_CURRENT'
}

interface ISwitchModalStatus extends IInjectedResource {
  type: 'LOGIN_MODULE:SWITCH_MODAL_STATUS'
}

type LoginModuleActions = (
  ISetServerData
  | ISetErrorData
  | IAuthorize
  | IILoadAuthorities
  | ILogout
  | IGetAuthoritiesCurrent
  | IChangePassword
  | ISwitchModalStatus
);

export {
  LoginModuleActions,
  ISetServerData,
  ISetErrorData,
  IAuthorize,
  IILoadAuthorities,
  IGetAuthoritiesCurrent,
  ILogout, 
  IChangePassword, 
  ISwitchModalStatus
}
