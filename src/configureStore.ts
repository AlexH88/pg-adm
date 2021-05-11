import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Middleware,
  Reducer,
  ReducersMapObject,
  Store
} from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import {connectRouter, routerMiddleware} from 'connected-react-router';
import {reducer as formReducer} from 'redux-form';
import * as showResourceFeature from 'features/showResource';
import * as SnmpShowResourceFeature from 'features/SnmpShowResource';
import * as filterResourceFeature from 'features/filterResource';
import * as syncResourceFeature from 'features/syncResource';
import * as editUserGroupsFeature from 'features/editGroups';
import * as investigationFeature from 'features/investigationShowResource';
import * as UsersModule from 'modules/Users';
import * as AgentsModule from 'modules/Agents';
import * as AppModule from 'modules/App/App';
import * as PrintersModule from 'modules/Printers';
import * as PolicyModule from 'modules/Policy';
import * as SettingsModule from 'modules/Settings';
import * as InternalModule from 'modules/Internal';
import * as LoginModule from 'modules/Login';
import * as StatusModule from 'modules/Status';
import * as EventsModule from 'modules/Events';
import * as SnmpModule from 'modules/Snmp';
import * as IntegrationModule from 'modules/Integration';
import * as ReportModule from 'modules/Report';

import * as UserReportsModule from 'modules/UserReports';
import {IExtraArguments, IModule, IReducerData, IReduxState} from './shared/types/app';
import Api from './shared/api/Api';
import {createBrowserHistory} from 'history';

export const history = createBrowserHistory();

interface IStoreData {
  store: Store<IReduxState>;
  runSaga: SagaMiddleware['run'];
}

function configureStore(modules: Array<IModule<any>>, api: Api): IStoreData {
  const sagaMiddleware = createSagaMiddleware();
  const extraArguments: IExtraArguments = { api };

  const middlewares: Middleware[] = [
    sagaMiddleware,
    routerMiddleware(history),
    thunk.withExtraArgument(extraArguments),
  ];

  const reducer: Reducer<IReduxState> = createReducer(modules)(history);

  const store: Store<IReduxState> = createStore(
    reducer,
    compose(
      applyMiddleware(...middlewares),
      ('development' === process.env.NODE_ENV && window.__REDUX_DEVTOOLS_EXTENSION__)
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (arg: any) => arg,
    ),
  ) as Store<IReduxState>;

  sagaMiddleware.run(SnmpShowResourceFeature.actions.saga(extraArguments));
  sagaMiddleware.run(showResourceFeature.actions.saga(extraArguments));
  sagaMiddleware.run(filterResourceFeature.actions.saga(extraArguments));
  sagaMiddleware.run(editUserGroupsFeature.actions.saga(extraArguments));
  sagaMiddleware.run(syncResourceFeature.actions.saga(extraArguments));
  sagaMiddleware.run(investigationFeature.actions.saga(extraArguments));
  sagaMiddleware.run(UsersModule.actions.saga(extraArguments));
  sagaMiddleware.run(AgentsModule.actions.saga(extraArguments));
  sagaMiddleware.run(PrintersModule.actions.saga(extraArguments));
  sagaMiddleware.run(PolicyModule.actions.saga(extraArguments));
  sagaMiddleware.run(SettingsModule.actions.saga(extraArguments));
  sagaMiddleware.run(InternalModule.actions.saga(extraArguments));
  sagaMiddleware.run(AppModule.actions.saga(extraArguments));
  sagaMiddleware.run(UserReportsModule.actions.saga(extraArguments));
  sagaMiddleware.run(LoginModule.actions.saga(extraArguments));
  sagaMiddleware.run(EventsModule.actions.saga(extraArguments));
  sagaMiddleware.run(StatusModule.actions.saga(extraArguments));
  sagaMiddleware.run(SnmpModule.actions.saga(extraArguments));
  sagaMiddleware.run(IntegrationModule.actions.saga(extraArguments));
  sagaMiddleware.run(ReportModule.actions.saga(extraArguments));

  return {
    store,
    runSaga: sagaMiddleware.run,
  };
}

function createReducer(modules: Array<IModule<any>>, extraReducers?: Array<IReducerData<any>>): (history: any) => Reducer<IReduxState> {
  const reducersData = modules
    .filter((module: IModule<any>) => module.getReducer)
    .map((module: IModule<any>) => module.getReducer ? module.getReducer() : null)
    .concat(extraReducers || []);

  const modulesReducers: ReducersMapObject = reducersData.reduce(
    (reducers: ReducersMapObject, reducerData: IReducerData<any>) => {
      return { ...reducers, [reducerData.name]: reducerData.reducer };
    }, {} as ReducersMapObject,
  );

    // @ts-ignore
  return (history: History<any>) => combineReducers<ReducersMapObject>({
    syncResource:     syncResourceFeature.reducer,
    configs:          AppModule.reducer,
    login:            LoginModule.reducer,
    event:            EventsModule.reducer,
    status:           StatusModule.reducer,
    snmp:             SnmpModule.reducer,
    users:            UsersModule.reducer,
    agents:           AgentsModule.reducer,
    printers:         PrintersModule.reducer,
    policy:           PolicyModule.reducer,
    settings:         SettingsModule.reducer,
    internal:         InternalModule.reducer,
    userReports:      UserReportsModule.reducer,
    showResource:     showResourceFeature.reducer,
    SnmpShowResource:     SnmpShowResourceFeature.reducer,
    filterResource:   filterResourceFeature.reducer,
    editUserGroups:   editUserGroupsFeature.reducer,
    integration:      IntegrationModule.reducer,
    investigationResource: investigationFeature.reducer,
    report:           ReportModule.reducer,
    form: formReducer,
    router: connectRouter(history),
    ...modulesReducers
  } as any);
}

export { createReducer, IStoreData };
export default configureStore;
