import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import SnmpConfig from './view/SnmpConfig';

class InternalModule extends Module<{}> {

    public static configs = moduleConfigs;

    public getConfigs() {
      return InternalModule.configs;
    }

    public getRoutes() {
        return (
            <TemplateLayout key={InternalModule.configs.link} section="internal">
              <Switch>
                <Route
                  key="users"
                  path={`${InternalModule.configs.link}/snmp_config`}
                  component={SnmpConfig}
                />
                <Redirect to={`${InternalModule.configs.link}/snmp_config`} />
              </Switch>
            </TemplateLayout>
        );
    }
}

export { InternalModule, reducer, Namespace, actions };
