import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import Roles from 'modules/Settings/view/Roles/Roles';
import Operators from 'modules/Settings/view/Operators/Operators';
import Notifications from 'modules/Settings/view/Notifications/Notifications';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import Features from './view/Features/Features';
import About from './view/About/About';
import Ignored from './view/Ignored/Ignored';
import Smpt from './view/Smpt/Smpt';
import License from './view/License/License';
import {moduleConfigs} from './configs';

class SettingsModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return SettingsModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={SettingsModule.configs.link}>
        <Switch>
          <Route
            key="roles"
            path={`${SettingsModule.configs.link}/administration/roles`}
            component={Roles}
          />
          <Route
            key="usergroups"
            path={`${SettingsModule.configs.link}/administration/operators`}
            component={Operators}
          />
          <Route
            key="features"
            path={`${SettingsModule.configs.link}/features`}
            component={Features}
          />
          <Route
            key="blocked_printers"
            path={`${SettingsModule.configs.link}/blocked_printers`}
            component={Ignored}
          />
          <Route
            key="notifications"
            path={`${SettingsModule.configs.link}/notifications`}
            component={Notifications}
          />
          <Route
            key="smtp"
            path={`${SettingsModule.configs.link}/smtp`}
            component={Smpt}
          />
          <Route
            key="about"
            path={`${SettingsModule.configs.link}/about`}
            component={About}
          />
          <Route
            key="license"
            path={`${SettingsModule.configs.link}/license`}
            component={License}
          />
          <Redirect to={`${SettingsModule.configs.link}/administration/roles`} />
        </Switch>
      </TemplateLayout>
    );
  }
}

export { SettingsModule, reducer, Namespace, actions };
