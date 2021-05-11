import {IReduxState, IResourceReduxState} from '../../namespace';
import {dynamicResource as userDynamicReports} from 'modules/UserReports/view/UserDynamicReports';
import {dynamicResource as userGroupsDynamicReports} from 'modules/UserReports/view/UserGroupsDynamicReports';
import {dynamicResource as printerDynamicReports} from 'modules/UserReports/view/PrintersDynamicReports';
import {dynamicResource as printerGroupsDynamicReports} from 'modules/UserReports/view/PrinterGroupsDynamicReports';

const initialResource: IResourceReduxState = {
  headers: [],
  filters: [],
  filterConfigs: {},
  filterOptions: {}
};

const initialState: IReduxState = {
  [userDynamicReports]: initialResource,
  [userGroupsDynamicReports]: initialResource,
  [printerDynamicReports]: initialResource,
  [printerGroupsDynamicReports]: initialResource,
};

export { initialState, initialResource };
