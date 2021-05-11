import * as React from 'react';
import {Route} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import Report from 'modules/Report/view/Report/Report';
import ReportByGroupPrinters from 'modules/Report/view/ReportByGroupPrinters/ReportByGroupPrinters';
import ReportByGroupUsers from 'modules/Report/view/ReportByGroupUsers/ReportByGroupUsers';
import ReportByPrinters from 'modules/Report/view/ReportByPrinters/ReportByPrinters';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
import {moduleConfigs} from './configs';

class ReportModule extends Module<{}> {
  
  public static configs = moduleConfigs;

  public getConfigs() {
    return ReportModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={ReportModule.configs.link}>
        <Route
          key="report_by_users"
          path={`${ReportModule.configs.link}/report_by_users`}
          component={Report}
        />
        <Route
          key="report_by_printers"
          path={`${ReportModule.configs.link}/report_by_printers`}
          component={ReportByPrinters}
        />
        <Route
          key="report_by_group_users"
          path={`${ReportModule.configs.link}/report_by_group_users`}
          component={ReportByGroupUsers}
        />
        <Route
          key="report_by_group_printers"
          path={`${ReportModule.configs.link}/report_by_group_printers`}
          component={ReportByGroupPrinters}
        />
      </TemplateLayout>
    );
  }
}

export { ReportModule, reducer, Namespace, actions };
