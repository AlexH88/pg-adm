import * as React from 'react';
import {block} from 'bem-cn';
import {ISyncData, TypesSyncingActions} from '../../../namespace';
import {Checkbox} from 'shared/view/elements';
import {actions} from '../../../redux';
import './style.styl';
import {ProgressBar} from "../../../../../shared/view/components/ProgressBar/ProgressBar";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';

// import Button from '../../../../../shared/view/elements/Button/index';

interface IOwnProps {
  data: ISyncData;
  type: TypesSyncingActions;
  onSelectItem: typeof actions.selectItemResource;
  selectedItems: string[];
  searchStr: string;
}

interface IStateProps {
  showPB: any;
  PBLoaded: any;
  syncError: any;
}

interface IDispatchProps {
  selectAllPrinters: typeof actions.selectAllPrinters;
}

function mapStateToProps(state: any): IStateProps {
  return {
    showPB: state.syncResource.showPB,
    PBLoaded: state.syncResource.PBLoaded,
    syncError: state.syncResource.syncError,
  }
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({
    selectAllPrinters: actions.selectAllPrinters,
  }, dispatch);
}

class SyncTable extends React.Component<IOwnProps & IStateProps & IDispatchProps, {}> {

  private b = block('sync-table');

  public render() {
    const b = this.b;
    const { data, type, onSelectItem, selectedItems, showPB, PBLoaded, syncError, searchStr } = this.props;
    const { selectAllPrinters } = this.props;
    const filterData = type === 'sync' ? data.sync : data.unsync;

    return (
      <div className={b('wrapper')}>
        <div className={b('select-all')}>
          <Checkbox
            disabled={!filterData.length}
            label="Выбрать все"
            onChange={selectAllPrinters.bind(null, { type, data: filterData, selectedItems })}
            checked={selectedItems.length === filterData.length}
          />
        </div>
        <div className={b()}>
          <div className={b('body')}>
            {
              searchStr ?
              filterData.map((printer: any, index: number) => {
                if(printer.name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1){
                  return (
                  <div key={index} className={b('row-wrapper')}>
                    <div  className={b('row')}>
                      <div className={b('cell')}>{printer.name}</div>
                      <div className={b('cell')}>
                        <Checkbox
                          label=""
                          onChange={onSelectItem.bind(this, printer.id, printer, type)}
                          checked={selectedItems.filter((item: any) => item.id === printer.id).length > 0}
                        />
                      </div>
                    </div>
                    {showPB[printer.name] && (
                      <ProgressBar
                        isLoaded={PBLoaded[printer.name]}
                      />
                    )}
                    {syncError[printer.name] && (
                      <span style={{color: 'red'}}>
                        {
                          type === 'sync'
                            ? 'Ошибка отмены синхронизации. Принтер не отвечает'
                            : 'Ошибка синхронизации. Принтер не отвечает'
                        }
                      </span>
                    )}
                  </div>
                  );
                }
              }) : 
              filterData.map((printer: any, index: number) => {
                return (
                <div key={index} className={b('row-wrapper')}>
                  <div  className={b('row')}>
                    <div className={b('cell')}>{printer.name}</div>
                    <div className={b('cell')}>
                      <Checkbox
                        label=""
                        onChange={onSelectItem.bind(this, printer.id, printer, type)}
                        checked={selectedItems.filter((item: any) => item.id === printer.id).length > 0}
                      />
                    </div>
                  </div>
                  {showPB[printer.name] && (
                    <ProgressBar
                      isLoaded={PBLoaded[printer.name]}
                    />
                  )}
                  {syncError[printer.name] && (
                    <span style={{color: 'red'}}>
                      {
                        type === 'sync'
                          ? 'Ошибка отмены синхронизации. Принтер не отвечает'
                          : 'Ошибка синхронизации. Принтер не отвечает'
                      }
                    </span>
                  )}
                </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}


export default connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(SyncTable);
