import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getFormValues, initialize} from 'redux-form';
import {bind} from 'decko';
import {block} from 'bem-cn';
import Table from './Table'

import injectResource from 'shared/helpers/injectResource';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {Modal} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import RemoveModal from 'shared/view/components/RemoveModal/index';
import {IconButton} from 'shared/view/elements';
import AddIcon from 'features/showResource/view/ShowResource/addIcon';

import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';

import {IAgregate} from 'modules/Users/namespace';

import {actions} from '../redux';
import EditSnmpConfigEntry from './EditSnmpConfigEntry';
import EditSnmpConfigItem from './EditSnmpConfigItem';
import './style.styl';

const resource = 'snmp_config';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  currentOperator: any;
  showSpinner: any;
  showModal: boolean;
  showRemoveModal: boolean;
  modalMode: 'edit' | 'create';
  data: any;
}

interface IDispatchProps {
  startEditEntry: typeof actions.startEditEntry;
  finishEditEntry: typeof actions.finishEditEntry;
  startCreateEntry: typeof actions.startCreateEntry;
  finishCreateEntry: typeof actions.finishCreateEntry;
  startDeleteEntry: typeof actions.startDeleteEntry;
  deleteEntry: typeof actions.deleteEntry;
  switchModalStatus: typeof actions.switchModalStatus;
  switchRemoveModal: typeof actions.switchRemoveModal;
  initialize: typeof initialize;
  getFormValues: typeof getFormValues;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig(resource, state),
    cofigAggregates: getAggregates(resource, state),
    headers: ShowResourceSelectors.getHeaders(state, resource),
    showSpinner: state.showResource.showSpinner,
    showModal: state.internal.showModal,
    showRemoveModal: state.internal.showRemoveModal,
    modalMode: state.internal.modalMode,
    data: typeof state.showResource[resource] !== 'undefined' ? state.showResource[resource].data : undefined,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    startEditEntry: injectResource(resource, actions.startEditEntry),
    finishEditEntry: injectResource(resource, actions.finishEditEntry),
    startCreateEntry: injectResource(resource, actions.startCreateEntry),
    finishCreateEntry: injectResource(resource, actions.finishCreateEntry),
    startDeleteEntry: injectResource(resource, actions.startDeleteEntry),
    deleteEntry: injectResource(resource, actions.deleteEntry),
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModal: actions.switchRemoveModal,
    initialize,
    getFormValues
  }, dispatch);
}

const b = block('snmp_config');

