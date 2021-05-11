import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {actions} from '../../redux';
import injectResource from 'shared/helpers/injectResource';
import {Modal, RemoveModal} from 'shared/view/components';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {Namespace as ShowResourceNS, selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {getHeadersConfig} from 'shared/helpers/getConfig';
import AddBlockedPrinter from './AddBlockedPrinter/AddBlockedPrinter';
import {IMode} from 'modules/Settings/namespace';
import FilterResource from "../../../../features/filterResource/view/FilterResource/FilterResource";
import {generateIdElement} from 'shared/helpers';
import i18next from "i18next";

interface IStateProps {
  showRemoveModal: boolean;
  deletingRole: number;
  showModal: boolean;
  modalMode: IMode;
  headers: ShowResourceNS.IHeader[];
  configHeaders: IConfigHeaders;
  currentOperator: any;
  deletingPrinter: string | null;
}

interface IDispatchProps {
  switchRemoveModalStatus: typeof actions.switchRemoveModal;
  startDeleteRole: typeof actions.startDeleteRole;
  deleteRole: typeof actions.acceptDeleteRole;
  switchModalStatus: typeof actions.switchModalStatus;
  editRole: typeof actions.editResource;
  saveChangeRole: typeof actions.saveChangeRole;
  createRole: typeof actions.createRole;
  addBlockedPrinter: typeof actions.addBlockedPrinter;
  removeBlockedPrinter: typeof actions.removeBlockedPrinter;
  startDeleteBlockedPrinter: typeof actions.startDeleteBlockedPrinter;
}

function mapState(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    showRemoveModal: state.settings.showRemoveModal,
    deletingRole: (state.settings.deletingRole as number),
    showModal: state.settings.showModal,
    headers: ShowResourceSelectors.getHeaders(state, 'roles'),
    configHeaders: getHeadersConfig('blockedprinters', state),
    modalMode: state.settings.modalMode,
    deletingPrinter: state.settings.deletingPrinter,
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
    addBlockedPrinter: actions.addBlockedPrinter,
    removeBlockedPrinter: actions.removeBlockedPrinter,
    startDeleteBlockedPrinter: actions.startDeleteBlockedPrinter,
  }, dispatch);
}

class Ignored extends React.PureComponent<IStateProps & IDispatchProps, {}> {
  private static headers = [
    {
      isConnected: true,
      isSortable: false,
      title: 'Имя драйвера',
      value: 'printer',
    },
  ];

  private b = block('roles');

  public render() {
    const b = this.b;
    const { showModal, showRemoveModal, switchRemoveModalStatus, configHeaders } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={Ignored.headers as any}
          resource="blockedprinters"
          label={i18next.t('Ignored.header')}
          noDisplaySelect
        />
        <ShowResource
          resource="blockedprinters"
          headers={Ignored.headers}
          onAdd={this.openModal}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          configHeadersTable={configHeaders}
        />
        <Modal
          isOpen={showModal}
          title={i18next.t('Ignored.addIg')}
          onClose={this.closeModal}
        >
          <AddBlockedPrinter
            onCancel={this.closeModal}
            onSave={this.onSaveForm}
          />
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage={i18next.t('Ignored.deleted')}
          onClose={switchRemoveModalStatus}
          onRemove={this.onAcceptDeletePrinterGroup}
        />
      </div>
    );
  }

  @bind
  private onAcceptDeletePrinterGroup() {
    const { removeBlockedPrinter, deletingPrinter } = this.props;
    removeBlockedPrinter(deletingPrinter);
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: 'create' });
  }

  @bind
  private onDelete(printerName: string) {
    const { startDeleteBlockedPrinter, switchRemoveModalStatus } = this.props;
    startDeleteBlockedPrinter(printerName);
    switchRemoveModalStatus();
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    if (field === 'actions') {
      return (
        <div>
          <ActionFormatter icon="trash" onClick={this.onDelete.bind(this, row.driver)} id={row.id} title="Удалить" idHash={`ignored-trash-${generateIdElement()}`}/>
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
    const { addBlockedPrinter } = this.props;
    addBlockedPrinter('_');
  }
};

export { Ignored };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatchToProps)(Ignored);
