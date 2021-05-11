import * as React from 'react';
import {Route} from 'react-router-dom';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import Login from './view/LoginPage';

class LoginModule extends Module<{}> {

    public static configs = moduleConfigs;

    public getConfigs() {
      return LoginModule.configs;
    }

    public getRoutes() {
        return (
            <Route key="login" path={LoginModule.configs.link} component={Login} />
        );
    }
}

export { LoginModule, reducer, Namespace, actions };
