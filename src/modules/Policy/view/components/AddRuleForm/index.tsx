import * as React from 'react';
import {block} from 'bem-cn';

import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {ISelectTimeFieldProps, SelectTimeField} from 'shared/view/components';
import {Button, Checkbox, CheckboxMultiselect, Dropdown, ICheckboxProps, IDropdownProps} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy, IRuleGroup} from 'shared/types/policy';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {actionsConfig} from '../../../configs';
import {
  convertDataForMultiselect,
  convertRuleActionsToOptionData,
  getHoursFromMask,
  getIntervalDaysFromMask,
} from 'shared/helpers/formatData';

import './style.styl';
import i18next from "i18next";

interface IOwnProps {
  userGroups: IRuleGroup[];
  printerGroups: IRuleGroup[];
  onCancel(): void;
  onAdd(): void;
}

interface IStateProps {
  days: string;
  hours: string;
  userGroupsForm: string[];
  printerGroupsForm: string[];
}

const selector = formValueSelector('add_rules');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    days: selector(state, 'days') as string,
    hours: selector(state, 'hours') as string,
    userGroupsForm: selector(state, 'usergroups') as string[],
    printerGroupsForm: selector(state, 'printergroups') as string[],
  };
}

const b = block('add-rule');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'add_rules',
  validate,
})

class AddRuleForm extends React.PureComponent<TypeFormProps, {}> {

  public render() {
    const { invalid, pristine, error, days, hours } = this.props;
    const { userGroupsForm, printerGroupsForm } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('groups-wrapper')}>
          <Field
            label={i18next.t('AddRuleForm.printergroups')}
            name="printergroups"
            value={printerGroupsForm}
            component={this.renderPrinterGroups}
          />
          <Field
            label={i18next.t('AddRuleForm.usergroups')}
            name="usergroups"
            value={userGroupsForm}
            component={this.renderUserGroups}
          />
        </div>
        {/*<Field label="Наименование*" name="name" component={this.renderInputField} type="text"/>*/}
        <Field
          label={i18next.t('AddRuleForm.days')}
          name="days"
          format={this.formatDay}
          value={days}
          component={this.renderDaysField}
        />
        <Field
          abel={i18next.t('AddRuleForm.hours')}
          name="hours"
          format={this.formatHours}
          value={hours}
          component={this.renderHoursField}
        />
        <Field label={i18next.t('AddRuleForm.action')} name="action" component={this.renderActionField}/>
        <Field name="alert" component={this.renderCheckbox} type="checkbox"/>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddRuleForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddRuleForm.add')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private formatDay(value: string[]) {
    if (value) {
      return getIntervalDaysFromMask(value);
    }
  }

  @bind
  private formatHours(value: number[]) {
    if (value) {
      return getHoursFromMask(value);
    }
  }

  @bind
  private renderUserGroups(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { userGroups, userGroupsForm } = this.props;
    return (
      <CheckboxMultiselect
        {...field}
        values={convertDataForMultiselect(userGroups)}
        title={field.label}
        selectedValues={userGroupsForm ? userGroupsForm : []}
        onChange={this.onChangeMultiCheckbox.bind(this, field.input.onChange, field.input.name)}
      />
    );
  }

  @bind
  private renderPrinterGroups(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { printerGroups, printerGroupsForm } = this.props;
    return (
      <CheckboxMultiselect
        {...field}
        values={convertDataForMultiselect(printerGroups)}
        title={field.label}
        selectedValues={printerGroupsForm ? printerGroupsForm : []}
        onChange={this.onChangeMultiCheckbox.bind(this, field.input.onChange, field.input.name)}
      />
    );
  }

  @bind
  private renderCheckbox(field: WrappedFieldProps<{}> & ICheckboxProps) {
    return (
      <Checkbox
        {...field}
        {...field.input}
        label={i18next.t('AddRuleForm.alert')}
      />
    );
  }

  @bind
  private renderActionField(field: WrappedFieldProps<{}> & IDropdownProps) {
    return (
      <Dropdown
        {...field}
        {...field.input}
        source={convertRuleActionsToOptionData(actionsConfig)}
      />
    );
  }

  @bind
  private renderDaysField(field: WrappedFieldProps<{}> & ISelectTimeFieldProps) {
    const { days } = this.props;
    return (
      <SelectTimeField
        key={0}
        {...field}
        {...field.input}
        //daysCode={days}
        typeTime="days"
        onChange={this.onChangeDayField.bind(this, field.input.onChange)}
      />
    );
  }

  @bind
  private renderHoursField(field: WrappedFieldProps<{}> & ISelectTimeFieldProps) {
    const { hours } = this.props;
    return (
      <SelectTimeField
        key={1}
        {...field}
        {...field.input}
        //hoursCode={hours}
        typeTime="hours"
        onChange={this.onChangeHoursField.bind(this, field.input.onChange)}
      />
    );
  }

  // @bind
  // private renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
  //   const { touched, error } = field.meta;
  //   return (
  //     <TextInput
  //       {...field.input}
  //       {...field}
  //       error={touched && error ? error : false}
  //     />
  //   );
  // }

  @bind
  private onChangeMultiCheckbox(reduxFormChange: React.EventHandler<any>, name: string, value: string) {
    const { userGroupsForm, printerGroupsForm } = this.props;
    const groups = name === 'usergroups' ? userGroupsForm : printerGroupsForm;
    const copyGroups = [...groups];
    if (copyGroups.includes(value)) {
      const index = copyGroups.indexOf(value);
      copyGroups.splice(index, 1);
    } else {
      copyGroups.push(value);
    }
    reduxFormChange(copyGroups);
  }

  @bind
  private onChangeDayField(reduxFormChange: React.EventHandler<any>, daysCode: string) {
    reduxFormChange(daysCode);
  }

  @bind
  private onChangeHoursField(reduxFormChange: React.EventHandler<any>, hoursCode: string) {
    reduxFormChange(hoursCode);
  }

  @bind
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    
    this.props.onAdd(); // Обработчик добавления
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddRuleForm };
export default connect<{}, {}, IOwnProps >(mapStateToProps, {})(AddRuleForm);
