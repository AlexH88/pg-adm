import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {IReduxState, IReport} from 'shared/types/app';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, IRadioGroupProps, RadioGroup, Checkbox, ICheckboxProps} from 'shared/view/elements';
import './ReportReceiptForm.styl';
import {validate} from 'shared/helpers/validators/validateReportCreation';
import DatePickerComponent from './DataPicker';
import injectResource from 'shared/helpers/injectResource';
import {actions} from '../../redux';
//import StatefulDropdown from 'shared/view/components/StatefulDropdown';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  roleTypes: any;
  settingsData: any;
  settingsStore: any;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  setSettingsChart: typeof actions.setSettingsChart;
}

const b = block('edit-operators');

type IFormProps = FormProps<IReport, IOwnProps, {}> & IOwnProps&IStateProps&IDispatchProps ;

function mapStateToProps(state: IReduxState): IStateProps {

  const settingsData: any = state.form || null;
  const settingsStore: any = state.status.settings || null;

  return {
    roleTypes: "processedSource",
    settingsData: settingsData,
    settingsStore: settingsStore
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: injectResource('reports', actions.switchModalStatus),
    setSettingsChart: injectResource('reports', actions.setSettingsChart),
  }, dispatch);
}

@reduxForm<IReport, IOwnProps, {}>({
  form: 'editReport',
  validate,
})

class ReportReceiptForm extends React.PureComponent<IFormProps , {}> {

  public componentDidMount (){
    const initObj = {
      startDate: new Date(),
      endDate: new Date(),
      enabled: false,
      period: 'DAY'
    }
    const { settingsStore } = this.props;
    if(settingsStore) {
      initObj.period = settingsStore.period
      if(settingsStore.fuulTime) {
        initObj.enabled = true
      } else {
        initObj.startDate = new Date(settingsStore.startDate)
        initObj.endDate = new Date(settingsStore.endDate)
      }
      this.props.initialize(initObj);
    } else {
      this.props.initialize(initObj);
    }
  }

  public render() {
    const { invalid, pristine, error } = this.props;

    return (
      <form onSubmit={this.handleSubmit} className={b()} >

        <label htmlFor="startDate">{i18next.t('Report.dateFrom')}</label>
        <Field
          id="startDate"
          name="startDate"
          component={this._renderField}
          type="date"
        />

        <label htmlFor="endDate">{i18next.t('Report.dateTo')}</label>
        <Field
          id="endDate"
          name="endDate"
          component={this._renderField}
          type="date"
        />

        <Field
          label="За все время"
          name="enabled"
          component={this._renderCheckboxField}
          type="checkbox"
        />

        <Field
          name="period"
          values={[
            { value: 'DAY', label: 'По дням' },
            { value: 'WEEK', label: 'По неделям' },
            { value: 'MONTH', label: 'По месяцам' },
          ]}
          defaultValue="MONTH"
          component={this._renderRadioGroupField}
        />

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Применить"
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
    private _renderField(field: any) {
    const { touched, error } = field.meta;
    const { settingsStore } = this.props;
//    console.log('settingsStore', settingsStore)
//    console.log('date', field.input)

    if(settingsStore) {

    }

    return (
      <DatePickerComponent
        {...field.input}
        {...field}
        error={error}
      />
    );
  }

  @bind
  private _renderRadioGroupField(field: WrappedFieldProps<{}>&IRadioGroupProps) {
    return (
      <RadioGroup
        {...field.input}
        {...field}
      />
    );
  }

  @bind
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
      <div className={b('checkbox-wrapper')}>
        <Checkbox
          {...field.input}
          {...field}
        />
      </div>
    );
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const settings = {
      startDate: this.props.settingsData.editReport.values.startDate,
      endDate: this.props.settingsData.editReport.values.endDate,
      fuulTime: this.props.settingsData.editReport.values.enabled || false,
      period: this.props.settingsData.editReport.values.period || 'MONTH',
    }

    this.props.setSettingsChart(settings);
    this.props.switchModalStatus({ status: false, mode: '' });
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { ReportReceiptForm };
export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(ReportReceiptForm);
