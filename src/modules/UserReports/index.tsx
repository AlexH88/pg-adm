import * as React from 'react';
import {Route, Switch} from 'react-router';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
// import TotalStats from './view/TotalStats';
import EventLogs from './view/EventLogs';
import EventAgent from './view/EventAgent';
import EventUser from './view/EventUser';
// import AdminAction from './view/AdminAction';
// import GroupsTotalStats from './view/GroupsTotalStats';
// import PrinterTotalStats from './view/PrinterTotalStats';
// import PrinterGroupsTotalStats from './view/PrinterGroupsTotalStats';
// import SavedReports from './view/SavedReports';
// import UserDynamicReports from './view/UserDynamicReports';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';
// import UserDynamicReports from "./view/UserDynamicReports/index";
// import UserGroupsDynamicReports from "./view/UserGroupsDynamicReports/index";
// import PrintersDynamicReports from "./view/PrintersDynamicReports/index";
// import PrinterGroupsDynamicReports from "./view/PrinterGroupsDynamicReports/index";

class UserReportsModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return UserReportsModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={UserReportsModule.configs.link}>
        <Switch>

          <Route
            key="events"
            path={`${UserReportsModule.configs.link}/events`}
            component={EventLogs}
          />
          <Route
            key="userlogs"
            path={`${UserReportsModule.configs.link}/userlogs`}
            component={EventUser}
          />
          <Route
            key="agentlogs"
            path={`${UserReportsModule.configs.link}/agentlogs`}
            component={EventAgent}
          />
          {/* <Route
            key="by-users"
            path={`${UserReportsModule.configs.link}/static/by-users`}
            component={TotalStats}
          />
          <Route
            key="by-users-groups"
            path={`${UserReportsModule.configs.link}/static/by-users-groups`}
            component={GroupsTotalStats}
          />
          <Route
            key="by-printer"
            path={`${UserReportsModule.configs.link}/static/by-printer`}
            component={PrinterTotalStats}
          />
          <Route
            key="by-printer-groups"
            path={`${UserReportsModule.configs.link}/static/by-printer-groups`}
            component={PrinterGroupsTotalStats}
          />
          <Route
            key="by-users-dynamic"
            path={`${UserReportsModule.configs.link}/dynamic/by-users-dynamic`}
            component={UserDynamicReports}
          />
          <Route
            key="by-users-groups-dynamic"
            path={`${UserReportsModule.configs.link}/dynamic/by-users-groups-dynamic`}
            component={UserGroupsDynamicReports}
          />
          <Route
            key="by-printer-dynamic"
            path={`${UserReportsModule.configs.link}/dynamic/by-printer-dynamic`}
            component={PrintersDynamicReports}
          />
          <Route
            key="by-printer-groups-dynamic"
            path={`${UserReportsModule.configs.link}/dynamic/by-printer-groups-dynamic`}
            component={PrinterGroupsDynamicReports}
          />
          <Redirect
            exact from={`${UserReportsModule.configs.link}/static`}
            to={`${UserReportsModule.configs.link}/static/by-users`}
          />
          <Redirect
            exact from={`${UserReportsModule.configs.link}/dynamic`}
            to={`${UserReportsModule.configs.link}/dynamic/by-users-dynamic`}
          /> */}
        </Switch>
      </TemplateLayout>
    );
  }
}

export { UserReportsModule, reducer, Namespace, actions };
