import * as NS from '../../namespace';


function setServerData(data: any): NS.ISetServerData {
    return { type : 'LOGIN_MODULE:SET_SERVER_DATA', payload: data };
}

function setErrorData(data: boolean): NS.ISetErrorData {
    return { type : 'LOGIN_MODULE:SET_ERROR_DATA', payload: data };
}

function authorize(from: any): NS.IAuthorize {
    return { type : 'LOGIN_MODULE:AUTHORIZE', payload: from };
}

function loadAuthorities(): NS.IILoadAuthorities {
    return { type : 'LOGIN_MODULE:LOAD_AUTHORITIES' };
}

function logout(): NS.ILogout {
    return { type : 'LOGIN_MODULE:LOGOUT' };
}

function changePassword(): NS.IChangePassword {
    return { type : 'LOGIN_MODULE:CHANGE_PASSWORD' };
}

function switchModalStatus(status) {
    return { type: 'LOGIN_MODULE:SWITCH_MODAL_STATUS', payload: status };
}

export {
    setServerData,
    setErrorData,
    authorize,
    loadAuthorities,
    logout, 
    changePassword,
    switchModalStatus
};
