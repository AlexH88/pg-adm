import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import {Modal, RemoveModal, AlertModal} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IConfigHeaders, IReduxState} from 'shared/types/app';
import {Namespace as ShowResourceNS, selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {getHeadersConfig} from 'shared/helpers/getConfig';
import EditRoles from './EditRoles/EditRoles';
import {IMode} from 'modules/Settings/namespace';
import FilterResource from "../../../../features/filterResource/view/FilterResource/FilterResource";
import {generateIdElement} from 'shared/helpers';
import i18next from "i18next";

interface IStateProps {
  showRemoveModal: boolean;
  deletingRole: number;
  showAlertModal: boolean;
  showModal: boolean;
  modalMode: IMode;
  headers: ShowResourceNS.IHeader[];
  configHeaders: IConfigHeaders;
  currentOperator: any;
  error: string;
}

interface IDispatchProps {
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  startDeleteRole: typeof actions.startDeleteRole;
  deleteRole: typeof actions.acceptDeleteRole;
  switchModalStatus: typeof actions.switchModalStatus;
  editRole: typeof actions.editResource;
  saveChangeRole: typeof actions.saveChangeRole;
  createRole: typeof actions.createRole;
  clearError: typeof actions.clearError;
  getAuthorities: typeof actions.getAuthorities;
}

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  const error: string = state.settings.error || '';

  return {
    currentOperator: currentOperator.access_rules,
    showRemoveModal: state.settings.showRemoveModal,
    showAlertModal: state.settings.showAlertModal,
    deletingRole: (state.settings.deletingRole as number),
    showModal: state.settings.showModal,
    headers: ShowResourceSelectors.getHeaders(state, 'roles'),
    configHeaders: getHeadersConfig('roles', state),
    modalMode: state.settings.modalMode,
    error: error,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    startDeleteRole: injectResource('roles', actions.startDeleteRole),
    deleteRole: injectResource('roles', actions.acceptDeleteRole),
    switchModalStatus: injectResource('roles', actions.switchModalStatus),
    editRole: injectResource('roles', actions.editResource),
    saveChangeRole: injectResource('roles', actions.saveChangeRole),
    createRole: injectResource('roles', actions.createRole),
    switchRemoveModalStatus: actions.switchRemoveModal,
    clearError: injectResource('roles', actions.clearError),
    getAuthorities: actions.getAuthorities
  }, dispatch);
}

class Roles extends React.PureComponent<IStateProps & IDispatchProps, {}> {

  public componentDidMount() {
    this.props.getAuthorities();
  }

  private static headers = [
    {
      isConnected: true,
      isSortable: false,
      title: 'Название',
      value: 'name',
    },
    {
      isConnected: true,
      isSortable: false,
      title: 'Описание',
      value: 'description',
    },
  ];

  private b = block('roles');

  public render() {
    const b = this.b;
    const {
      showModal,
      showRemoveModal,
      showAlertModal,
      switchRemoveModalStatus,
      configHeaders,
      currentOperator = {},
      clearError,
      error
    } = this.props;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="roles"
          label={i18next.t('SRole.header')}
          noDisplaySelect
        />
        <ShowResource
          resource="roles"
          headers={Roles.headers}
          onAdd={currentOperator['roles.post'] ? this.openModal : null}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          actionsFormatter={this.renderActionsFormatter}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showModal}
          title={i18next.t('SRole.setingsRole')}
          onClose={this.closeModal}
        >
          <EditRoles
            onCancel={this.closeModal}
            onSave={this.onSaveForm}
          />
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('SRole.deleted')}
          onClose={switchRemoveModalStatus}
          error={error}
          onRemove={this.onAcceptDeletePrinterGroup}
        />
      </div>
    );
  }

  @bind
  private onAcceptDeletePrinterGroup() {
    const { deleteRole, deletingRole, clearError } = this.props;
    deleteRole(deletingRole);
    setTimeout(()=>{
      clearError()
    }, 3500)
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private onDelete(id: number) {
    const { startDeleteRole, switchRemoveModalStatus } = this.props;
    startDeleteRole(id);
    switchRemoveModalStatus();
  }

  @bind
  private renderActionsFormatter(field: string, row: any) {
    const { currentOperator = {} } = this.props;
    if (field === 'actions') {
      return (
        <div>
          { currentOperator['operators.put'] ?
            row.name == 'admin'
              ? <ActionFormatter icon="pen_off" onClick={this.props.editRole} id={row.id} />
              : <ActionFormatter icon="pen" onClick={this.props.editRole} id={row.id} title="Редактировать" idHash={`role-pen-${generateIdElement()}`}/>
            : null
          }
          { currentOperator['operators.delete'] ?
            row.name == 'admin'
              ? <ActionFormatter icon="trash_off" onClick={this.onDelete} id={row.id}/>
              : <ActionFormatter icon="trash" onClick={this.onDelete} id={row.id} title="Удалить" idHash={`role-trash-${generateIdElement()}`}/>
            : null
          }
        </div>

      );
    }
    return null;
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' } );
  }

  @bind
  private onSaveForm(): void {
    const { modalMode, saveChangeRole, createRole } = this.props;
    if (modalMode === 'edit') {
      saveChangeRole();
    } else if (modalMode === 'create') {
      createRole();
    }
  }
};

export { Roles };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatchToProps)(Roles);
