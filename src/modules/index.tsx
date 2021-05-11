import {UsersModule} from './Users';
import {JournalModule} from './Journal';
import {PrintersModule} from './Printers';
import {PolicyModule} from './Policy';
import {SettingsModule} from './Settings';
import {UserReportsModule} from './UserReports';
import {LoginModule} from './Login';
import {EventsModule} from './Events';
import {AgentsModule} from './Agents';
import {StatusModule} from './Status';
import {SnmpModule} from './Snmp';
import {InternalModule} from './Internal';
import {ReportModule} from './Report';
import { IntegrationModule } from './Integration';

const modulesLinks = [
  { ...StatusModule.configs },
  { ...UsersModule.configs },
  { ...AgentsModule.configs },
  { ...PrintersModule.configs },
  { ...SnmpModule.configs },
  { ...PolicyModule.configs },
  { ...JournalModule.configs },
  { ...UserReportsModule.configs },
  { ...EventsModule.configs },
  { ...SettingsModule.configs },
  { ...LoginModule.configs },
  { ...InternalModule.configs },
  { ...IntegrationModule.configs },
  { ...ReportModule.configs }
];

export {
  UserReportsModule,
  PolicyModule,
  EventsModule,
  UsersModule,
  PrintersModule,
  SnmpModule,
  SettingsModule,
  JournalModule,
  LoginModule,
  AgentsModule,
  InternalModule,
  modulesLinks,
  IntegrationModule,
  ReportModule
};
