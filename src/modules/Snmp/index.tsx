import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import Monitoring from 'modules/Snmp/view/Monitoring/Monitoring';
import MIB from 'modules/Snmp/view/MIB/MIB';
import * as Namespace from './namespace';

class SnmpModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return SnmpModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={SnmpModule.configs.link}>
        <Switch>
          <Route
            key="monitoring"
            path={`${SnmpModule.configs.link}/monitoring`}
            component={Monitoring}
          />
          <Route
            key="oid"
            path={`${SnmpModule.configs.link}/oid`}
            component={MIB}
          />
          <Redirect to={`${SnmpModule.configs.link}/monitoring`} />
        </Switch>
      </TemplateLayout>
    );
  }

}

const oidParameters: string[] = [ 'device_status', 'printing_status', 'printed', 'uptime', 'black_toner_max',
'black_toner_current', 'black_toner_percent', 'cyan_toner_max', 'cyan_toner_current', 'cyan_toner_percent',
'yellow_toner_max', 'yellow_toner_current', 'yellow_toner_percent', 'magenta_toner_max',
'magenta_toner_current', 'magenta_toner_percent' ];

export { SnmpModule, reducer, actions, Namespace, oidParameters };
