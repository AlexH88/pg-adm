import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {IReduxState, IReport} from 'shared/types/app';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, IRadioGroupProps, RadioGroup} from 'shared/view/elements';
import './ReportReceiptForm.styl';
import {validate} from 'shared/helpers/validators/validateReportCreation';
import DatePickerComponent from './DataPicker';
import injectResource from 'shared/helpers/injectResource';
import {actions} from '../../redux';
//import StatefulDropdown from 'shared/view/components/StatefulDropdown';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
//  onSave(): void;
  typeReport: string;
}

interface IStateProps {
  roleTypes: any;
  reportData: any;
}

interface IDispatchProps {
  switchModalStatus: typeof actions.switchModalStatus;
  setSettingsReport: typeof actions.setSettingsReport;
}

const b = block('edit-operators');

type IFormProps = FormProps<IReport, IOwnProps, {}> & IOwnProps&IStateProps&IDispatchProps ;

function mapStateToProps(state: IReduxState): IStateProps {

  const reportData: any = state.form || null;

  return {
    roleTypes: "processedSource",
    reportData: reportData
  };
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    switchModalStatus: injectResource('reports', actions.switchModalStatus),
    setSettingsReport: injectResource('reports', actions.setSettingsReport),
  }, dispatch);
}

@reduxForm<IReport, IOwnProps, {}>({
  form: 'editReport',
  validate,
})

class ReportReceiptForm extends React.PureComponent<IFormProps , {}> {

  public componentDidMount (){
    this.props.initialize({startDate: new Date(), endDate: new Date()});
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const settings = {
      startDate: this.props.reportData.editReport.values.startDate,
      endDate: this.props.reportData.editReport.values.endDate,
      typeReport: this.props.typeReport,
    }

    this.props.setSettingsReport(settings);
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { ReportReceiptForm };
export default connect<IStateProps, IDispatchProps, {}>(mapStateToProps, mapDispatchToProps)(ReportReceiptForm);
