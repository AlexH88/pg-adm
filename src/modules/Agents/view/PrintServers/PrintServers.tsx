import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {actions} from '../../redux';
import {SyncResource} from 'features/syncResource';
import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import {RemoveModal} from 'shared/view/components';
import {generateIdElement} from 'shared/helpers';
import './style.styl';
import i18next from "i18next";

const resource = 'hosts-network';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  chosenHostId: number;
  showModal: boolean;
  showSyncModal: boolean;
  currentOperator: any;
  showRemoveModal: boolean;
}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof actions.editResource;
  switchModalStatus: typeof actions.switchModalStatus;
  saveEditPrinter: typeof actions.saveEditPrinter;
  switchSyncModal: typeof actions.switchSyncModal;
  setEditPrintServerData: typeof actions.setEditPrintServerData;
  setChosenHostId: typeof actions.setChosenHostId;
  syncPrintServersData: typeof actions.syncPrintServersData;
  startDeleteAgent: typeof actions.startDeleteAgent;
  deleteAgent: typeof actions.deleteAgent;
  switchRemoveModal: typeof actions.switchRemoveModal;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig(resource, state),
    cofigAggregates: getAggregates(resource, state),
    headers: ShowResourceSelectors.getHeaders(state, resource),
    showModal: state.agents.showModal,
    showSyncModal: state.agents.showSyncModal,
    showRemoveModal: state.agents.showRemoveModal,
    chosenHostId: state.agents.chosenHostId
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    onPrinterGroupsEdit: injectResource(resource, editUserGroups.actions.groupsEdit),
    editPrinter: injectResource(resource, actions.editResource),
    switchModalStatus: actions.switchModalStatus,
    saveEditPrinter: injectResource(resource, actions.saveEditPrinter),
    switchSyncModal: injectResource(resource, actions.switchSyncModal),
    setEditPrintServerData: injectResource(resource, actions.setEditPrintServerData),
    setChosenHostId: injectResource(resource, actions.setChosenHostId),
    syncPrintServersData: injectResource(resource, actions.syncPrintServersData),
    startDeleteAgent: actions.startDeleteAgent,
    deleteAgent: actions.deleteAgent,
    switchRemoveModal: actions.switchRemoveModal,
  }, dispatch);
}

const b = block('printservers');

class Printers extends React.PureComponent<IDispatchProps & IStateProps, { dialogTitle: string }> {

  state = {
    dialogTitle: ''
  }

  public render() {
    const {
      configHeaders,
      headers,
      cofigAggregates,
      switchSyncModal,
      showSyncModal,
      showRemoveModal,
      deleteAgent,
      switchRemoveModal,
      syncPrintServersData
    } = this.props;

    const { dialogTitle } = this.state;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          label={i18next.t('PrintServers.printServerHeader')}
          noDisplaySelect
        />
        <ShowResource
          resource={resource}
          headers={headers}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          aggregateStats={cofigAggregates}
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderNamesFormatter}
          configHeadersTable={configHeaders}
        />
        <SyncResource
          modalTitle={`${i18next.t('PrintServers.syncPrintServer')} ${dialogTitle}`}
          showModal={showSyncModal}
          switchModalVisible={switchSyncModal}
          resource={resource}
          onSave={() => syncPrintServersData()}
          onCancel={switchSyncModal}
        />
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('PrintServers.deleteAgent')}
          onRemove={deleteAgent}
          onClose={switchRemoveModal}
        />
        <ShowUserGroups />
      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource & any): JSX.Element | null  {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {
            row.active
              ?
              <span className={b('circle', { green: true })} id={`green-${generateIdElement()}`}/>
              :
              <span className={b('circle', { red: true })} id={`red-${generateIdElement()}`}/>
          }
          {
            currentOperator['hosts.sync'] ?
            (
              row.active
             ?
            <ActionFormatter icon="sync" onClick={this.switchVisibleSyncModal.bind(this, row)} id={row.id} title="Синхронизировать" idHash={`printserver-sync-${generateIdElement()}`}/>
              :
            <ActionFormatter icon="sync_off" />
            ) : null
          }
          { !row.active ?
            <ActionFormatter icon="trash" onClick={this.deleteRecord.bind(this, row)} id={row.id} title="Удалить" idHash={`printserver-trash-${generateIdElement()}`}/>
            :
            <ActionFormatter icon="trash_off" idHash={`printserver-trash_off-${generateIdElement()}`}/>
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private deleteRecord(row: any) {
    const { startDeleteAgent, switchRemoveModal } = this.props;
    startDeleteAgent(row.id);
    switchRemoveModal();
  }

  @bind
  private switchVisibleSyncModal(row? : IResource): void {
    const {
      setEditPrintServerData,
      setChosenHostId
    } = this.props;

    setChosenHostId(row ? row.id : -1);

    this.setState({
      dialogTitle: (row && row.name)
    });

    setEditPrintServerData(row ? row.id : -1);
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {

    if (field === 'is_followme') {
      if (row[field]) {
        return <div className={b('circle', { red: true })} id={`red-${generateIdElement()}`}/>;
      } else {
        return <div className={b('circle', { green: true })} id={`green-${generateIdElement()}`}/>;
      }
    }

    if (field === 'name') {
      return `${row.name}`;
    }

    if (field === 'ip') {
      return row.ip.replace(/:.*:/ig, '');
    }

    return row[field];
  }
}
export { Printers };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Printers);
