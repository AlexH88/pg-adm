import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import EditPrinterForm from './EditPrinterForm/EditPrinterForm';
import {actions} from '../../redux';
import ShowUserGroups from 'features/editGroups/view/ShowUserGroups/ShowUserGroups';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import ActionFormatter from 'shared/view/components/ActionFormatter/ActionFormatter';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import {Modal} from 'shared/view/components';
import './style.styl';
import * as circularTheme from 'shared/view/components/Table/circularTheme.styl';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import RemoveModal from '../../../../shared/view/components/RemoveModal/index';
import Tooltip from 'shared/view/components/Tooltip/';
import InfoIcon from './infoIcon';
import UnavailableIcon from './unavailableIcon';
import {generateIdElement} from 'shared/helpers';
import i18next from "i18next";

const resource = 'printers-network';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  showModal: boolean;
  showSyncModal: boolean;
  showRemoveModal: boolean;
  currentOperator: any;
  showSpinner: any;
  printerGroups: boolean;

}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof actions.editResource;
  switchModalStatus: typeof actions.switchModalStatus;
  saveEditPrinter: typeof actions.saveEditPrinter;
  switchSyncModal: typeof actions.switchSyncModal;
  setEditPrintServerData: typeof actions.setEditPrintServerData;
  startDeleteAgent: typeof actions.startDeleteAgent;
  switchRemoveModal: typeof actions.switchRemoveModal;
  deleteAgent: typeof actions.deleteAgent;
  getPrinterGroup: typeof actions.getPrinterGroup;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig(resource, state),
    cofigAggregates: getAggregates(resource, state),
    headers: ShowResourceSelectors.getHeaders(state, resource),
    showModal: state.printers.showModal,
    showSyncModal: state.printers.showSyncModal,
    showSpinner: state.showResource.showSpinner,
    showRemoveModal: state.printers.showRemoveModal,
    printerGroups: state.printers.printerGroups
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    onPrinterGroupsEdit: injectResource(resource, editUserGroups.actions.groupsEdit),
    editPrinter: injectResource(resource, actions.editResource),
    switchModalStatus: actions.switchModalStatus,
    switchRemoveModal: actions.switchRemoveModal,
    saveEditPrinter: injectResource(resource, actions.saveEditPrinter),
    switchSyncModal: injectResource(resource, actions.switchSyncModal),
    setEditPrintServerData: injectResource(resource, actions.setEditPrintServerData),
    startDeleteAgent: injectResource(resource, actions.startDeleteAgent),
    deleteAgent: injectResource(resource, actions.deleteAgent),
    getPrinterGroup: actions.getPrinterGroup
  }, dispatch);
}

const b = block('printers');

class Printers extends React.PureComponent<IDispatchProps & IStateProps, {}> {

  public componentDidMount(){
    this.props.getPrinterGroup()

  }

