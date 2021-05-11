import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import Actions from './view/Actions/Actions';
import Errors from './view/Errors/Errors';
// import Alerts from './view/Alerts/Alerts';
import * as Namespace from './namespace';
import {actions, reducer} from './redux';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';

class EventsModule extends Module<{}> {
  
  public static configs = moduleConfigs;

  public getConfigs() {
    return EventsModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={EventsModule.configs.link}>
        <Switch>
          <Route
            key="actions"
            path={`${EventsModule.configs.link}/actions`}
            component={Actions}
          />
          <Route
            key="errors"
            path={`${EventsModule.configs.link}/errors`}
            component={Errors}
          />
          {/*
          <Route
            key="alerts"
            path="alerts"
            component={Alerts}
          />
          */}
          <Redirect to={`${EventsModule.configs.link}/actions`} />
        </Switch>
      </TemplateLayout>
    );
  }
}

export { EventsModule, Namespace, reducer, actions };
