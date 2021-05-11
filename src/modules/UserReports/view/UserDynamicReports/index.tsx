import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../../redux';
import {Line} from 'react-chartjs-2';

import './style.styl';
import {actions as ShowResourceActions} from "features/showResource/redux/actions";
import {formatTimeReport, initialIntervalFilter, initialTypeFilter} from "../../namespace";

import SelectFilter from 'shared/view/components/SelectFilter';
import {
  initAddFilters,
  initFilters,
  onChangeFilter,
  onChooseFilter,
  setCheckedIntervalFilter,
  setCheckedTypeFilter
} from 'features/filterResource/redux/actions/communication'
import injectResource from 'shared/helpers/injectResource';

import {FilterSelect, Modal, SelectedFilters} from 'shared/view/components';

import Calendar from 'shared/view/components/Calendar/CalendarWithRangeProps';
// import { ControlButtons, AddReportForm, AddRegularForm } from '../components';
import {AddRegularForm, AddReportForm} from '../components';
import ControlButtons from '../components/ControlButtons/index';
import {address} from 'shared/api/HttpActions';
import ProgressBar from 'react-toolbox/lib/progress_bar';

interface IDispatchProps {
  getChartData: any;
  getUserTimeReports: typeof actions.getUserTimeReports;
  loadCurrentOperator: typeof ShowResourceActions.loadCurrentOperator;
  setCheckedTypeFilter: any;
  setCheckedIntervalFilter: any;
  initFilters: any;
  initAddFilters: any;
  onChooseFilter: any;
  onChangeFilter: any;
  // -------------------------------
  switchPdfModal: typeof actions.switchPdfModal;
  switchReportModal: typeof actions.switchReportModal;
  switchRegularModal: typeof actions.switchRegularModal;
  startSaveRegularForm: typeof actions.startSaveRegularForm;
  sendRegularForm: typeof actions.sendRegularForm;
  startSaveReportForm: typeof actions.startSaveReportForm;
  sendTimeReportForm: typeof actions.sendTimeReportForm;
}

interface IStateProps {
  userDynamicReportData: any;
  typeFilter: any;
  filterConfigs: any;
  intervalFilter: any;
  addFilters: any;
  // -------------------------------
  showReportModal: boolean;
  showRegularModal: boolean;
  showReportSpinner: boolean;
  showPdfModal: boolean;
  pdfData: any;
  currentOperator: any;
}

interface ICheckedType {
  name: string;
  label: string
}

type Props = IDispatchProps & IStateProps;

export const dynamicResource: string = 'user_timereports';
const initialAddFilters = [
  {name: "usergroup", view: "По группе пользователей", type: "multi_filter"},
  {name: "printer", view: "По имени принтера", type: "multi_filter"},
  {name: "printergroup", view: "По группе принтеров", type: "multi_filter"},
];
const antiFilters = [
  initialAddFilters[1].name,
  initialAddFilters[2].name
]

function mapState(state: any): IStateProps {
  const { showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner } = state.userReports;
  const currentOperator: any = state.showResource.currentOperator || {};
  return {
    userDynamicReportData: state.userReports.userDynamicReportData,
    typeFilter:            state.filterResource[dynamicResource].type_filter,
    intervalFilter:        state.filterResource[dynamicResource].interval_filter,
    filterConfigs:         state.filterResource[dynamicResource].filterConfigs,
    addFilters:            state.filterResource[dynamicResource].filters,
    currentOperator: currentOperator.access_rules,
    showReportModal,
    showRegularModal,
    showPdfModal,
    showReportSpinner,
    pdfData
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    getChartData: actions.switchReportModal,
    getUserTimeReports: actions.getUserTimeReports,
    loadCurrentOperator: ShowResourceActions.loadCurrentOperator,
    setCheckedTypeFilter: injectResource(dynamicResource, setCheckedTypeFilter),
    setCheckedIntervalFilter: injectResource(dynamicResource, setCheckedIntervalFilter),
    initFilters: injectResource(dynamicResource, initFilters),
    initAddFilters: injectResource(dynamicResource, initAddFilters),
    onChooseFilter: injectResource(dynamicResource, onChooseFilter),
    onChangeFilter: injectResource(dynamicResource, onChangeFilter),
    //
    switchReportModal: actions.switchReportModal,
    switchPdfModal: actions.switchPdfModal,
    switchRegularModal: actions.switchRegularModal,
    sendRegularForm: injectResource(dynamicResource, actions.sendRegularForm),
    startSaveReportForm: actions.startSaveReportForm,
    sendTimeReportForm: injectResource(dynamicResource, actions.sendTimeReportForm),
    startSaveRegularForm: injectResource(dynamicResource, actions.startSaveRegularForm)
  }, dispatch);
}

const b = block('time-reports');

const findChecked = (arr: any[]) => {
  let result: ICheckedType = { name: '', label: ''};
  arr.forEach((item)=>{
    if (item.isChecked) {
      result.name = item.name;
      result.label = item.label;
    }
  });
  return result;
}

class UserDynamicReports extends React.PureComponent<Props, {}> {

  componentDidMount(){
    const { getUserTimeReports, typeFilter, intervalFilter, initFilters, initAddFilters, addFilters, loadCurrentOperator  } = this.props;
    if (typeFilter == undefined && intervalFilter == undefined ) {
      initFilters(initialTypeFilter, initialIntervalFilter);
    }
    if (addFilters.length == 0) {
      initAddFilters(initialAddFilters);
    }

    getUserTimeReports(intervalFilter == undefined ? findChecked(initialIntervalFilter).name : findChecked(intervalFilter).name);
    loadCurrentOperator();
  }

