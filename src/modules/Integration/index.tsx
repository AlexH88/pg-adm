import * as React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import { Module } from 'shared/types/app';
import { reducer, actions } from './redux';
import * as Namespace from './namespace';
import Post from './view/Post/Post';
import Catalogs from './view/Catalogs/Catalogs';
import { moduleConfigs } from './configs';

class IntegrationModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return IntegrationModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={IntegrationModule.configs.link}>
        <Switch>
          <Route
            key="post"
            path={`${IntegrationModule.configs.link}/post`}
            component={Post}
          />
          <Route
            key="catalogs"
            path={`${IntegrationModule.configs.link}/catalogs`}
            component={Catalogs}
          />
        </Switch>
      </TemplateLayout>
    );
  }
}

export { IntegrationModule, reducer, Namespace, actions };