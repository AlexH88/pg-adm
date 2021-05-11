import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {actions} from '../../redux';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import './style.styl';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  currentOperator: any;
}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof actions.editResource;
  switchModalStatus: typeof actions.switchModalStatus;
  saveEditPrinter: typeof actions.saveEditPrinter;
  switchSyncModal: typeof actions.switchSyncModal;
  setEditPrintServerData: typeof actions.setEditPrintServerData;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig('snmp', state),
    cofigAggregates: getAggregates('snmp', state),
    headers: ShowResourceSelectors.getHeaders(state, 'snmp'),
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    onPrinterGroupsEdit: injectResource('snmp', editUserGroups.actions.groupsEdit),
    editPrinter: injectResource('snmp', actions.editResource),
    switchModalStatus: actions.switchModalStatus,
    saveEditPrinter: injectResource('snmp', actions.saveEditPrinter),
    switchSyncModal: injectResource('snmp', actions.switchSyncModal),
    setEditPrintServerData: injectResource('snmp', actions.setEditPrintServerData)
  }, dispatch);
}

const b = block('printers');

class SNMPData extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    const { configHeaders, headers, cofigAggregates } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="snmp"
          label="Принтеры > Сетевые > SNMP Мониторинг"
        />
        <ShowResource
          resource="snmp"
          headers={headers}
          configs={{}}
          aggregateStats={cofigAggregates}
          headersFormatter={this.renderNamesFormatter}
          configHeadersTable={configHeaders}
        />
      </div>
    );
  }

  @bind
  private renderNamesFormatter(field: string, row: IResource & any) {
    if (field === 'is_followme') {
      if (!row[field]) {
        // return <div className={b('circle', { red: true })} />;
        return <span>Нет</span>;
      } else {
        // return <div className={b('circle', { green: true })} />;
        return <span>Да</span>;
      }
    }
    return row[field];
  }


}
export { SNMPData };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(SNMPData);
