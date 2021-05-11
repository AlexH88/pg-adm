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
// import FilterResource from 'features/filterResource/view/FilterResource/FilterResource';
import {FilterSelect, Modal, SelectedFilters} from 'shared/view/components';

import Calendar from 'shared/view/components/Calendar/CalendarWithRangeProps';
import {address} from 'shared/api/HttpActions';
import ControlButtons from '../components/ControlButtons/index';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import {AddRegularForm, AddReportForm} from '../components';

interface IDispatchProps {
  getChartData: any;
  getUserGroupsTimeReports: typeof actions.getUserGroupsTimeReports;
  switchPdfModal: typeof actions.switchPdfModal;
  switchReportModal: any;
  startSaveRegularForm: typeof actions.startSaveRegularForm;
  loadCurrentOperator: typeof ShowResourceActions.loadCurrentOperator;
  setCheckedTypeFilter: any;
  setCheckedIntervalFilter: any;
  initFilters: any;
  initAddFilters: any;
  onChooseFilter: any;
  onChangeFilter: any;
  switchRegularModal: any;
  sendTimeReportForm: any;
  sendRegularForm: any;
}

interface IStateProps {
  userGroupsDynamicReportData: any; // ==================================================================== >>>
  typeFilter: any;
  filterConfigs: any;
  intervalFilter: any;
  addFilters: any;
  pdfData: any;
  currentOperator: any;
  showPdfModal: boolean;
  showRegularModal: boolean;
  showReportModal: boolean;
  showReportSpinner: boolean;
}

interface ICheckedType {
  name: string;
  label: string
}

type Props = IDispatchProps & IStateProps;

export const dynamicResource: string = 'user_groups_timereports';
const initialAddFilters = [
  {name: "printer", view: "По имени принтера", type: "multi_filter"},
  {name: "printergroup", view: "По группе принтеров", type: "multi_filter"},
];

const antiFilters = [
  initialAddFilters[0].name,
  initialAddFilters[1].name
]

function mapState(state: any): IStateProps {
  const { showReportModal, showRegularModal, showPdfModal, pdfData, showReportSpinner } = state.userReports;
  return {
    userGroupsDynamicReportData: state.userReports.userGroupsDynamicReportData,
    typeFilter:            state.filterResource[dynamicResource].type_filter,
    intervalFilter:        state.filterResource[dynamicResource].interval_filter,
    filterConfigs:         state.filterResource[dynamicResource].filterConfigs,
    addFilters:            state.filterResource[dynamicResource].filters,
    currentOperator: state.showResource.currentOperator && state.showResource.currentOperator.access_rules,
    pdfData,
    showPdfModal, showRegularModal, showReportModal, showReportSpinner
  };
}

