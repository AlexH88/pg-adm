import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import TimePolicies from './view/TimePolicies';
//import TextMarks from './view/TextMarks';
//import MarkPolicies from './view/MarkPolicies';
//import AgentPolicies from './view/AgentPolicies';
import BackupPolicies from './view/BackupPolicies';
import RestrictionPolicies from './view/RestrictionPolicies';
import WatermarkPolicies from './view/WatermarkPolicies';
import Investigation from './view/Investigation'
//import WatermarkPolicies from './view/WatermarkSettings';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import {moduleConfigs} from './configs';

class PolicyModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return PolicyModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={PolicyModule.configs.link}>
        <Switch>
          <Route
            key="time-policies"
            path={`${PolicyModule.configs.link}/time-policies`}
            component={TimePolicies}
          />
          <Route
            key="restriction-policies"
            path={`${PolicyModule.configs.link}/restriction-policies`}
            component={RestrictionPolicies}
          />
          <Route
            key="backup-policies"
            path={`${PolicyModule.configs.link}/backup-policies`}
            component={BackupPolicies}
          />
          <Route
            key="watermark-policies"
            path={`${PolicyModule.configs.link}/water-marks/watermark-policies`}
            component={WatermarkPolicies}
          />
          <Route
            key="investigation"
            path={`${PolicyModule.configs.link}/water-marks/investigation`}
            component={Investigation}
          />
          {/*
          <Route
            key="copy-policies"
            path={`${PolicyModule.configs.link}/copy-policies`}
            component={CopyPolicies}
          />
          <Route
            key="economy-policies"
            path={`${PolicyModule.configs.link}/economy-policies`}
            component={EconomyPolicies}
          />
          <Route
            key="text-marks"
            path={`${PolicyModule.configs.link}/text-marks`}
            component={TextMarks}
          />
          */}
          <Redirect to={`${PolicyModule.configs.link}/time-policies`} />
        </Switch>
      </TemplateLayout>
    );
  }
}
  // copy_policies

export { PolicyModule, reducer, Namespace, actions };
