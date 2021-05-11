import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import './style.styl';
import ActionFormatter from '../../../../shared/view/components/ActionFormatter/ActionFormatter';
import {Modal, RemoveModal} from 'shared/view/components';
import {actions, oidParameters} from 'modules/Snmp';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import EditFirmwareForm from 'modules/Snmp/view/MIB/forms/EditFirmwareForm';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  currentOperator: any;
  showRemoveModal: boolean;
  showEditModal: boolean;
}

interface IDispatchProps {
  startEditFirmware: typeof actions.startEditFirmware;
  switchEditModal: typeof actions.switchEditModal;
  switchRemoveModal: typeof actions.switchRemoveModal;
  saveFirmvare: typeof actions.saveFirmvare;
  startDeleteFirmware: typeof actions.startDeleteFirmware;
  acceptDeleteFirmware: typeof actions.acceptDeleteFirmware;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig('oid', state),
    cofigAggregates: getAggregates('oid', state),
    headers: ShowResourceSelectors.getHeaders(state, 'oid'),
    showRemoveModal: state.snmp.showRemoveModal,
    showEditModal: state.snmp.showEditModal,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    startEditFirmware: actions.startEditFirmware,
    switchEditModal: actions.switchEditModal,
    switchRemoveModal: actions.switchRemoveModal,
    saveFirmvare: actions.saveFirmvare,
    startDeleteFirmware: actions.startDeleteFirmware,
    acceptDeleteFirmware: actions.acceptDeleteFirmware,
  }, dispatch);
}

const b = block('printers');

class MIB extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    const { configHeaders, headers, cofigAggregates, showEditModal, showRemoveModal } = this.props;
    const { switchEditModal, saveFirmvare, switchRemoveModal, acceptDeleteFirmware } = this.props;

    console.log('headers headers headers');
    console.log(configHeaders);

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="oid"
          label="SNMP > База MIB"
        />
        <ShowResource
          resource="oid"
          onAdd={switchEditModal}
          headers={headers}
          configs={{}}
          aggregateStats={cofigAggregates}
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderNamesFormatter}
          configHeadersTable={configHeaders}
        />
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage="Прошивка будет удалена из базы!"
          onClose={switchRemoveModal}
          onRemove={acceptDeleteFirmware}
        />
        <Modal
          isOpen={showEditModal}
          title="Параметры прошивки"
          onClose={switchEditModal}
        >
          {
            !1 ?
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <ProgressBar type="circular" mode="indeterminate"/>
              </div>
              :
            <EditFirmwareForm
              onCancel={this.onSwitchEditModal}
              onSave={this.onSaveFirmware}
            />
          }
        </Modal>
      </div>
    );
  }

  @bind
  onSaveFirmware() {
    const { saveFirmvare } = this.props;
    saveFirmvare();
  }

  @bind
  onSwitchEditModal() {
    const { switchEditModal } = this.props;
    switchEditModal();
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {

    if (oidParameters.includes(field)) {
      return row.parameters && row.parameters[field];
    }

    return row[field];
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource & any) {
    const { startDeleteFirmware, startEditFirmware } = this.props;

    if (field === 'actions') {
      return (
        <div>
          <ActionFormatter icon="pen" onClick={startEditFirmware.bind(null, row)} id={row.id} />
          <ActionFormatter icon="trash" onClick={startDeleteFirmware.bind(null, row)} id={row.id} />
        </div>
      );
    }

    return row[field];
  }

}
export { MIB };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(MIB);
