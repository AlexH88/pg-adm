import * as React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {block} from 'bem-cn';
import {selectors as ShowResourceSelectors, ShowResource} from 'features/showResource';
import {FilterResource, Namespace as FilterResourseNS} from 'features/filterResource';
import {IAggregate, IConfigHeaders, IReduxState, IResource} from 'shared/types/app';
import {actions} from '../../redux';
import {getAggregates, getHeadersConfig} from 'shared/helpers/getConfig';
import injectResource from 'shared/helpers/injectResource';
import './style.styl';
import i18next from "i18next";
import Switch from 'react-toolbox/lib/switch';
import theme from './theme.styl';
import {Icon} from 'shared/view/elements';
import {generateIdElement} from 'shared/helpers';

interface IStateProps {
  configHeaders: IConfigHeaders;
  configAggregates: IAggregate[];
  headers: FilterResourseNS.IHeader[];
  showRemoveModal: boolean;
  tryDeletingItemId: number | string;
  currentOperator: any;
}

interface IDispatchProps {
  tryDeleteReader: typeof actions.tryDeleteResource;
  acceptDeleteReader: typeof actions.acceptDeleteResource;
  switchRemoveModal: typeof actions.switchRemoveModal;
  toggleWebInterface: typeof actions.toggleWebInterface;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const { showRemoveModal, tryDeletingItemId } = state.printers;
  const currentOperator: any = state.showResource.currentOperator || {};

  return {
    currentOperator: currentOperator.access_rules,
    configHeaders: getHeadersConfig('reader', state),
    configAggregates: getAggregates('reader', state),
    headers: ShowResourceSelectors.getHeaders(state, 'reader'),
    showRemoveModal,
    tryDeletingItemId,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    tryDeleteReader: injectResource('reader', actions.tryDeleteResource),
    acceptDeleteReader: injectResource('reader', actions.acceptDeleteResource),
    switchRemoveModal: actions.switchRemoveModal,
    toggleWebInterface: injectResource('reader', actions.toggleWebInterface)
  }, dispatch);
}

const b = block('reader');

class reader extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  [x: string]: any;

  public render() {
    const { configHeaders, configAggregates, headers } = this.props;
    return (
      <div className={b()}>
        <FilterResource
          configs={configHeaders}
          resource="reader"
          label={i18next.t('Rfidreaders.header')}
          noDisplaySelect
        />
        <ShowResource
          resource="reader"
          headers={headers}
          pullingData
          configs={{
            sort: {
              by: 'uid',
              order: 'asc',
            },
          }}
          aggregateStats={configAggregates}
          actionsFormatter={this.renderActionsFormatter}
          headersFormatter={this.renderCellFormatter}
          configHeadersTable={configHeaders}
        />
      </div>
    );
  }
  /*
  @bind
  private tryDeleteReader(id: number) {
    const { tryDeleteReader, switchRemoveModal } = this.props;
    tryDeleteReader(id);
    switchRemoveModal();
  }

  @bind
  private onAcceptDeleteReader() {
    const { acceptDeleteReader, tryDeletingItemId } = this.props;
    acceptDeleteReader(tryDeletingItemId);
  }
  */
  @bind
  private renderActionsFormatter(field: string, row: IResource & any): JSX.Element | null {
    console.log('row', row)

    if (field === 'actions') {
      return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          {
            row.printerName !== 'Не назначено' 
            ?
              <Switch
                name="web"
                theme={theme}
                checked={row.web}
                onChange={this.props.toggleWebInterface.bind(this, row.id, !row.web)}
              />
            : null
          }

          { row.web ? <a target="_blank" href={"http://" + row.ip}><Icon key={0} icon="pen" onClick={null} title="Редактировать" idHash={`rfidreaders-pen-${generateIdElement()}`}/></a> : null }

          {
            row.active
            ?
              <span className={b('circle', { green: true })} />
            :
              <span className={b('circle', { red: true })} />
          }
        </div>
      );
    }
    return null;
  }

  @bind
  private renderCellFormatter(field: string, row: IResource & any) {
    return row[field];
  }
}
export { reader };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(reader);
