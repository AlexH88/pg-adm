import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import Users from './view/Users/Users';
import Groups from './view/Groups/Groups';
import Catalogs from './view/Catalogs/Catalogs';
import * as Namespace from './namespace';
import {actions, reducer} from './redux';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';

class UsersModule extends Module<{}> {
  
  public static configs = moduleConfigs;

  public getConfigs() {
    return UsersModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={UsersModule.configs.link}>
        <Switch>
          <Route
            key="users"
            path={`${UsersModule.configs.link}/users`}
            component={Users}
          />
          <Route
            key="usergroups"
            path={`${UsersModule.configs.link}/usergroups`}
            component={Groups}
          />
          <Route
            key="catalogs"
            path={`${UsersModule.configs.link}/catalogs`}
            component={Catalogs}
          />
          <Redirect to={`${UsersModule.configs.link}/users`} />
        </Switch>
      </TemplateLayout>
    );
  }
}

export { UsersModule, Namespace, reducer, actions };
