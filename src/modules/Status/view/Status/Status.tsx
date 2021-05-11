import * as React from 'react';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from '../../namespace';
import {bindActionCreators} from 'redux';
import {actions} from 'features/showResource/redux';
import {actions as thisActions} from '../../redux';
import './Status.styl';
import CheckboxMultiselect from "shared/view/elements/CheckboxMultiselect/CheckboxMultiselect";
import ChartsBoard from './ChartsBoard';
import {connectAllCharts, getCleanValues, getSelectedValues} from '../../helpers/viewHelpers'
import {Modal} from 'shared/view/components';
import ReportReceiptForm from '../ReportReceiptForm/ReportReceiptForm';
import i18next from "i18next";

interface IDispatchProps {
  loadCurrentOperator: typeof actions.loadCurrentOperator;
  sendCurrentCharts: typeof thisActions.sendCurrentCharts;
  toggleChart: typeof thisActions.toggleChart;
  getChartsData: any;
  getTopUsersFromGroup: any;
  setReplacedChart: any;
  getPrintedPages: any;
  getDynamicGrow: any;
  switchModalStatus: any;
}

export interface IValue {
  title: string;
  value: string;
  isConnected?: boolean
}

interface IStatus {
  currentCharts: any;
  chartsData: any;
}

interface IStateProps {
  status: IStatus;
  showModal: boolean;
  replaced: string;
}

function mapStateToProps({ status }: IReduxState | any): IStateProps {
  let replaced = 'DAY';
  if(status.hasOwnProperty('settings')){
    if(status.settings != null){
      replaced = status.settings.period;
    }
  }

  return {
    status,
    showModal: status.showModal,
    replaced: replaced,
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    loadCurrentOperator: actions.loadCurrentOperator,
    sendCurrentCharts: thisActions.sendCurrentCharts,
    toggleChart: thisActions.toggleChart,
    getChartsData: thisActions.getChartsData,
    getTopUsersFromGroup: thisActions.getTopUsersFromGroup,
    setReplacedChart: thisActions.setReplacedChart,
    getPrintedPages: thisActions.getPrintedPages,
    getDynamicGrow: thisActions.getDynamicGrow,
    switchModalStatus: thisActions.switchModalStatus,
  }, dispatch);
}

// ----------------------------------------------

const initialCharts: IValue[] = [
  {value: 'top_users', title: 'Самые печатающие пользователи'},
  {value: 'top_groups_users', title: 'Самые печатающие группы пользователей'},
  {value: 'top_groups', title: 'Самые печатающие группы принтеров'},
  {value: 'top_printers', title: 'Самые используемые принтеры'},
  {value: 'printed_pages', title: 'Распечатанные страницы'},
  {value: 'printed_groups_pages', title: 'Распечатанные страницы по группам'},
];

// ----------------------------------------------

class Status extends React.PureComponent<IDispatchProps & IStateProps, {}> {
  public componentWillMount() {
    const { loadCurrentOperator, sendCurrentCharts, status, getChartsData, replaced } = this.props;
    const { currentCharts } = status;
    const printedPagesInterval = replaced !== undefined ? replaced : 'DAY';
//    const dynamicGrowInterval = replaced !== undefined ? replaced : 'DAY';

    loadCurrentOperator();

    if (currentCharts.length === 0) {
      sendCurrentCharts(connectAllCharts(initialCharts));
    }

    getChartsData(printedPagesInterval/*, dynamicGrowInterval*/);

  }

  public render() {
    const { status, toggleChart, getTopUsersFromGroup, setReplacedChart, getPrintedPages, getDynamicGrow, showModal, getChartsData, replaced } = this.props;
    const { currentCharts, chartsData } = status;

    const styleResource = {
      display: 'flex',
      marginTop: '15px'
    }

    const styleSelect = {
      display: 'flex',
      marginTop: '3px',
      marginLeft: '25px'
    }

    const styleSettings = {
      display: 'flex',
      cursor: 'pointer',
      color: 'rgb(158, 158, 158)',
      marginLeft: '15px'
    }

    return (
        <>

          <div>
            <div className="filter-resource" style={styleResource}>
              <div className="filter-resource__title">
                {
                  'Статус'.split('>').map((item, index) => {
                    return (
                      <span key={index}>{index !== 0 ? <span className="big-dot">&#903;</span> : null}{item}</span>
                    )
                  })
                }
              </div>
              <div style={styleSelect}>
                <CheckboxMultiselect
                  title={i18next.t('Status.selectChart')}
                  onChange={toggleChart}
                  values={getCleanValues(currentCharts)}
                  selectedValues={getSelectedValues(currentCharts)}
                />
                <div
                  style={styleSettings}
                  onClick={this.openModal}
                >
                  Настройки графиков
                </div>
              </div>
            </div>
          </div>

          { currentCharts.length !== 0 &&
            (
              <ChartsBoard
                currentCharts={currentCharts}
                chartsData={chartsData}
                getTopUsersFromGroup={getTopUsersFromGroup}
                setReplacedChart={setReplacedChart}
                replaced={replaced}
                getPrintedPages={getPrintedPages}
                getDynamicGrow={getDynamicGrow}
              />
            )
          }

          <Modal
            isOpen={showModal}
            title='Параметры графиков'
            onClose={this.closeModal}
          >
            <ReportReceiptForm
              onCancel={this.closeModal}
              onSave={getChartsData}
            />
          </Modal>

        </>
    );
  }

  @bind
  private closeModal(): void {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private openModal(): void {
    this.props.switchModalStatus({ status: true, mode: '' });
  }

}

export { Status };
export default connect<IStateProps, IDispatchProps, {} >(mapStateToProps, mapDispatchToProps)(Status);

