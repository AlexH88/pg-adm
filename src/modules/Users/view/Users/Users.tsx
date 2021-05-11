import * as React from 'react';
import {bindActionCreators} from 'redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {connect} from 'react-redux';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import ShowResource from 'features/showResource/view/ShowResource/ShowResource';
import ShowResourceActions from 'features/showResource/redux/actions';
import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors} from 'features/showResource';
import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import * as editUserGroups from 'features/editGroups';
import AddUserForm from './AddUserForm/AddUserForm';
import SyncFromCatalogForm from './SyncFromCatalogForm';
import {IUser} from 'shared/types/users';
import injectResource from 'shared/helpers/injectResource';
import {Modal, RemoveModal, AlertModal} from 'shared/view/components';
import {Checkbox, Icon, Button} from 'shared/view/elements';
import {actions} from '../../redux';
import {IAgregate, IMode} from '../../namespace';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {generateIdElement} from 'shared/helpers';
import './Users.styl';
import * as checkBoxStyke from './checkBoxStyle.styl';
import {selectIsAllSelected} from 'modules/Users/redux/actions/selectors';
import {changeLoader} from 'features/showResource/redux/actions/communication';
import i18next from "i18next";

const resource = 'users';

interface IDispatchProps {
  loadResource: typeof ShowResourceActions.loadResource;
  createUser: typeof actions.createResource;
  editUser: typeof actions.editResource;
  deleteUser: typeof actions.deleteResource;
  saveEditUser: typeof actions.saveEditResource;
  acceptDelete: typeof actions.acceptDelete;
  switchRemoveModalStatus: typeof actions.switchRemoveModalStatus;
  switchModalStatus: typeof actions.switchModalStatus;
  switchModalLoadFileStatus: typeof actions.switchModalLoadFileStatus;
  switchUsersMultiEditStatus: typeof actions.switchUsersMultiEditStatus;
  checkedUserMultiEdit: typeof actions.checkedUserMultiEdit;
  deleteCheckedUsers: typeof actions.deleteCheckedUsers;
  checkedUsersGroupsEdit: typeof actions.checkedUsersGroupsEdit;
  onUserGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  onUsersGroupsEdit: typeof editUserGroups.actions.multiGroupsEdit;
  onAllItemsSelect: typeof actions.changeAllItemsSelect;
  switchSyncModal: typeof actions.switchSyncModal;
  changeLoader: typeof changeLoader;
  getCatalogs: typeof actions.getCatalogs;
  updateUsers: typeof actions.updateUsers;
  loadFileErrorClear: typeof actions.loadFileErrorClear;
  clearUsersOutsideDB: typeof actions.clearUsersOutsideDB;
  clearUpdateCardStatus: typeof actions.clearUpdateCardStatus;
}

interface IStateProps {
  isSync: boolean;
  showModal: boolean;
  showRemoveModal: boolean;
  isMultiEdit: boolean;
  isAllSelected: boolean;
  deleteUserLogin?: IUser;
  modalMode: IMode;
  headers: FilterResourseNS.IHeader[];
  selectedUsers: IUser[];
  configHeaders: IConfigHeaders;
  configAggregates: IAgregate[];
  currentOperator: any;
  showSyncModal: boolean;
  showModalLoadFile: boolean;
  error: string;
  usersOutsideDB: [];
  updateCardStatus: boolean;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const showResourceState = state.showResource.users;
  const allUsers = showResourceState
    ? Object.values(showResourceState.data).reduce((accum: IUser[], cur: IUser[]) => [...accum, cur], [])
    : [];

  const currentOperator: any = state.showResource.currentOperator || {};

  let isSync: boolean = false;
  if(state.users.availableCatalogs.length > 0) {
    isSync = true
  }

