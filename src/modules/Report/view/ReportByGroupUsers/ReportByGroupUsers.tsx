import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {Modal} from 'shared/view/components';
import {IReduxState, IResource, IConfigHeaders} from 'shared/types/app';
import ReportReceiptForm from '../ReportReceiptForm/ReportReceiptForm';
import {IMode, IAgregate} from '../../namespace';
import FilterResource from "features/filterResource/view/FilterResource/FilterResource";
import { ShowResource } from 'features/showResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import i18next from "i18next";

const resource = 'report_by_group_users';

interface IStateProps {
  showModal: boolean;
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  configAggregates: IAgregate[];
  currentOperator: any;
  settings: any;
  isEmptyReport: boolean;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  downloadReport: typeof actions.downloadReport;
  clearSettings: typeof actions.clearSettings;
//  saveChangesOperatorsResource: typeof actions.saveChangesOperatorsResource;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  const settings: any = state.report.settings || null;
  let isEmptyReport = false;

  if(state.showResource.hasOwnProperty('report_by_group_users')){
    if(state.showResource.report_by_group_users.hasOwnProperty('data')){
      if(state.showResource.report_by_group_users.data.hasOwnProperty('0')){
        if(state.showResource.report_by_group_users.data[0].length > 0){
          isEmptyReport = true
        }
      }
    }
  }

  return {
    showModal: state.report.showModal,
    headers: ShowResourceSelectors.getHeaders(state, resource),
    configHeaders: getHeadersConfig(resource, state),
    configAggregates: getAggregates(resource, state),
    currentOperator: currentOperator.access_rules,
    settings: settings,
    isEmptyReport: isEmptyReport,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: injectResource('report_by_group_users', actions.switchModalStatus),
    downloadReport: injectResource('report_by_group_users', actions.downloadReport),
    clearSettings: injectResource('reports', actions.clearSettings),
  }, dispatch);
}

class ReportByGroupUsers extends React.PureComponent<IStateProps & IDispatchProps, {}> {

  private b = block('report');

  componentWillUnmount() {
    const { clearSettings } = this.props;
    clearSettings();
    localStorage.removeItem('reportDate');
  }

  public render() {
    const b = this.b;
    const { showModal, headers, configHeaders, configAggregates, settings, isEmptyReport } = this.props;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          label='Отчет по группам пользователей'
          showSettings={this.openModal}
        />

        <ShowResource
          resource={resource}
          headers={headers}
          configs={{
            sort: {
              by: 'id',
              order: 'desc',
            },
          }}
//          aggregateStats={configAggregates}
//          headersFormatter={this.renderLoginsFormatter}
          configHeadersTable={configHeaders}
          onReport={this.onDownloadReport}
          donwloadDisabled={settings && isEmptyReport ? true : false}
        />

        <Modal
          isOpen={showModal}
          title={i18next.t('Report.parametrsReport')}
          onClose={this.closeModal}
        >
          <ReportReceiptForm
            onCancel={this.closeModal}
            typeReport='USER_GROUP'
          />
        </Modal>

      </div>
    );
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: '' });
  }

  @bind
  private onDownloadReport(): void {
    const { downloadReport } = this.props;
    downloadReport();
  }

};

export { ReportByGroupUsers };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(ReportByGroupUsers);
