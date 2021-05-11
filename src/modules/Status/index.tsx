import * as React from 'react';
import {Route,} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import Status from './view/Status/Status';

class StatusModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return StatusModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={StatusModule.configs.link}>
        <Route key="status" path={StatusModule.configs.link} component={Status} />
      </TemplateLayout>
    );
  }

}

export { StatusModule, reducer, Namespace, actions };