  public render() {
    const {
      configHeaders,
      headers,
      cofigAggregates,
      showModal,
      showSyncModal,
      showSpinner,
      showRemoveModal
    } = this.props;

    const { switchRemoveModal, deleteAgent } = this.props;

    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource={resource}
          label={ i18next.t('printers.printers') + ' > ' + i18next.t('printers.network') + ' > ' + i18next.t('printers.allPrintes')}
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
          //@ts-ignore
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderNamesFormatter}
          configHeadersTable={configHeaders}
        />
        <ShowUserGroups />
        <Modal
          isOpen={showModal}
          title= {i18next.t('printers.settings')}
          onClose={this.closeModal}
        >
          {
            showSpinner ?
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <ProgressBar theme={circularTheme} type="circular" mode="indeterminate"/>
              </div>
              :
            <EditPrinterForm
              onCancel={this.closeModal}
              onSave={this.onSaveForm}
            />
          }
        </Modal>
        <RemoveModal
          isOpen={showRemoveModal}
          alertMessage="Внимание! Принтер будет рассинхронизирован"
          onRemove={deleteAgent}
          onClose={switchRemoveModal}
          syncOff={true}
        />
      </div>
    );
  }

  @bind
  private renderActionsFormatter(field: string, row: IResource) {
    const { onPrinterGroupsEdit, editPrinter/*, switchSyncModal*/ } = this.props;
    let { currentOperator } = this.props;
    const {
      snmpInfo,
    } = row;

    currentOperator = currentOperator || {};

    let icon = null;

    let snmpValues = [];
    if(Array.isArray(snmpInfo)) {
      snmpValues = snmpInfo.filter((i: any, index: any) => {

        if((i.type == 'BLACK' || i.type == 'YELLOW' || i.type == "MAGENTA" || i.type == "MAGENTA" || i.type == "CYAN") && i.value.length != 0 && (!i.value[0].includes('%')) ) {
          i.value = i.value.map( (i: any) => i+'%')
        }

        if(i.type == 'DATE' && i.value.length != 0) {
          let splitDate = i.value[0].split(',')
          i.value[0] =  `${splitDate[0]}, ${splitDate[1]}`
        }

        if(i.value.length != 0 && (!i.value[0].includes('\n')) ) {
          for(let j=0; i.value.length > j; j++){
            i.value[j] = i.value[j] + '\n';
            if(i.value[j].length > 255) {
                i.value[j] = i.value[j].substring(0,200)+"... \n";
            }
          }
        }

        return true;
      })
    } else {
      snmpValues = [];
    }

    if (row.snmp === true) {
      if (snmpValues.length > 0) {
        icon = (
          <div className={b('info')}>
            <div className={b('icon-wrapper')}>
              <InfoIcon />
            </div>
            <div className="tooltip-wrapper">
              <Tooltip
                item={row}
                tooltipPosition={{
                  right: '9px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            </div>
          </div>
        );
      } else {
        icon = (
          <div className={b('info')}>
            <div className={b('icon-wrapper')} title="Не удалось получить настройки SNMP" id={`warning_icon-${generateIdElement()}`} >
              <UnavailableIcon />
            </div>
          </div>
        );
      }
    }

    if (field === 'actions') {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {
            row.active
              ?
              <span className={b('circle', { green: true })} id={`printersnetwork_circle-${generateIdElement()}`}/>
              :
              <span className={b('circle', { red: true })} id={`printersnetwork_circle-${generateIdElement()}`}/>
          }
          {icon}
          {
             this.props.printerGroups === true
              ?
            <ActionFormatter icon="folder" onClick={onPrinterGroupsEdit} id={row.id} title="Группы" idHash={`printersnetwork-folder-${generateIdElement()}`}/>
              :
              null 
          }
          {
            currentOperator['printers.put']
              ?
            <ActionFormatter icon="pen" onClick={editPrinter} id={row.id} title="Редактировать" idHash={`printersnetwork-pen-${generateIdElement()}`}/>
              :
              null
          }
          { !row.status ?
            <ActionFormatter icon="unsync" onClick={this.deleteRecord.bind(this, row)} id={row.id} title="Разсинхронизировать" idHash={`printersnetwork-unsync-${generateIdElement()}`}/>
            :
            <ActionFormatter icon="unsync_off"/>
          }
          {/*<ActionFormatter icon="sync" onClick={switchSyncModal} id={row.id}/>*/}
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
  private switchVisibleSyncModal(): void {
    this.props.switchSyncModal();
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {
    if (field === 'is_followme') {
      if (!row[field]) {
        return <span>Нет</span>;
      } else {
        return <span>Да</span>;
      }
    }
    if (field === 'name') {
      return `${row.host.name}/${row.name}`;
    }
    function formatCurrencyForTable(currencyValue: string) { // TODO to utils
      return `${Number(currencyValue) / 100}`;
    }
    if (field === 'price' || field === 'a3Price' || field === 'a4Price' || field === 'a5Price') {
      return formatCurrencyForTable(row[field]);
    }
    if (field === 'mac') {
      return row.host.mac;
    }
    return row[field];
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus(false);
  }

  @bind
  private onSaveForm(): void {
    const { saveEditPrinter } = this.props;
    saveEditPrinter();
    // this.props.switchModalStatus(false);
  }
}
export { Printers };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Printers);
