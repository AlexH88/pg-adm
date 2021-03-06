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
import {Modal} from 'shared/view/components';
import {AddRegularForm, AddReportForm, ControlButtons} from '../components';

import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import injectResource from 'shared/helpers/injectResource';

import './style.styl';
import {address} from 'shared/api/HttpActions';
import ProgressBar from 'react-toolbox/lib/progress_bar';

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
  showReportSpinner: boolean;
  showPdfModal: boolean;
  pdfData: any;
  currentOperator: any;
}

type Props = IDispatchProps & IStateProps;

function mapState(state: IReduxState): IStateProps {
  const { showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner } = state.userReports;
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'printer_groups_reports'),
    configHeaders: getHeadersConfig('printer_groups_reports', state),
    showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchReportModal: actions.switchReportModal,
    switchPdfModal: actions.switchPdfModal,
    switchRegularModal: actions.switchRegularModal,
    sendRegularForm: injectResource('printer_groups_reports', actions.sendRegularForm),
    startSaveReportForm: actions.startSaveReportForm,
    sendReportForm: injectResource('printer_groups_reports', actions.sendReportForm),
    changeTableHeaders: injectResource('printer_groups_reports', ShowResourceActions.changeHeader),
    startSaveRegularForm: injectResource('printer_groups_reports', actions.startSaveRegularForm)
  }, dispatch);
}

class PrinterGroupsTotalStats extends React.PureComponent<Props, {}> {

  private b = block('rules');

  public render() {
    const b = this.b;
    const { configHeaders, headers, switchReportModal, showReportModal, showPdfModal, switchRegularModal, pdfData, showReportSpinner } = this.props;
    const { showRegularModal, startSaveRegularForm, sendRegularForm, sendReportForm, switchPdfModal, currentOperator = {} } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          filterDisabledValidator={this.filterDisabledValidator}
          resource="printer_groups_reports"
          changeHeaderByFilter={this.changeHeaderByFilter}
          label="???????????? > ?????????????????????? > ???? ?????????????? ??????????????????"
        />
        <ShowResource
          resource="printer_groups_reports"
          headers={headers}
          configs={{/*{
            sort: {
              by: 'name',
              order: 'asc',
            },
          }*/}}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showReportModal}
          title="???????????????????????? ??????????"
          onClose={switchReportModal}
        >
        {
          showReportSpinner ?
          <ProgressBar />
          :
          // @ts-ignore
          <AddReportForm
            labelName="???????????????????? ?????????? ??????????????????"
            onCancel={switchReportModal}
            onSave={sendReportForm.bind(null, "printer_groups_reports")}
          />
        }
        </Modal>
        <Modal
            isOpen={showPdfModal}
            title="?????????? PDF"
            onClose={switchPdfModal}
        >
          <br/>
          <a onClick={this.openReport} className={b('link')} type="application/pdf" href={pdfData}>??????????????</a>
        </Modal>
        <Modal
          isOpen={showRegularModal}
          title="?????????????????? ?? ????????????????????"
          onClose={switchRegularModal}
        >
        // @ts-ignore
          <AddRegularForm
            type="printer_groups"
            data="printer_groups_reports"
            labelName="???????????? ??????????????????"
            onCancel={switchRegularModal}
            onSave={sendRegularForm.bind(null, "printer_groups_reports")}
          />
        </Modal>
        {
          currentOperator['reports.pdf'] ?
            <ControlButtons
              onClickReport={switchReportModal}
              onClickRegular={startSaveRegularForm}
            />
            :
            <ControlButtons
              onClickRegular={startSaveRegularForm}
            />
        }
      </div>
    );
  }

  @bind
  private openReport(event : any) {
    const { pdfData } = this.props;
    event.preventDefault();
    window.open(`${address}/api/report.pdf/${pdfData}`);
    this.props.switchPdfModal();
  }

  @bind
  private filterDisabledValidator(headers: IFilterHeader[]): string[] {
    const disabledHeaders = [];
    const printerHeader = headers.find(header => header.name === 'user');
    const printerGroupHeader = headers.find(header => header.name === 'usergroup');
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

};

export { PrinterGroupsTotalStats };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(PrinterGroupsTotalStats);
