import {IInjectedResource} from 'shared/helpers/injectResource';
import {IMode} from './index';

interface IChangeModalStatusPayload {
  status: boolean;
  mode: IMode;
}

interface ISwitchModalStatusAction extends IInjectedResource {
  type: 'REPORT_MODULE:SWITCH_MODAL_STATUS';
}

interface ISwitchSaveModal extends IInjectedResource {
  type: 'REPORT_MODULE:SWITCH_SAVE_MODAL';
}

interface IDownloadReport extends IInjectedResource {
  type: 'REPORT_MODULE:DOWNLOAD_REPORT';
}

interface ISetSettingsReport extends IInjectedResource {
  type: 'REPORT_MODULE:SET_SETTINGS_REPORT';
}

interface IClearSettings extends IInjectedResource {
  type: 'REPORT_MODULE:CLEAR_SETTINGS';
}


type SettingsModuleActions = (
    ISwitchSaveModal
  | ISwitchModalStatusAction
  | IDownloadReport
  | ISetSettingsReport
  | IClearSettings
  );

export {
  ISwitchSaveModal,
  ISwitchModalStatusAction,
  IDownloadReport,
  IChangeModalStatusPayload,
  ISetSettingsReport,
  IClearSettings
}