function mapDispatch(dispatch: any): IDispatchProps {
  return bindActionCreators({
    getChartData: actions.switchReportModal,
    switchPdfModal: actions.switchPdfModal,
    sendRegularForm: injectResource(dynamicResource, actions.sendRegularForm),
    switchRegularModal: actions.switchRegularModal,
    sendTimeReportForm: injectResource(dynamicResource, actions.sendTimeReportForm),
    switchReportModal: actions.switchReportModal,
    startSaveRegularForm: actions.startSaveRegularForm,
    getUserGroupsTimeReports: actions.getUserGroupsTimeReports,
    loadCurrentOperator: ShowResourceActions.loadCurrentOperator,
    setCheckedTypeFilter: injectResource(dynamicResource, setCheckedTypeFilter),
    setCheckedIntervalFilter: injectResource(dynamicResource, setCheckedIntervalFilter),
    initFilters: injectResource(dynamicResource, initFilters),
    initAddFilters: injectResource(dynamicResource, initAddFilters),
    onChooseFilter: injectResource(dynamicResource, onChooseFilter),
    onChangeFilter: injectResource(dynamicResource, onChangeFilter),
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

class UserGroupsDynamicReports extends React.PureComponent<Props, {}> {

  componentDidMount(){
    const { getUserGroupsTimeReports, typeFilter, intervalFilter, initFilters, initAddFilters, addFilters, 
      showPdfModal, showRegularModal, showReportModal } = this.props; // ==================================================================== >>>
    if (typeFilter == undefined && intervalFilter == undefined ) {
      initFilters(initialTypeFilter, initialIntervalFilter);
    }
    if (addFilters.length == 0) {
      initAddFilters(initialAddFilters);
    }

    getUserGroupsTimeReports(intervalFilter == undefined ? findChecked(initialIntervalFilter).name : findChecked(intervalFilter).name); // ==================================================================== >>>
    const { loadCurrentOperator } = this.props;
    loadCurrentOperator();
  }

  public render() {
    const label = "Отчеты > Динамические > По группам пользователей";
    const {userGroupsDynamicReportData, typeFilter, setCheckedTypeFilter, filterConfigs, intervalFilter, addFilters,
      currentOperator = { }, switchReportModal, startSaveRegularForm, onChooseFilter, showReportModal, showReportSpinner,
       showPdfModal, switchPdfModal, pdfData, switchRegularModal, sendTimeReportForm,
       sendRegularForm, showRegularModal } = this.props;
    let checkedType: any = typeFilter != undefined ? findChecked(typeFilter): findChecked(initialTypeFilter);
    let checkedInterval: any = intervalFilter != undefined ? findChecked(intervalFilter): findChecked(initialIntervalFilter);
    let formatedData: any = userGroupsDynamicReportData.length == 0 ? [] : formatTimeReport(userGroupsDynamicReportData, checkedType.name, checkedInterval.name, 'group_name'); // ==================================================================== >>>

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
            value={filterConfigs}
            headers={addFilters}
            onChangeFilter={this.addFilterToFilterConfigs}
            onChooseFilter={this.reloadAddFilters}
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
            labelName={"Количество групп пользователей" as any}
            onCancel={switchReportModal as any}
            onSave={sendTimeReportForm.bind(null, dynamicResource) as any}
            isDynamic={true as any}
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
          type="user_groups_timereports"
          data={dynamicResource}
          labelName="Группы пользователей"
          onCancel={switchRegularModal}
          onSave={sendRegularForm.bind(null, dynamicResource)}
        />
      </Modal>
      <div className='chart-canvas'>
      { formatedData.length == 0 ? null : <Line data={formatedData} width={1000} height={400}/> }
      </div>

      {
        currentOperator['reports.pdf'] ?
        <ControlButtons
          onClickReport={switchReportModal}
          onClickRegular={switchRegularModal}
        />
          :
        <ControlButtons
          onClickRegular={switchRegularModal}
        />
      }

      </div>
    );
  }

  @bind
  private addFilterToFilterConfigs(qsParam: string, value: any) {
    const {onChangeFilter, getUserGroupsTimeReports, intervalFilter} = this.props;
    onChangeFilter(qsParam , value);
    getUserGroupsTimeReports(findChecked(intervalFilter).name);
  }

  @bind
  private openReport(event: any) {
      const { pdfData } = this.props;
      event.preventDefault();
      window.open(`${address}/api/report.pdf/${pdfData}`);
      this.props.switchPdfModal();
  }

  @bind
  private reloadIntervalFilter(checked: any) {
    const {setCheckedIntervalFilter, getUserGroupsTimeReports} = this.props;
    setCheckedIntervalFilter(checked);
    getUserGroupsTimeReports(checked);
  }

  @bind
  private reloadAddFilters(value: string, isCheck: boolean){
    const { intervalFilter, onChooseFilter, getUserGroupsTimeReports } = this.props;
    onChooseFilter(value, isCheck);
    getUserGroupsTimeReports(findChecked(intervalFilter).name);
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

}

export { UserGroupsDynamicReports }; // ==================================================================== >>>
export default connect<IStateProps, IDispatchProps, {} >(mapState, mapDispatch)(UserGroupsDynamicReports); // ==================================================================== >>>
