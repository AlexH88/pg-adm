import * as React from 'react';
import {block} from 'bem-cn';
import {IReduxState} from 'shared/types/app';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import SyncTable from '../components/SyncTable';
import ItemsList from '../components/ItemsList';
import {Modal} from 'shared/view/components';
import {ISyncData, ISyncingItems, ISyncTableTitles, TypesSyncingActions} from '../../namespace';
import {bind} from 'decko';
import './style.styl';
import Button from '../../../../shared/view/elements/Button/index';
//import { Field, reduxForm, WrappedFieldProps, FormProps } from 'redux-form';
import {TextInput} from 'shared/view/elements';

interface IDispatchProps {
  initLoadSyncData: typeof actions.initLoadSyncData;
  selectItemResource: typeof actions.selectItemResource;
  tryUnsyncItems: typeof actions.tryUnsyncItems;
  trySyncItems: typeof actions.trySyncItems;
  switchSyncUsersModal: typeof actions.switchSyncUsersModal;
  syncItems: typeof actions.syncItems;
  unsyncItems: typeof actions.unsyncItems;
}

interface IStateProps {
  data: ISyncData;
  selectedSyncItems: string[];
  selectedAsyncItems: string[];
  syncingItems: ISyncingItems;
  showSyncingItemsModal: boolean;
  syncingAction: TypesSyncingActions;
  thisState: any;
  syncDataModalError: boolean;
}

interface IOwnProps {
  showModal: boolean;
  resource: string;
  switchModalVisible(): void;
  modalTitle?: string;
  onSave?(): void;
  onCancel?(): void;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const { data, selectedAsyncItems, selectedSyncItems, syncingItems, showSyncingItemsModal, syncDataModalError } = state.syncResource;
  const { syncingAction } = state.syncResource;
  return {
    thisState: state,
    data,
    selectedSyncItems,
    selectedAsyncItems,
    syncingItems,
    showSyncingItemsModal,
    syncingAction,
    syncDataModalError,
  };
}

const titles: ISyncTableTitles = {
  sync: 'Вы собираетесь синхронизировать пользователей :',
  unsync: 'Вы собираетесь удалить из базы пользователей : ',
};

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    initLoadSyncData: actions.initLoadSyncData,
    selectItemResource: actions.selectItemResource,
    tryUnsyncItems: injectResource(ownProps.resource, actions.tryUnsyncItems),
    trySyncItems: injectResource(ownProps.resource, actions.trySyncItems),
    switchSyncUsersModal: actions.switchSyncUsersModal,
    unsyncItems: injectResource(ownProps.resource, actions.unsyncItems),
    syncItems: injectResource(ownProps.resource, actions.syncItems),
  }, dispatch);
}

interface IState {
  searchSync: string;
  searchUnsync: string;
}

class SyncResource extends React.PureComponent<IDispatchProps&IStateProps&IOwnProps, {} > {
  public state: IState = {
    searchSync: '',
    searchUnsync: ''
  };

  private b = block('sync-resource');

  public componentDidMount() {
    this.props.initLoadSyncData(this.props.resource);
  }


  public render() {
    const b = this.b;
    const { showModal, switchModalVisible, data, selectItemResource, syncingItems, /*showSyncingItemsModal,*/ modalTitle, onSave, onCancel } = this.props;
    const { selectedAsyncItems, selectedSyncItems, switchSyncUsersModal/*, syncDataModalError*/ } = this.props;
    const { syncingAction, syncItems, unsyncItems, resource } = this.props;

    return (
      <div className={b()}>
        <Modal
          isOpen={showModal}
          title={modalTitle ? modalTitle : "Синхронизация"}
          onClose={switchModalVisible}
        >
          <div className={b('header')}>
            <span className={b('header_item')}>
              <TextInput
                label="Поиск"
                value={this.state.searchSync}
                onChange={this.handleChangeSearchSync}
              />
              Синхронизированные
            </span>
            <div className="arrow-container">
              <div
                onClick={selectedAsyncItems.length !== 0 ? this.onSyncItems: ()=>{}}
                className={b(
                  'arrow',
                  { prev: true },
                  { 'prev_active': selectedAsyncItems.length !== 0 }
                )}
              />
              <div
                onClick={selectedSyncItems.length !== 0 ? this.onUnsyncItems: ()=>{}}
                className={b(
                  'arrow',
                  { next: true },
                  { 'next_active': selectedSyncItems.length !== 0 }
                )}
              />
            </div>
            <span className={b('header_item')}>
              <TextInput
                label="Поиск"
                value={this.state.searchUnsync}
                onChange={this.handleChangeSearchUnsync}
              />
              Несинхронизированные
            </span>
          </div>
          <div ref="table" className={b('tables')}>
            <SyncTable
              type="sync"
              data={data}
              onSelectItem={selectItemResource}
              selectedItems={selectedSyncItems}
              searchStr={this.state.searchSync}
            />
            <SyncTable
              type="unsync"
              data={data}
              onSelectItem={selectItemResource}
              selectedItems={selectedAsyncItems}
              searchStr={this.state.searchUnsync}
            />
          </div>
          <div className={b('footer')}>
            <Button
              label="Закрыть"
              type="submit"
              onClick={onCancel}
            />
          </div>
          {/*<div style={{color: 'red', textAlign: 'center'}}>{syncDataModalError ? 'Произошла ошибка при синхронизации' : ''}</div>*/}
          {/*
            resource === 'hosts' ?
              <div className={b('footer')}>
                <Button
                  label="OK"
                  disabled={invalid || pristine}
                  type="submit"
                  onClick={onSave}
                  isPrimary
                />
              </div>
            :
              <div className={b('footer')}>
                <Button
                  label="Отмена"
                  onClick={onCancel}
                />
                <Button
                  label="Сохранить"
                  disabled={invalid || pristine}
                  type="submit"
                  onClick={onSave}
                  isPrimary
                />
              </div>
          */}
        </Modal>
        {
          resource === 'catalogs' ? (
            <Modal
              isOpen={false}
              title={titles[syncingAction]}
              onClose={switchSyncUsersModal}
            >
              <ItemsList
                items={syncingItems.users}
                onButtonClick={switchSyncUsersModal}
                action={syncingAction}
                syncItems={syncItems}
                unsyncItems={unsyncItems}
              />
            </Modal>
          ) : this.getSyncOrUnsincFunc(syncingAction)
        }
      </div>
    );
  }

  @bind
  private handleChangeSearchSync(event) {
    this.setState({searchSync: event});
  }

  @bind
  private handleChangeSearchUnsync(event) {
    this.setState({searchUnsync: event});
  }

  @bind
  private getSyncOrUnsincFunc(action: TypesSyncingActions) {
    if (action === 'sync') {
      this.props.syncItems();
    }
    if (action === 'unsync') {
      this.props.unsyncItems();
    }
  }

  @bind
  private onScrollTop() {
    const table: any = this.refs.table;
    table.scrollTop = 0;
  }

  @bind
  private onSyncItems(): void {
    const { trySyncItems, switchSyncUsersModal } = this.props;
    this.onScrollTop();
    trySyncItems();
    switchSyncUsersModal();
  }

  @bind
  private onUnsyncItems(): void {
    const { tryUnsyncItems, switchSyncUsersModal } = this.props;
    this.onScrollTop();
    tryUnsyncItems();
    switchSyncUsersModal();
  }

}

export { SyncResource };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(SyncResource);
