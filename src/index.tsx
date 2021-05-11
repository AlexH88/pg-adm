import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'connected-react-router';
import {Redirect, Route, Switch} from 'react-router-dom';
import createRoutes from './routes';
import {App} from './modules/App';
import configureStore, {history} from './configureStore';
import {Module} from './shared/types/app';
import Api from './shared/api/Api';
import {address} from 'shared/api/HttpActions';

import {LoginModule} from './modules/Login';
import {StatusModule} from './modules/Status';
import {UsersModule} from './modules/Users';
import {AgentsModule} from './modules/Agents';
import {EventsModule} from './modules/Events';
import {JournalModule} from './modules/Journal';
import {PolicyModule} from './modules/Policy';
import {PrintersModule} from './modules/Printers';
import {SettingsModule} from './modules/Settings';
import {SnmpModule} from './modules/Snmp';
import {UserReportsModule} from './modules/UserReports';
import {InternalModule} from './modules/Internal';
import {ReportModule} from './modules/Report';
import { IntegrationModule } from './modules/Integration';
import Login from './modules/Login/view/LoginPage';

const modules: Array<Module<any>> = [
  new UsersModule(),
  new AgentsModule(),
  new PrintersModule(),
  new JournalModule(),
  new PolicyModule(),
  new SettingsModule(),
  new UserReportsModule(),
  new EventsModule(),
  new StatusModule(),
  new SnmpModule(),
  new InternalModule(),
  new ReportModule(),
  new IntegrationModule()
];

const api = new Api(address);
// @ts-ignore
const { store } = configureStore(modules, api);
// @ts-ignore
const routes = createRoutes(modules);

const credentials: any = localStorage.getItem('userCredentials');

const rootComponent = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
      <Switch>
        {routes}
        <Route key="login" path={LoginModule.configs.link} component={Login} />
        {
          credentials === null
          || JSON.parse(credentials).access_token.length === 0
          || JSON.parse(credentials).refresh_token.length === 0
          ? <Redirect exact from="/" to="/login"/>
          : <Redirect exact from="*" to="/home/users"/>
        }
      </Switch>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(rootComponent, document.getElementById('root'));

export { store };
