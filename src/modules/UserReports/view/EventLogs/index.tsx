import * as React from 'react';
import {block} from 'bem-cn';

import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IFilterHeader, IReduxState} from 'shared/types/app';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {actions as ShowResourceActions, selectors as ShowResourceSelectors} from 'features/showResource';
import {actions} from '../../redux';
import {getHeadersConfig} from 'shared/helpers/getConfig';
import {formatDateTime} from 'shared/helpers/formatData';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import injectResource from 'shared/helpers/injectResource';
import {IResource} from 'shared/types/app';

import './style.styl';
import {address} from 'shared/api/HttpActions';
// import { Modal } from 'shared/view/components';
// import { ControlButtons, AddReportForm, AddRegularForm } from '../components';
// import { AutocompleteFilter } from 'shared/view/components';
// import ProgressBar from 'react-toolbox/lib/progress_bar';
import i18next from "i18next";

interface IDispatchProps {
  switchPdfModal: typeof actions.switchPdfModal;
  switchReportModal: typeof actions.switchReportModal;
  switchRegularModal: typeof actions.switchRegularModal;
  startSaveRegularForm: typeof actions.startSaveRegularForm;
  sendRegularForm: typeof actions.sendRegularForm;
  startSaveReportForm: typeof actions.startSaveReportForm;
  sendReportForm: typeof actions.sendReportForm;
  changeTableHeaders: typeof ShowResourceActions.changeHeader;
}

interface IStateProps {
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  showReportModal: boolean;
  showRegularModal: boolean;
  showPdfModal: boolean;
  showReportSpinner: boolean;
  pdfData: any;
  currentOperator: any;
}

type Props = IDispatchProps & IStateProps;

function mapState(state: IReduxState): IStateProps {
  const { showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner } = state.userReports;
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'user_reports'),
    configHeaders: getHeadersConfig('user_reports', state),
    showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
    return bindActionCreators({
        switchReportModal: actions.switchReportModal,
        switchPdfModal: actions.switchPdfModal,
        switchRegularModal: actions.switchRegularModal,
        sendRegularForm: injectResource('user_reports', actions.sendRegularForm),
        startSaveReportForm: actions.startSaveReportForm,
        sendReportForm: injectResource('user_reports', actions.sendReportForm),
        changeTableHeaders: injectResource('user_reports', ShowResourceActions.changeHeader),
        startSaveRegularForm: injectResource('user_reports', actions.startSaveRegularForm)
    }, dispatch);
}

class EventLogs extends React.PureComponent<Props, {}> {

  private b = block('rules');

  public render() {
    const b = this.b;
    const { configHeaders, headers, switchReportModal, showReportModal, showPdfModal, switchRegularModal, pdfData,
                                                                                       showReportSpinner } = this.props;
    // const { showRegularModal, startSaveRegularForm, sendRegularForm, sendReportForm, switchPdfModal,
    //                                                                                 currentOperator = {} } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          // configs={configHeaders}
          configs={{}}
          filterDisabledValidator={this.filterDisabledValidator}
          resource="events"
          changeHeaderByFilter={this.changeHeaderByFilter}
          label="События > Администратор"
          search={true}
        />
        <ShowResource
          resource="events"
          headers={headers}
          configs={{
            sort: {
              by: 'date',
              order: 'asc',
            },
          }}
          headersFormatter={this.renderFormatter}
          configHeadersTable={configHeaders}
        />
        {/* <Modal
          isOpen={showReportModal}
          title="Сформировать отчет"
          onClose={switchReportModal}
        >
        {
          showReportSpinner ?
          <ProgressBar />
          :
          // @ts-ignore
          <AddReportForm
            labelName="Количество пользователей"
            onCancel={switchReportModal}
            onSave={sendReportForm.bind(null, "user_reports")}
          />
        }
        </Modal>
        <Modal
          isOpen={showPdfModal}
          title="Отчет PDF"
          onClose={switchPdfModal}
        >
          <br/>
          <a onClick={this.openReport} className={b('link')} type="application/pdf" href={pdfData}>Открыть</a>
        </Modal>
        <Modal
          isOpen={showRegularModal}
          title="Сохранить в регулярные"
          onClose={switchRegularModal}
        >
        // @ts-ignore
          <AddRegularForm
            type="users"
            data="event_logs"
            labelName="Пользователи"
            onCancel={switchRegularModal}
            onSave={sendRegularForm.bind(null, "event_logs")}
          />
        </Modal> */}
        {/* {
          currentOperator['reports.pdf'] ?
          <ControlButtons
            onClickReport={switchReportModal}
            onClickRegular={startSaveRegularForm}
          />
            :
          <ControlButtons
            onClickRegular={startSaveRegularForm}
          />
        } */}
      </div>
    );
  }

  @bind
  private openReport(event: any) {
      const { pdfData } = this.props;
      event.preventDefault();
      window.open(`${address}/api/report.pdf/${pdfData}`);
      this.props.switchPdfModal();
  }

  @bind
  private filterDisabledValidator(headers: IFilterHeader[]): string[] {
    const disabledHeaders = [];
    const printerHeader = headers.find(header => header.name === 'printer');
    const printerGroupHeader = headers.find(header => header.name === 'printergroup');
    if (printerGroupHeader && printerHeader && printerHeader.isConnected) {
      disabledHeaders.push(printerGroupHeader.name);
    }
    if (printerGroupHeader && printerHeader && printerGroupHeader.isConnected) {
      disabledHeaders.push(printerHeader.name);
    }
    return disabledHeaders;
  }

  @bind
  private changeHeaderByFilter(activeHeader: string) {
    const { changeTableHeaders } = this.props;
    const headers = ['price', 'job', 'pages'];
    if (headers.includes(activeHeader)) {
      headers.forEach(header => changeTableHeaders(header, false));
      changeTableHeaders(activeHeader, true);
    }
  }

  @bind
  private renderFormatter(field: any, row: IResource & any) {
    if (field === 'date' && row[field]) {
        return formatDateTime(row[field])
    }
    return row[field];
  }

  // @bind
  // private saveReport() {
  //     const { switchReportModal } = this.props;
  //     switchReportModal();
  //     if (!1) console.log(this);
  // }

}

export { EventLogs };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(EventLogs);
