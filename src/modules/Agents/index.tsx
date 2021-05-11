import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';

import PrintServers from './view/PrintServers/PrintServers';
import PC from './view/PC/PC';
import GroupsPC from './view/GroupsPC/GroupsPC';

class AgentsModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return AgentsModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={AgentsModule.configs.link}>
        <Switch>
          <Route
            key="hosts-network"
            path={`${AgentsModule.configs.link}/hosts-network`}
            component={PrintServers}
          />
          <Route
            key="hosts-local"
            path={`${AgentsModule.configs.link}/hosts-local`}
            component={PC}
          />
          <Route
            key="hostgroups-local"
            path={`${AgentsModule.configs.link}/hostgroups-local`}
            component={GroupsPC}
          />
          <Redirect to={`${AgentsModule.configs.link}/hosts-network`} />
        </Switch>
      </TemplateLayout>
    )
  }
}

export { AgentsModule, reducer, Namespace, actions };
