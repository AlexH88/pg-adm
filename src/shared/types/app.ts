
import { Reducer } from 'redux';
import { Namespace as ShowResource } from 'features/showResource';
import { Namespace as SnmpShowResource } from 'features/SnmpShowResource';
import { Namespace as FilterResource } from 'features/filterResource';
import { Namespace as SyncResource } from 'features/syncResource';
import { Namespace as ShowUserGroups } from 'features/editGroups';
import { Namespace as UsersModule } from 'modules/Users';
import { Namespace as EventsModule } from 'modules/Events';
import { Namespace as LoginModule} from 'modules/Login';
import { Namespace as PrintersModule } from 'modules/Printers';
import { Namespace as AppModule } from 'modules/App/App';
import { Namespace as PolicyModule } from 'modules/Policy';
import { Namespace as SettingsModule } from 'modules/Settings';
import { Namespace as UserReports } from 'modules/UserReports';
import { Namespace as AgentsModule } from 'modules/Agents';
import { Namespace as SnmpModule } from 'modules/Snmp';
import { Namespace as IntegrationModule } from 'modules/Integration';
import { Namespace as ReportModule } from 'modules/Report';
import { Namespace as StatusModule } from 'modules/Status';
import Api from '../api/Api';
// @ts-ignore
abstract class Module<S> implements IModule<S> {
  protected onConnectRequestHandler?: (reducers: Array<IReducerData<any>>, saga: Function) => void;

  public set onConnectRequest(handler: (reducers: Array<IReducerData<any>>, saga: Function) => void) {
    this.onConnectRequestHandler = handler;
  };
}

interface IModuleLink {
  link: string;
  title: string;
  categories?: IModuleLink[];
  turnedOff?: boolean;
}

interface IModuleLinks {
  [value: string]: IModuleLink & {
    categories?: IModuleLinks;
  };
}

interface IModule<S> {
  // @ts-ignore
  // getRoutes?(): ReactElement<Route.RouteProps> | Array<ReactElement<Route.RouteProps>>;
  getRoutes?(): any;
  getConfigs(): any;
  getReducer?(): IReducerData<S>;
}

interface IReducerData<S> {
  name: string;
  reducer: Reducer<S>;
}

interface IExtraArguments {
  api: Api;
}

interface IEmptyAction {
  type: string;
}
interface IAction<T> extends IEmptyAction {
  payload: T;
}

interface IReduxState {
  currentOperator: any;
  internal: any;
  showResource: ShowResource.IReduxState;
  SnmpShowResource: SnmpShowResource.ISnmpReduxState;
  filterResource: FilterResource.IReduxState;
  editUserGroups: ShowUserGroups.IReduxState;
  syncResource: SyncResource.IReduxState;
  login: LoginModule.IReduxState;
  events: EventsModule.IReduxState;
  users: UsersModule.IReduxState;
  agents: AgentsModule.IReduxState;
  configs: AppModule.IReduxState;
  printers: PrintersModule.IReduxState;
  policy: PolicyModule.IReduxState;
  settings: SettingsModule.IReduxState;
  userReports: UserReports.IReduxState;
  snmp: SnmpModule.IReduxState;
  switchSaveModal: ShowResource.ISwitchSaveModal; // TODO скорее всего не тот интерфейс
  integration: IntegrationModule.IReduxState;
  report: ReportModule.IReduxState;
  status: StatusModule.IReduxState;
  form: any;
}

interface IResource {
  id: number;
  [key: string]: any;
}

interface IFiltersResponse {
  results: {
    filters: Array<{
      param: string;
      type: string;
      values?: Array<{ id: number, name: string }>;
    }>;
  };
}

interface IPermission {
  type: string;
  set: boolean;
}

interface IResourceStatus {
  status_code: string | number;
  field: string;
}

interface IConfigHeader {
  title: string;
  value: string;
  isSortable?: boolean;
  isConnected?: boolean;
  required?: boolean;
}

interface IConfigHeaders {
  headers: IConfigHeader[];
}

interface IAggregate {
  value: string;
  title: string;
}

