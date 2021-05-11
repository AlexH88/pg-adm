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
import {AddRegularForm} from '../components';

import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import injectResource from 'shared/helpers/injectResource';

import './style.styl';
import Icon from "../../../../shared/view/elements/Icon/index";
import RemoveModal from "../../../../shared/view/components/RemoveModal/index";

interface IDispatchProps {
  switchReportModal: typeof actions.switchReportModal;
	deleteReport: typeof actions.deleteReport;
  switchRegularModal: typeof actions.switchRegularModal;
  startSaveRegularForm: typeof actions.startSaveRegularForm;
  sendRegularForm: typeof actions.sendRegularForm;
  changeTableHeaders: typeof ShowResourceActions.changeHeader;
  switchRemoveModal: typeof actions.switchRemoveModal;
  acceptDelete: typeof actions.acceptDelete;
	setEditReport: typeof actions.setEditReport;
}

interface IStateProps {
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  showReportModal: boolean;
  showRegularModal: boolean;
  showRemoveModal: boolean;
  currentOperator: any;
}

type Props = IDispatchProps & IStateProps;

function mapState(state: IReduxState): IStateProps {
  const { showReportModal, showRegularModal, showRemoveModal } = state.userReports;
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    headers: ShowResourceSelectors.getHeaders(state, 'regular_reports'),
    configHeaders: getHeadersConfig('regular_reports', state),
    showReportModal, showRegularModal, showRemoveModal
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchReportModal: actions.switchReportModal,
    switchRemoveModal: actions.switchRemoveModal,
    switchRegularModal: actions.switchRegularModal,
		setEditReport: actions.setEditReport,
    sendRegularForm: injectResource('regular_reports', actions.sendRegularForm),
    acceptDelete: actions.acceptDelete,
    changeTableHeaders: injectResource('regular_reports', ShowResourceActions.changeHeader),
    startSaveRegularForm: injectResource('regular_reports', actions.startSaveRegularForm),
		deleteReport: injectResource('regular_reports', actions.deleteReport),
  }, dispatch);
}

class SaveReports extends React.PureComponent<Props, {}> {

  private b = block('rules');

  public render() {
    const b = this.b;
    const { configHeaders, headers, switchRemoveModal, /*switchReportModal, showReportModal,*/ switchRegularModal } = this.props;
    const { showRegularModal, showRemoveModal, sendRegularForm, acceptDelete } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          filterDisabledValidator={this.filterDisabledValidator}
          resource="regular_reports"
          changeHeaderByFilter={this.changeHeaderByFilter}
          label="Отчеты > Регулярные отчеты"
        />
        <ShowResource
          resource="regular_reports"
          headers={headers}
          configs={{/*{
            sort: {
              by: 'name',
              order: 'asc',
            },
          }*/}}
					headersFormatter={this.fieldFormatter}
          actionsFormatter={this.actionsFormatter}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showRegularModal}
          title="Редактирование отчета"
          onClose={switchRegularModal}
        >
        // @ts-ignore
          <AddRegularForm
            type="regular_reports"
            data="regular_reports"
            labelName="Пользователи"
            onCancel={switchRegularModal}
            onSave={sendRegularForm.bind(null, "regular_reports")}
          />
        </Modal>
        <RemoveModal
            isOpen={showRemoveModal}
            alertMessage="Отчет будет удален! Продолжить ?"
            onClose={switchRemoveModal}
            onRemove={acceptDelete}
        />
      </div>
    );
  }

  @bind
  private actionsFormatter(field: string, row: any): JSX.Element | null {
    if (field === 'actions') {
      return (
          <div>
            <Icon key={row.id} icon="trash" onClick={this.tryDeleteReport.bind(this, row.id)}/>
            {/*<Icon icon="pen" onClick={this.onEditReport.bind(this, row)}/>*/}
          </div>
      );
    }
    return null;
  }

  @bind
	private fieldFormatter(field: string, row: any): any {
		if (field === 'type') {
			return ({
				'printers': 'Принтеры',
				'printer_groups': 'Группы принтеров',
				'users': 'Пользователи',
        'user_groups': 'Группы пользователей',
        'user_timereports': 'Динамический по пользователям',
        'printer_timereports': 'Динамический по принтерам',
        'user_groups_timereports': 'Динамический по группам пользователей',
        'printer_groups_reports': 'Динамический по группам принтеров'
			} as any)[row[field]];
		}

		if (field === 'period') {
			return ({
				'year': 'Год',
				'day': 'День',
				'week': 'Неделя',
			} as any)[row[field]];
		}

		return row[field];
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
	private tryDeleteReport(id: number) {
		const { switchRemoveModal, deleteReport } = this.props;
		switchRemoveModal();
		deleteReport(id);
	}

	// @bind
	// private onEditReport(row: any) {
	// 	const { setEditReport } = this.props;
	// 	console.log(row);
	// 	setEditReport(row);
	// }

}

export { SaveReports };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(SaveReports);