  return {
    isSync: isSync,
    currentOperator: currentOperator.access_rules,
    showModal: state.users.showModal,
    showSyncModal: state.users.showSyncModal,
    showModalLoadFile: state.users.showModalLoadFile,
    modalMode: state.users.modalMode,
    isMultiEdit: state.users.isMultiEdit,
    isAllSelected: selectIsAllSelected(state, allUsers),
    showRemoveModal: state.users.showRemoveModal,
    deleteUserLogin: (state.users.deleteResourceField as IUser),
    selectedUsers: state.users.selectedUsers,
    headers: ShowResourceSelectors.getHeaders(state, resource),
    configHeaders: getHeadersConfig(resource, state),
    configAggregates: getAggregates(resource, state),
    error: state.users.error,
    usersOutsideDB: state.users.usersOutsideDB,
    updateCardStatus: state.users.updateCardStatus,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadResource: injectResource(resource, ShowResourceActions.loadResource),
    createUser: injectResource(resource, actions.createResource),
    editUser: injectResource(resource, actions.editResource),
    deleteUser: injectResource(resource, actions.deleteResource),
    saveEditUser: injectResource(resource, actions.saveEditResource),
    onUserGroupsEdit: injectResource(resource, editUserGroups.actions.groupsEdit),
    deleteCheckedUsers: injectResource(resource, actions.deleteCheckedUsers),
    onUsersGroupsEdit: injectResource(resource, editUserGroups.actions.multiGroupsEdit),
    acceptDelete: actions.acceptDelete,
    switchRemoveModalStatus: actions.switchRemoveModalStatus,
    switchModalStatus: actions.switchModalStatus,
    switchModalLoadFileStatus: actions.switchModalLoadFileStatus,
    checkedUserMultiEdit: actions.checkedUserMultiEdit,
    checkedUsersGroupsEdit: actions.checkedUsersGroupsEdit,
    switchUsersMultiEditStatus: actions.switchUsersMultiEditStatus,
    onAllItemsSelect: actions.changeAllItemsSelect,
    switchSyncModal: actions.switchSyncModal,
    changeLoader: injectResource(resource, changeLoader),
    getCatalogs: actions.getCatalogs,
    updateUsers: actions.updateUsers,
    loadFileErrorClear: actions.loadFileErrorClear,
    clearUsersOutsideDB: actions.clearUsersOutsideDB,
    clearUpdateCardStatus: actions.clearUpdateCardStatus,
  }, dispatch);
}

class Users extends React.PureComponent<IDispatchProps&IStateProps, {}> {
  state = {
    iconModalDisabled: false,
    fileData: null,
  }

  componentDidMount() {
    const { getCatalogs } = this.props;
    getCatalogs();

    let authStor = localStorage.getItem('authoritiesCurrent')
    if(authStor !== null){
      let data = JSON.parse(authStor)
      let temp = [];
      data.forEach(item => {
        temp.push(item.tag)
      })

      if(!temp.includes('integration')) {
        this.setState({iconModalDisabled: true})
      }
    }
  }

  private b = block('users');

  @bind
  private getHeaderActions() {
    const b = this.b;
    const { isMultiEdit, selectedUsers } = this.props;
    const isUserWithoutGen = selectedUsers.some((user: IUser) => user.catalogs !== 'def');
    return isMultiEdit && selectedUsers.length > 0
      ? (
        <div className={b('multi-icon')}>
          <Icon icon="folder" id='multi-icon-folder' onClick={this.onUsersGroupsEdit}/>
          <Icon icon="trash" id='multi-icon-trash' onClick={this.onDeleteCheckedUsers}/>
          {!isUserWithoutGen && <Icon icon="trash" onClick={this.onDeleteCheckedUsers}/>}
        </div>
      )
      : null;
  }

  @bind
  private onUsersGroupsEdit(): void {
    const { onUsersGroupsEdit, selectedUsers } = this.props;
    onUsersGroupsEdit(selectedUsers);
  }

  @bind
  private onDeleteCheckedUsers(): void {
    const { deleteCheckedUsers, selectedUsers } = this.props;
    deleteCheckedUsers(selectedUsers);
  }

