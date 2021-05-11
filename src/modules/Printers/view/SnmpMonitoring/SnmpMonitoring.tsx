import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bind } from 'decko';
import { block } from 'bem-cn';
import injectResource from '../../../../shared/helpers/injectResource';
import { FilterResource } from '../../../../features/filterResource';
import { SnmpShowResource } from '../../../../features/SnmpShowResource';
import { actions } from '../../redux';
import { IReduxState } from '../../../../shared/types/app';
import { Modal } from '../../../../shared/view/components';
import './style.styl';
import RemoveModal from '../../../../shared/view/components/RemoveModal/index';
import AddFloorForm from './AddFloorForm/AddFloorForm';
import {getHeadersConfig} from 'shared/helpers/getConfig';


const resource = 'floors';

interface IStateProps {
  showModal: boolean;
  showRemoveModal: boolean;
  currentOperator: any;
  pictureId: any;
  configHeaders: any;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  createPlanFloor: typeof actions.createPlanFloor;
  editPlanFloor: typeof actions.editPlanFloor;
  switchRemoveModal: typeof actions.switchRemoveModal;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  
  return {
    currentOperator: currentOperator.access_rules,
    showModal: state.printers.showModal,
    showRemoveModal: state.printers.showRemoveModal,
    pictureId: state.SnmpShowResource.floors,
    configHeaders: getHeadersConfig('printers-network', state),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModal: actions.switchRemoveModal,
    createPlanFloor: injectResource(resource, actions.createPlanFloor),
    editPlanFloor: injectResource(resource, actions.editPlanFloor),
  }, dispatch);
}

const b = block('printers');

class SnmpMonitoring extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    let { showModal, showRemoveModal, switchRemoveModal, currentOperator } = this.props;

    currentOperator = currentOperator || {};

    return (
      <div className={b()}>
        <FilterResource
          configs={this.props.configHeaders}
          resource={resource}
          label="Принтеры > SNMP Мониторинг"
          noDisplaySelect
          snmpDisplaySelect
          onAdd={currentOperator['users.post'] ? this.openModal : null}
        />

        <SnmpShowResource
          onAdd={currentOperator['users.post'] ? this.openModal : null}
          resource={resource}
          configs={{
            sort: {
              by: 'id',
              order: 'asc',
            },
          }}
        />

        <Modal
          isOpen={showModal}
          title="Добавление плана этажа"
          onClose={this.closeModal}
        >
          <AddFloorForm
            onCancel={this.closeModal}
            onSave={this.onSaveForm}
          />
        </Modal>

        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage="План введенного вами этажа был ранее уже загружен. Хотите заменить план этажа?"
          onRemove={this.onEditForm}//экшен который отправляет пост запрос при повторон редактировании картинки этажа
          onClose={switchRemoveModal}
          planFloor={true}
        />
      </div>
    );
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus(true);
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus(false);
  }

  @bind
  private onSaveForm(): void {
    const { createPlanFloor } = this.props;
    createPlanFloor(this.props.pictureId.pictureId);
  }

  @bind
  private onEditForm(): void {
    const { editPlanFloor } = this.props;
    editPlanFloor(this.props.pictureId.pictureId);
  }
}
export { SnmpMonitoring };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(SnmpMonitoring);
