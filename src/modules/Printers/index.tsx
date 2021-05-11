import * as React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import TemplateLayout from 'modules/templates/view/Layout/Layout';
import {Module} from 'shared/types/app';
import {moduleConfigs} from './configs';
import {actions, reducer} from './redux';
import * as Namespace from './namespace';

import Printers from './view/Printers/Printers';
import PrinterGroups from 'modules/Printers/view/PrinterGroups/PrinterGroups';
import PrintersLocal from './view/PrintersLocal/PrintersLocal';
import RfidReaders from './view/Rfidreaders';
import SnmpMonitoring from './view/SnmpMonitoring/SnmpMonitoring';

class PrintersModule extends Module<{}> {

  public static configs = moduleConfigs;

  public getConfigs() {
    return PrintersModule.configs;
  }

  public getRoutes() {
    return (
      <TemplateLayout key={PrintersModule.configs.link}>
        <Switch>
          <Route
            key="printers-network"
            path={`${PrintersModule.configs.link}/printers-network`}
            component={Printers}
          />
          <Route
            key="printers-local"
            path={`${PrintersModule.configs.link}/printers-local`}
            component={PrintersLocal}
          />
          <Route
            key="printergroups"
            path={`${PrintersModule.configs.link}/printergroups`}
            component={PrinterGroups}
          />
          <Route 
            key="readers" 
            path={`${PrintersModule.configs.link}/readers`} 
            component={RfidReaders} 
          />
           <Route
            key="snmp-monitoring"
            path={`${PrintersModule.configs.link}/snmp-monitoring`}
            component={SnmpMonitoring}
          />
          <Redirect to={`${PrintersModule.configs.link}/printers-network`} />
        </Switch>
      </TemplateLayout>
    )
  }

}

export { PrintersModule, reducer, Namespace, actions };
