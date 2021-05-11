import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {Modal, RemoveModal} from 'shared/view/components';
import Switch from 'react-toolbox/lib/switch';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import injectResource from 'shared/helpers/injectResource';
import {ICatalog} from 'shared/types/catalog';
import {actions} from '../../redux';
import {IAgregate, IMode} from '../../namespace';
import AddCatalogForm from './AddCatalogForm';
import './Catalogs.styl';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {actions as showResourceActions} from '../../../../features/showResource/redux';
import theme from './theme.styl';

interface IDispatchProps {
  createCatalog: typeof actions.createResource;
  editCatalog: typeof actions.editResource;
  deleteCatalog: typeof actions.deleteResource;
  saveEditCatalog: typeof actions.saveEditResource;
  switchModalStatus: typeof actions.switchModalStatus;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModalStatus: typeof actions.switchRemoveModalStatus;
  changeCatalogFormField: typeof actions.changeCatalogFormField;
  testConnentClear: typeof actions.testConnentClear;
  loadCurrentOperator: typeof showResourceActions.loadCurrentOperator;
  disableCatalog: typeof actions.disableCatalog;
  enableCatalog: typeof actions.enableCatalog;
  testCatalogConnection: typeof actions.testCatalogConnection;
}

interface IStateProps {
  choosenCatalogEditName: string;
  showModal: boolean;
  modalMode: IMode;
  showRemoveModal: boolean;
  headers: FilterResourseNS.IHeader[];
  configHeaders: IConfigHeaders;
  cofigAggregates: IAgregate[];
  sendingCatalogData: boolean;
  showSyncModal: boolean;
  currentOperator: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    choosenCatalogEditName: state.users.choosenCatalogEditName,
    showModal: state.users.showModal,
    modalMode: state.users.modalMode,
    showRemoveModal: state.users.showRemoveModal,
    sendingCatalogData: state.users.sendingCatalogData,
    showSyncModal: state.users.showSyncModal,
    headers: ShowResourceSelectors.getHeaders(state, 'catalogs'),
    configHeaders: getHeadersConfig('catalogs', state),
    cofigAggregates: getAggregates('catalogs', state),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    createCatalog: injectResource('catalogs', actions.createResource),
    editCatalog: injectResource('catalogs', actions.editResource),
    saveEditCatalog: injectResource('catalogs', actions.saveEditResource),
    deleteCatalog: injectResource('catalogs', actions.deleteResource),
    changeCatalogFormField: injectResource('catalogs', actions.changeCatalogFormField),
    testConnentClear: injectResource('catalogs', actions.testConnentClear),
    acceptDelete: actions.acceptDelete,
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModalStatus: actions.switchRemoveModalStatus,
    loadCurrentOperator: showResourceActions.loadCurrentOperator,
    disableCatalog: injectResource('catalogs', actions.disableCatalog),
    enableCatalog: injectResource('catalogs', actions.enableCatalog),
    testCatalogConnection: injectResource('catalogs', actions.testCatalogConnection)
}, dispatch);
}

const b = block('catalogs');

class Catalogs extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    const {
      showRemoveModal,
      acceptDelete,
      headers,
      configHeaders,
      cofigAggregates,
      currentOperator = {}
    } = this.props;

    const {
      showModal,
      changeCatalogFormField,
      testConnentClear,
      sendingCatalogData,
      testCatalogConnection
    } = this.props;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="catalogs"
          label="Пользователи > Каталоги"
        />
        <ShowResource
          onAdd={currentOperator['catalogs.post'] ? this.openModal : null}
          resource="catalogs"
          headers={headers}
          pullingData
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          aggregateStats={cofigAggregates}
          //@ts-ignore
          actionsFormatter={this.actionsFormatter}
          //@ts-ignore
          headersFormatter={this.dataFormatter}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showModal}
          title="Параметры каталога"
          onClose={this.closeModal}
        >
          <AddCatalogForm
            onSave={this.handleSaveForm}
            onCancel={this.closeModal}
            onTest={() => { testCatalogConnection(null) }}
            testConnentClear={testConnentClear}
            changeFormField={changeCatalogFormField}
            sendingCatalogData={sendingCatalogData}
            mode="edit"
          />
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage="Каталог будет удален из базы!"
          onClose={this.closeRemoveModal}
          onRemove={acceptDelete}
        />
      </div>
    );
  }

  @bind
  private openModal() {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private closeModal() {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private closeRemoveModal(): void {
    this.props.switchRemoveModalStatus(false);
  }

  @bind
  private handleToggleCatalog(id: number, status: boolean) {
    const { disableCatalog, enableCatalog, testConnentClear } = this.props;
    if (status) {
      disableCatalog(id);
    } else {
      enableCatalog(id);
      setTimeout( () => {
        testConnentClear()
      }, 800)
    }
  }

  @bind
  private handleSaveForm() {
    const { modalMode, createCatalog, saveEditCatalog } = this.props;
    if (modalMode === 'create') {
      createCatalog();
    } else {
      saveEditCatalog();
    }
  }

  @bind
  private dataFormatter(field: string, row: IResource & ICatalog) {
    if (field === 'type') {
      switch (row[field]) {
      case 'ad': return 'Active Directory';
      case 'edir': return 'Edirectory';
      default: return row[field];
      }
    }
    if (field === 'name' && row.err_code !== 'ok') {
      return (
        <span>
          {row[field]}
          <span className={b('error')}>
            {row.err_code}
          </span>
        </span>
      );
    }
    if (field === 'enabled') {
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row['connection']
            ? <span className={b('circle', { green: true })} />
            : <span className={b('circle', { red: true })} />
          }
          <Switch
            theme={theme}
            checked={row[field]}
            onChange={() => this.handleToggleCatalog(row.id, row[field])}
          />
          {/*
          <ProgressBar
            theme={theme}
            type="circular"
            mode="indeterminate"
          />
          */}
        </div>
      );
    }
    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IResource & ICatalog) {
    const { editCatalog, deleteCatalog, currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          {
            currentOperator['catalogs.put']
              ? <ActionFormatter icon="pen" onClick={editCatalog} id={row.id} mode="edit" />
              : null
          }
          {
            currentOperator['catalogs.delete']
              ? <ActionFormatter icon="trash" onClick={deleteCatalog} id={row.id}/>
              : null
          }
        </div>
      );
    }
    return null;
  }
}

export { Catalogs };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Catalogs);
