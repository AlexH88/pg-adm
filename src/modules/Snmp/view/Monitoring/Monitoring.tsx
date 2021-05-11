import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import injectResource from 'shared/helpers/injectResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import * as editUserGroups from 'features/editGroups';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import {IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {IAgregate} from 'modules/Users/namespace';
import './style.styl';
import {actions as printersActions} from 'modules/Printers/redux';

interface IStateProps {
  configHeaders: IConfigHeaders;
  headers: FilterResourseNS.IHeader[];
  cofigAggregates: IAgregate[];
  currentOperator: any;
}

interface IDispatchProps {
  onPrinterGroupsEdit: typeof editUserGroups.actions.groupsEdit;
  editPrinter: typeof printersActions.editResource;
  switchModalStatus: typeof printersActions.switchModalStatus;
  saveEditPrinter: typeof printersActions.saveEditPrinter;
  switchSyncModal: typeof printersActions.switchSyncModal;
  setEditPrintServerData: typeof printersActions.setEditPrintServerData;
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
    onPrinterGroupsEdit: injectResource('oid', editUserGroups.actions.groupsEdit),
    editPrinter: injectResource('snmp', printersActions.editResource),
    switchModalStatus: printersActions.switchModalStatus,
    saveEditPrinter: injectResource('snmp', printersActions.saveEditPrinter),
    switchSyncModal: injectResource('snmp', printersActions.switchSyncModal),
    setEditPrintServerData: injectResource('snmp', printersActions.setEditPrintServerData),
    test: function() { return { type: 'SNMP_MODULE:TEST'} }
  }, dispatch);
}

const b = block('printers');

class Monitoring extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public render() {
    const { configHeaders, headers, cofigAggregates } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="snmp"
          label="SNMP > Мониторинг"
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
        return <span>Нет</span>;
      } else {
        return <span>Да</span>;
      }
    }
    return row[field];
  }

}
export { Monitoring };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Monitoring);