class SnmpConfig extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public state: any = {
    editedItem: {},
    entryIndex: -1,
    addMode: false,
  }

  public componentDidUpdate() {
    const { editedItem, entryIndex } = this.state;
    const { data = {0: []} } = this.props;
    if (typeof data[0] !== 'undefined') {
      data[0].forEach((d: any) => {
        if (d.name === editedItem.name) {
          this.setState({editedItem: d});
        }
      });
    }
  }

  public handleAddEntry = () => {
    this.setState({
      addMode: true,
      entryIndex: -1,
    });
  }

  public render() {
    const {
      configHeaders,
      headers,
      cofigAggregates,
      showModal,
      showSpinner,
      showRemoveModal,
      switchModalStatus,
      switchRemoveModal,
      deleteEntry,
      startCreateEntry,
      startEditEntry,
      initialize,
      modalMode
    } = this.props;

    const tableConfig: any = {
      emptyInfo: () => null,
      showHeaderCheckbox: () => false,
      showItemCheckbox: (item: any) => false,
      showControls: (item: any) => true,
      canDrag: (item: any) => false,
      canDrop: (item: any) => false,
      fields: [
        {
          name: 'type',
          header: 'type',
          style: { flex: '1 0 100px' }
        },
        {
          name: 'name',
          header: 'name',
          style: { flex: '1 0 100px' }
        },
        {
          name: 'oid',
          header: 'oid',
          style: { flex: '1 0 100px' }
        },
        {
          name: 'extraOid',
          header: 'extraOid',
          style: { flex: '1 0 100px' }
        },
        {
          name: 'actions',
          header: '',
          render: (item: any, entryIndex: number) => {
            return (
              <>
                <ActionFormatter
                  icon="pen"
                  onClick={() => {
                    this.setState({entryIndex});
                    initialize('editSnmpConfigEntry', item, true);
                  }}
                />
                <ActionFormatter icon="trash" onClick={() => {
                  const { finishEditEntry } = this.props;
                  this.setState({entryIndex: -1});
                  finishEditEntry(entryIndex, this.state.editedItem, true);
                }}/>
              </>
            );
          },
          style: { flex: '0 0 120px', justifyContent: 'flex-end' }
        },
      ],
    }

    const { entryIndex , addMode } = this.state;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          noDisplaySelect
          label="Внутренние настройки / Конфигурация SNMP"
        />
        <ShowResource
          onAdd={() => {
            this.setState({editedItem: {}, entryIndex: -1});
            startCreateEntry()
          }}
          resource={resource}
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
        <Modal
          isOpen={showModal}
          title="Детали записи"
          onClose={this.closeModal}
        >
          <div style={{ width: '900px' }}>
            {modalMode === 'edit' && !addMode && entryIndex === -1 && (
              <IconButton
                onClick={this.handleAddEntry}
                icon={<AddIcon/>}
                isPrimary
              />
            )}
            {modalMode === 'edit' && (entryIndex !== -1 || (entryIndex === -1 && addMode === true)) && (
              <EditSnmpConfigEntry
                onCancel={/*this.closeModal*/() => this.setState({entryIndex: -1, addMode: false})}
                onSave={this.onSaveForm}
              />
            )}
            {modalMode === 'create' && (
              <EditSnmpConfigItem
                onCancel={this.closeModal}
                onSave={this.onSaveForm}
              />
            )}
            {modalMode === 'edit' && (typeof this.state.editedItem.data !== 'undefined')
            && (
              <div style={{ maxHeight: '500px' }}>
                <Table
                  data={this.state.editedItem.data}
                  config={tableConfig}
                />
              </div>
            )}
          </div>
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage="Удаляем запись?"
          onRemove={deleteEntry}
          onClose={switchRemoveModal}
        />
      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { startEditEntry } = this.props;

    if (field === 'actions') {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div title="Переименовать">
            <ActionFormatter
              icon="pen"
              onClick={() => this.handleOpenRename(row)}
              id={row.id}
            />
          </div>
          <div title="Переименовать">
            <ActionFormatter
              icon="folder"
              onClick={() => this.handleOpenDetails(row)}
              id={row.id}
            />
          </div>
          <div title="Удалить">
            <ActionFormatter icon="trash" onClick={this.deleteRecord.bind(this, row)} id={row.id}/>
          </div>
        </div>
      );
    }
    return null;
  }

  @bind
  private handleOpenRename(row: any) {
    const { switchModalStatus, initialize } = this.props;
    switchModalStatus(true, 'create');
    initialize('editSnmpConfigItem', {name: row.name}, true);
    this.setState({ editedItem: row, editedEntry: -1 });
  }

  @bind
  private handleOpenDetails(row: any) {
    const { switchModalStatus } = this.props;
    switchModalStatus(true, 'edit');
    this.setState({ editedItem: row, editedEntry: -1 });
  }

  @bind
  private deleteRecord(row: any) {
    const { startDeleteEntry, switchRemoveModal } = this.props;
    startDeleteEntry(row.id);
    switchRemoveModal();
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {
    return row[field];
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus(false, '');
  }

  @bind
  private onSaveForm(): void {
    const { finishEditEntry, finishCreateEntry, modalMode } = this.props;
    const { entryIndex, editedItem, addMode } = this.state;

    if (modalMode === 'create') {
      if (Object.keys(editedItem).length) {
        finishCreateEntry(editedItem);
      }
      finishCreateEntry();
    } else {
      let targetIndex = entryIndex;
      if (addMode) {
        targetIndex = editedItem.data.length;
      }

      finishEditEntry(targetIndex, editedItem);
    }

    this.setState({entryIndex: -1, addMode: false});
  }
}
export { SnmpConfig };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(SnmpConfig);