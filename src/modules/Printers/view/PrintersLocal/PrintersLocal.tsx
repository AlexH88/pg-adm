import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import EditPrinterForm from '../Printers/EditPrinterForm/EditPrinterForm';
import {actions} from '../../redux';
import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import {Modal} from 'shared/view/components';
import {generateIdElement} from 'shared/helpers';
import './style.styl';
import * as circularTheme from '../../../../shared/view/components/Table/circularTheme.styl'
import ProgressBar from "react-toolbox/lib/progress_bar";
import i18next from "i18next";

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  showModal: boolean;
  showSyncModal: boolean;
  currentOperator: any;
  showSpinner: any;
}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof actions.editResource;
  switchModalStatus: typeof actions.switchModalStatus;
  saveEditPrinter: typeof actions.saveEditPrinter;
  switchSyncModal: typeof actions.switchSyncModal;
  setEditPrintServerData: typeof actions.setEditPrintServerData;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig('printers-local', state),
    cofigAggregates: getAggregates('printers-local', state),
    headers: ShowResourceSelectors.getHeaders(state, 'printers-local'),
    showModal: state.printers.showModal,
    showSyncModal: state.printers.showSyncModal,
    showSpinner: state.showResource.showSpinner,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    onPrinterGroupsEdit: injectResource('printers-local', editUserGroups.actions.groupsEdit),
    editPrinter: injectResource('printers-local', actions.editResource),
    switchModalStatus: actions.switchModalStatus,
    saveEditPrinter: injectResource('printers-local', actions.saveEditPrinter),
    switchSyncModal: injectResource('printers-local', actions.switchSyncModal),
    setEditPrintServerData: injectResource('printers-local', actions.setEditPrintServerData)
  }, dispatch);
}

const b = block('printers');

class PrintersLocal extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    const { configHeaders, headers, cofigAggregates, showModal, showSyncModal, showSpinner } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="printers-local"
          label={ i18next.t('printersLocal.labelHeader')}
        />
        <ShowResource
          resource="printers-local"
          headers={headers}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          aggregateStats={cofigAggregates}
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderNamesFormatter}
          configHeadersTable={configHeaders}
        />
        <ShowUserGroups />
        <Modal
          isOpen={showModal}
          title={i18next.t('printersLocal.settings')}
          onClose={this.closeModal}
        >
          {
            showSpinner ?
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <ProgressBar theme={circularTheme} type="circular" mode="indeterminate"/>
              </div>
              :
            <EditPrinterForm
              onCancel={this.closeModal}
              onSave={this.onSaveForm}
            />
          }
        </Modal>

        <ShowUserGroups />
      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { onPrinterGroupsEdit, editPrinter/*, switchSyncModal*/ } = this.props;
    let { currentOperator } = this.props;
    currentOperator = currentOperator || {};

    if (field === 'actions') {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {
            row.active
              ?
              <span className={b('circle', { green: true })} />
              :
              <span className={b('circle', { red: true })} />
          }
          {
            currentOperator['printers.membersip']
              ?
            <ActionFormatter icon="folder" onClick={onPrinterGroupsEdit} id={row.id} title="Группы" idHash={`printerslocal-folder-${generateIdElement()}`}/>
              :
              null
          }
          {
            currentOperator['printers.put']
              ?
            <ActionFormatter icon="pen" onClick={editPrinter} id={row.id} title="Редактирвать" idHash={`printerslocal-pen-${generateIdElement()}`}/>
              :
              null
          }
          {/*<ActionFormatter icon="sync" onClick={switchSyncModal} id={row.id}/>*/}
        </div>
      );
    }
    return null;
  }

  @bind
  private switchVisibleSyncModal(): void {
    this.props.switchSyncModal();
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {
    function formatCurrencyForTable(currencyValue: string) { // TODO to utils
      return `${Number(currencyValue) / 100}`;
    }
    if (field === 'name') {
      return `${row.host.name}/${row.name}`;
    }
    if (field === 'price' || field === 'a3Price' || field === 'a4Price' || field === 'a5Price') {
      return formatCurrencyForTable(row[field]);
    }
    if (field === 'mac') {
      return row.host.mac;
    }
    return row[field];
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus(false);
  }

  @bind
  private onSaveForm(): void {
    const { saveEditPrinter } = this.props;
    saveEditPrinter();
    // this.props.switchModalStatus(false);
  }
}
export { PrintersLocal };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(PrintersLocal);
