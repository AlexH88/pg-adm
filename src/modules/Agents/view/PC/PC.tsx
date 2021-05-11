import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {actions} from '../../redux';
import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import {Button, Icon} from 'shared/view/elements';
import {Modal, RemoveModal} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {generateIdElement} from 'shared/helpers';
import './style.styl';
import i18next from "i18next";

const resource = 'hosts-local';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  showModal: boolean;
  showSyncModal: boolean;
  currentOperator: any;
  showRemoveModal: boolean;
  showLogModal: boolean;
  logPrinterId: any;
  deleteAgentId: number;
}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof actions.editResource;
  switchModalStatus: typeof actions.switchModalStatus;
  saveEditPrinter: typeof actions.saveEditPrinter;
  switchSyncModal: typeof actions.switchSyncModal;
  setEditPrintServerData: typeof actions.setEditPrintServerData;
  syncPrintServersData: typeof actions.syncPrintServersData;
  startDeletePrinterGroup: typeof actions.startDeletePrinterGroup;
  deletePrinterGroup: typeof actions.acceptDeleteResource;
  switchRemoveModalStatus: typeof actions.switchRemoveModal,
  startDeleteAgent: typeof actions.startDeleteAgent,
  deleteAgent: typeof actions.deleteAgent,
  startLog: typeof actions.startLog,
  executeLog: typeof actions.executeLog,
  switchLogModal: typeof actions.switchLogModal
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
    deleteAgentId: state.agents.deleteAgentId,
    showLogModal: state.agents.showLogModal,
    logPrinterId: state.agents.logPrinterId
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
    syncPrintServersData: injectResource(resource, actions.syncPrintServersData),
    deletePrinterGroup: injectResource(resource, actions.acceptDeleteResource),
    startDeletePrinterGroup: injectResource(resource, actions.startDeletePrinterGroup),
    switchRemoveModalStatus: actions.switchRemoveModal,
    deleteAgent: injectResource(resource, actions.deleteAgent),
    startDeleteAgent: injectResource(resource, actions.startDeleteAgent),
    startLog: actions.startLog,
    executeLog: actions.executeLog,
    switchLogModal: actions.switchLogModal
  }, dispatch);
}

const b = block('printservers');
const b2 = block('edit-printer');

class PC extends React.PureComponent<IDispatchProps & IStateProps, {}> {

  public componentWillMount() {

  }

  public render() {
    const {
      configHeaders,
      headers,
      cofigAggregates,
      showRemoveModal,
      switchRemoveModalStatus,
      showLogModal,
      switchLogModal,
      executeLog,
      logPrinterId
    } = this.props;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="hosts-local"
          label={i18next.t('PC.pcHeader')}
        />
        <ShowResource
          resource="hosts-local"
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
        <Modal
          isOpen={showLogModal}
          title={`${i18next.t('PC.switchLog')} ${logPrinterId.name}`}
          onClose={switchLogModal}
        >
          <div className={b2('footer')}>
            <Button
              label={i18next.t('PC.cancel')}
              onClick={switchLogModal}
            />
            <Button
              label={i18next.t('PC.isPrimary')}
              isPrimary
              onClick={executeLog}
            />
          </div>
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('PC.removeAgent')}
          onClose={switchRemoveModalStatus}
          onRemove={this.onAcceptDeleteAgent}
        />
        <ShowUserGroups />
      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource & any): JSX.Element | null  {
    const { onPrinterGroupsEdit } = this.props;
    if (field === 'actions') {
      return (
        <div style={{display: 'flex', alignItems: 'center'}}>
          {
            row.status
              ? null
              : <span className={b('circle', { blue: true })} />
          }
          {
            row.active
              ? <span className={b('circle', { green: true })} />
              : <span className={b('circle', { red: true })} />
          }
          <ActionFormatter icon="folder" onClick={onPrinterGroupsEdit} id={row.id} title="Группы" idHash={`hosts-local-folder-${generateIdElement()}`}/>

          <ActionFormatter icon="pen" onClick={this.startForceLog.bind(this, {id: row.id, name: row.name})} id={row.id} title="Редактировать" idHash={`hosts-local-pen-${generateIdElement()}`}/>

          <Icon icon="trash" onClick={this.onDelete.bind(this, row.id)} title="Удалить" idHash={`hosts-local-trash-${generateIdElement()}`}/>
        </div>
      );
    }
    return null;
  }

  @bind
  startForceLog(id: number) {
    const { startLog } = this.props;
    startLog(id);
  }

  @bind
  private onDelete(id: number) {
    const { startDeleteAgent, switchRemoveModalStatus } = this.props;
    startDeleteAgent(id);
    switchRemoveModalStatus();
  }

  @bind
  private onAcceptDeleteAgent() {
    const { deleteAgent } = this.props;
    deleteAgent();
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {
    if (field === 'is_followme') {
      if (row[field]) {
        return <div className={b('circle', { red: true })} />;
      } else {
        return <div className={b('circle', { green: true })} />;
      }
    }

    if (field === 'name') {
      return `${row.name}`;
    }

    if (field === 'ip') {
      return row.ip.replace(/:.*:/ig, '');
    }

    if (field === 'groups') {
      return row[field].map((group: any) => group.name).join(', ');
    }

    return row[field];
  }

}
export { PC };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(PC);