  public render() {
    const label = "Отчеты > Динамические > По пользователям";
    const {userDynamicReportData, typeFilter, setCheckedTypeFilter, filterConfigs, intervalFilter, addFilters,
      startSaveRegularForm, onChooseFilter, currentOperator = {}, showReportSpinner } = this.props;
    let checkedType: any = typeFilter != undefined ? findChecked(typeFilter): findChecked(initialTypeFilter);
    let checkedInterval: any = intervalFilter != undefined ? findChecked(intervalFilter): findChecked(initialIntervalFilter);
    let formatedData: any = userDynamicReportData.length == 0 ? [] : formatTimeReport(userDynamicReportData, checkedType.name, checkedInterval.name, 'login');

    const { showRegularModal,  sendRegularForm, sendTimeReportForm, showReportModal, pdfData,
           switchPdfModal, showPdfModal,  switchRegularModal, switchReportModal } = this.props;
    // const {startSaveRegularForm, currentOperator = {}} = this.props;

    return (
      <div className={b()}>
          <div className={b('addfilters-outer')} >
          {label ? <div className={b('label')}>{
            label.split('>').map((item, index) => {
              return (
                <span key={index}>{index !== 0 ? <span className="big-dot">{/*&#11825;*/}&#903;</span> : null}{item}</span>
              )
            })
          }</div> : null}

          <FilterSelect
            headers={ addFilters }
            onChange={onChooseFilter}
            disabledValidator={this.filterDisabledValidator}
          />

          <SelectedFilters
            onChooseFilter={this.reloadAddFilters}
            value={filterConfigs}
            headers={addFilters}
            onChangeFilter={this.addFilterToFilterConfigs}
            acceptFilter={()=>undefined}
          />
        </div>

      <div className={b('outer')}>
        <SelectFilter
          label='Содержимое'
          value={checkedType.name}
          type='text'
          source={typeFilter}
          acceptFilter={()=>undefined}
          onChange={(val)=>setCheckedTypeFilter(val)}
         />
        <Calendar
          label='Временной интервал'
          onChange={(dateObj)=>this.addFilterToFilterConfigs('output_time', dateObj )}
          acceptFilter={()=>undefined}
          onRemove={()=>this.addFilterToFilterConfigs('output_time', undefined)}
          range={filterConfigs['output_time'] ? filterConfigs['output_time'] : { from: Math.floor((new Date().getTime()/1000)), to: Math.floor((new Date().getTime()/1000)) } }
        />
        <SelectFilter
          label='Шаг'
          value={checkedInterval.name}
          type='text'
          source={intervalFilter}
          acceptFilter={()=>undefined}
          onChange={(val)=>this.reloadIntervalFilter(val)}
         />
      </div>
      <div className='chart-canvas'>
        { formatedData.length == 0 ? null : <Line data={formatedData} width={1000} height={400}/> }
      </div>

      <Modal
        isOpen={showReportModal}
        title="Сформировать отчет"
        onClose={switchReportModal}
      >
        {
          showReportSpinner ?
          <ProgressBar />
          :
          // @ts-ignore
          <AddReportForm
            labelName="Количество пользователей"
            onCancel={switchReportModal}
            onSave={sendTimeReportForm.bind(null, dynamicResource)}
            isDynamic={true}
          />
        }
      </Modal>

      <Modal
        isOpen={showPdfModal}
        title="Отчет PDF"
        onClose={switchPdfModal}
      >
        <br/>
        <a onClick={this.openReport} className={b('link')} type="application/pdf" href={pdfData}>Открыть</a>
      </Modal>

      <Modal
        isOpen={showRegularModal}
        title="Сохранить в регулярные"
        onClose={switchRegularModal}
      >
      // @ts-ignore
        <AddRegularForm
          type="user_timereports"
          data={dynamicResource}
          labelName="Пользователи"
          onCancel={switchRegularModal}
          onSave={sendRegularForm.bind(null, dynamicResource)}
        />
      </Modal>
      {
        currentOperator['reports.pdf'] ?
        <ControlButtons
          onClickReport={switchReportModal}
          onClickRegular={startSaveRegularForm}
        />
          :
        <ControlButtons
          onClickRegular={startSaveRegularForm}
        />
      }
      </div>
    );
  }

  @bind
  private addFilterToFilterConfigs(qsParam: string, value: any) {
    const {onChangeFilter, getUserTimeReports, intervalFilter} = this.props;
    onChangeFilter(qsParam , value);
    getUserTimeReports(findChecked(intervalFilter).name);
  }

  @bind
  private reloadIntervalFilter(checked: any) {
    const {setCheckedIntervalFilter, getUserTimeReports} = this.props;
    setCheckedIntervalFilter(checked);
    getUserTimeReports(checked);
  }

  @bind
  private reloadAddFilters(value: string, isCheck: boolean) {
    const { intervalFilter, onChooseFilter, getUserTimeReports } = this.props;
    onChooseFilter(value, isCheck);
    getUserTimeReports(findChecked(intervalFilter).name);
  }

  @bind
  private filterDisabledValidator(filtersItem: any): string[] {
    let disabledNames: string[] = []
    const printerHeader = filtersItem.find((header: any) => header.name === antiFilters[0]);
    const printerGroupHeader = filtersItem.find((header: any) => header.name === antiFilters[1]);

    if (printerGroupHeader && printerHeader && printerHeader.isConnected) {
      disabledNames.push(printerGroupHeader.name);
    }
    if (printerGroupHeader && printerHeader && printerGroupHeader.isConnected) {
      disabledNames.push(printerHeader.name);
    }

    return disabledNames;
  }

  @bind
  private openReport(event: any) {
    event.preventDefault();
    const { pdfData } = this.props;
    window.open(`${address}/api/report.pdf/${pdfData}`);
    this.props.switchPdfModal();
  }

}

export { UserDynamicReports };
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(UserDynamicReports);