interface IConfigFilters {
  name: string;
  view: string;
  use: boolean;
  type: string;
  values?: Array<{ id: number, name: string }>;
  isConnected: boolean;
}

interface IParam {
  name: string;
  type: string;
  view: string;
  sort: boolean;
  use: boolean;
  required?: boolean;
}

interface ICofigAggregate {
  name: string;
  view: string;
}

interface IConfigResourse {
  params: IParam[];
  permissions: IPermission[];
  filters: IConfigFilters[];
  aggregates: ICofigAggregate[];
}

interface IFilterHeader {
  name: string;
  type: string;
  isConnected: boolean;
  values?: IValues[];
  title: string;
}

interface IValues {
  id: number;
  name: string;
}

interface ISource {
  id: number;
  name: string;
  label: string;
}

interface IConfigDescription {  // TODO fix typings for config description after fix filters
  description: {
    users: IConfigResourse,
    groups: IConfigResourse,
    catalogs: IConfigResourse,
  };
}

interface IOperator {
  id: number;
  password: string;
  login: string;
  email: string;
  role: string;
}

interface ITemplate {
  tag: string;
  title: string;
  subject: string;
  body: string;
  modifiedAt: string;
  enabled: boolean;
  email?: boolean;
  emails?: [];
}

interface IReport {
  startDate?: any;
  endDate?: any;
  type?: any;
  enabled?: any;
}

interface IIntegration {
  field1?: any;
  field2?: any;
  field3?: any;
}

interface IReports {
  field1?: any;
  field2?: any;
  field3?: any;
}

interface ISyncData {
  data?: any;
  sync?: string[];
  unsync?: string[];
  groups?: any;
}

type Iicon = 'trash' | 'pen' | 'folder' | 'sync' | 'dummy' | 'trash_off' | 'pen_off' | 'folder_off' | 'sync_off' | 'unsync' | 'unsync_off';

type IresourcesTypes = 'printers' | 'users';

type TypesResources =
  'rules'
  | 'snmp_config'
  | 'reader'
  | 'policies'
  | 'time_policy'
  | 'backup_policy'
  | 'restriction_policy'
  | 'watermark_policy'
  | 'investigation'
  | 'rfidreaders'
  | 'printergroups'
  | 'printers-local'
  | 'printers-network'
  | 'floors'
  | 'catalogs'
  | 'usergroups'
  | 'users'
  | 'groups'
  | 'jobs'
  | 'roles'
  | 'operators'
  | 'templates'
  | 'report'
  | 'user_reports'
  | 'printservers'
  | 'user_groups_reports'
  | 'printer_reports'
  | 'printer_groups_reports'
  | 'hosts-network'
  | 'agentlogs'
  | 'userlogs'
  | 'hosts-local'
  | 'action_events'
  | 'printer_api_events'
  | 'alerts'
  | 'licenses'
  | 'regular_reports'
  | 'snmp'
  | 'floor'
  | 'oid'
  | 'blockedprinters'
  | 'label_policies'
  | 'hostgroups'
  | 'agent_policies'
  | 'copy_policies'
  | 'all_policies'
  | 'text_labels'
  | 'events'
  | 'integration'
  | 'reports'
  | 'report_by_printers'
  | 'report_by_group_users'
  | 'report_by_group_printers'

// type AsyncActionCreatorResult = ThunkAction<Promise<void>, IReduxState, IExtraArguments>;
// type AsyncActionCreator = ActionCreator<AsyncActionCreatorResult>;

export {
  IResource,
  Module,
  IReducerData,
  IModule,
  IEmptyAction,
  IAction,
  IExtraArguments,
  IReduxState,
  // AsyncActionCreator,
  // AsyncActionCreatorResult,
  IModuleLink,
  IModuleLinks,
  IFiltersResponse,
  IConfigResourse,
  IConfigDescription,
  IParam,
  IConfigHeaders,
  IConfigHeader,
  IConfigFilters,
  ICofigAggregate,
  IAggregate,
  IResourceStatus,
  Iicon,
  IresourcesTypes,
  TypesResources,
  IFilterHeader,
  ISource,
  IOperator,
  ITemplate,
  IReport,
  ISyncData,
  IIntegration,
//  IReports
};