  @bind
  private multiEdit(): void {
    this.props.switchUsersMultiEditStatus();
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private closeRemoveModal(): void {
    this.props.switchRemoveModalStatus(false);
  }

  @bind
  private onSaveForm(): void {
    const { modalMode, createUser, saveEditUser } = this.props;
    if (modalMode === 'create') {
      createUser();
    } else {
      saveEditUser();
    }
  }

  @bind
  private renderLoginsFormatter(field: string, row: IResource & IUser) {
    const { isMultiEdit, checkedUserMultiEdit, selectedUsers } = this.props;
    const isCheck = !!selectedUsers.find(foundValue => foundValue.id === row.id);

    function formatCurrencyForTable(currencyValue: string) { // TODO to utils
      return `${Number(currencyValue) / 100}`;
    }

    if (field === 'checkbox' && isMultiEdit) {
      return (
        <Checkbox
          label=""
          onChange={checkedUserMultiEdit.bind(this, row)}
          checked={isCheck}
          theme={checkBoxStyke}
        />
      );
    }

    if (field === 'balance') {
      return formatCurrencyForTable(row[field as any]);
    }

    if(field === 'login') {
      if(row.ldapSource){
        return `${row.ldapSource.name}\\${row.login}`
      }
      return row.login
    }
    return row[field];
  }

  @bind
  private actionsFormatter(field: string, row: IResource & IUser) {
    const { editUser, deleteUser, onUserGroupsEdit, isMultiEdit, currentOperator = {} } = this.props;
    if (field === 'actions' && !isMultiEdit) {
      return (
        <div>
          {
            !!currentOperator['users.membersip']
            && <ActionFormatter icon="folder" onClick={onUserGroupsEdit} id={row.id} title="Группы" idHash={`users-folder-${generateIdElement()}`}/>
          }
          {
            currentOperator['users.put']
              ? row.catalogs !== null
                ? <ActionFormatter icon="pen" onClick={editUser} id={row.id} mode="edit" title="Редактировать" idHash={`users-pen-${generateIdElement()}`}/>
                : <ActionFormatter icon="pen" onClick={editUser} id={row.id} mode="partial-edit" title="Редактировать" idHash={`users-pen-${generateIdElement()}`}/>
              : null
          }
          {
            currentOperator['users.delete']
              ? row.catalogs !== null
                ? <ActionFormatter icon="trash" onClick={deleteUser} id={row.id} title="Удалить" idHash={`users-trash-${generateIdElement()}`}/>
                : <ActionFormatter icon="trash_off" id={row.id} title="Удалить" idHash={`users-trash-${generateIdElement()}`}/>
              : null
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private onSelectFile(event) {
    if(event.target.files && event.target.files[0]){
      this.setState({
        fileData: event.target.files[0]
      }, () => {
        this.submitUpdateUsers()
      })
        this.fileInput.value = null;
    }
  }

  @bind
  private openModalLoadFile(): void {
    this.props.switchModalLoadFileStatus(true);
  }

  @bind
  private closeModalLoadFile(): void {
    const {loadFileErrorClear, clearUsersOutsideDB, clearUpdateCardStatus} = this.props;
    this.props.switchModalLoadFileStatus(false);
    this.setState({
      fileData: null
    })
    loadFileErrorClear();
    clearUsersOutsideDB();
    clearUpdateCardStatus();
  }

  @bind
  private submitUpdateUsers(): void {
    const { updateUsers } = this.props;
    const formData = new FormData();
    formData.append( 
      "file", 
      this.state.fileData, 
      this.state.fileData.name
    );
    updateUsers(formData);
  }  

  fileInput;

  @bind
  private renderContentUsersCard(): any {
    const {usersOutsideDB, error, updateCardStatus} = this.props;
    let content:any;
    if(updateCardStatus && usersOutsideDB.length > 0) {
      return(
        <>
          <div className='content-header'>{this.state.fileData.name}</div>
          <div className='content-header' key={Math.random()}>Карты пользователей обновлены</div>
          <div className='content-header' key={Math.random()}>Следующие пользователи отсутствуют в базе:</div>
          <div className='content-container'>
            {
              usersOutsideDB.map((i) => (<span key={`${Math.random()}-${i}`}>{i}</span>))
            }
          </div>
        </>
      )

    } else if((updateCardStatus && usersOutsideDB.length == 0)) {
      return(
        <>
          <div className='content-header'>{this.state.fileData.name}</div>
          <div className='content-header' key={Math.random()}>Карты пользователей обновлены</div>
          <div className='content-header' key={Math.random()}>Все пользователи присутствуют в базе</div>
        </>
      )
    } else {
      if(this.state.fileData) {
        return(
          <div className='content-header'>{this.state.fileData.name}</div>
        )
      } else {
        return(
          <div className='content-header'>Выберите файл для обновления карт пользователей</div>
        )
      }
    }
    return content;
  }

  public render() {
    const {
      showModal,
      headers,
      modalMode,
      showSyncModal,
      showRemoveModal,
      acceptDelete,
      isMultiEdit,
      configHeaders,
      configAggregates,
      deleteUserLogin,
      isAllSelected,
      currentOperator = {},
      switchSyncModal,
      loadResource,
      isSync,
      showModalLoadFile,
      error='',
      loadFileErrorClear,
      usersOutsideDB,
      clearUsersOutsideDB,
      clearUpdateCardStatus
    } = this.props;

    const actions = this.getHeaderActions();
    return (
      <div>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          label={i18next.t('users.usersHeader')}
          noDisplaySelect
        />
        <ShowResource
          onMultiedit={this.multiEdit}
          onLoadFile={this.openModalLoadFile}
          onSynchronize={switchSyncModal}
          iconModalDisabled={this.state.iconModalDisabled || !isSync}
          isMultiEdit={isMultiEdit}
          onAdd={currentOperator['users.post'] ? this.openModal : null}
          resource={resource}
          headers={headers}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          aggregateStats={configAggregates}
          // @ts-ignore
          actionsFormatter={this.actionsFormatter}
          actionsHeader={actions}
          // @ts-ignore
          headersFormatter={this.renderLoginsFormatter}
          isAllSelected={isAllSelected}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showSyncModal}
          title="Синхронизация из каталога"
          onClose={switchSyncModal}
        >
          <SyncFromCatalogForm
            onCancel={switchSyncModal}
            onConfirm={() => {
              const { changeLoader } = this.props;
              changeLoader.call(this, true)
              switchSyncModal();
              this.setState({iconModalDisabled: true})
              setTimeout(() => {
                loadResource(false, false)
                this.setState({iconModalDisabled: false})
              }, 1500);
            }}
          />
        </Modal>

        <Modal
          isOpen={showModal}
          title={i18next.t('users.settings')}
          onClose={this.closeModal}
        >
          <AddUserForm
            onCancel={this.closeModal}
            onSave={this.onSaveForm}
            mode={modalMode}
          />
        </Modal>

        <ShowUserGroups
          isMultiEdit={isMultiEdit}
        />

        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={ isMultiEdit ? `Пользователи "${deleteUserLogin ? deleteUserLogin : ''}" будут удалены из базы!` : `Пользователь "${deleteUserLogin ? deleteUserLogin.login : ''}" будет удален из базы!`}
          onClose={this.closeRemoveModal}
          onRemove={acceptDelete}
        />

        <Modal
          isOpen={showModalLoadFile}
          title={'Обновление карт пользователей'}
          onClose={this.closeModalLoadFile}
        >
          <div style={{width: '440px'}}>
            <div className={this.b('update-user-content')}>
              {this.renderContentUsersCard()}
            </div>
            <span className={this.b('general-error')}>{error}</span>
            <div className={this.b('update-user-footer')}>
              <input
                id="fileInput"
                type="file"
                onChange={this.onSelectFile}
                style={{display:'none'}}
                ref={(ref) => this.fileInput = ref}
               />

              <Button
                label="Отмена"
                onClick={this.closeModalLoadFile}
              />

              <Button
                label="Загрузить файл"
                onClick={() => {
                  this.fileInput.click()
                  this.setState({fileData: null})
                  loadFileErrorClear()
                  clearUsersOutsideDB()
                  clearUpdateCardStatus()
                  }
                }
              />

            </div>
          </div>

        </Modal>
      </div>
    );
  }
}

export { Users };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Users);
