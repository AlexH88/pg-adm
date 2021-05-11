import * as React from 'react';
import {block} from 'bem-cn';

import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {ISelectTimeFieldProps, SelectTimeField} from 'shared/view/components';
import {Button, CheckboxMultiselect, Dropdown, ICheckboxProps, IDropdownProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import * as actions from './../../../redux/actions/communication';
import {convertDataForMultiselect, getHoursFromMask, getIntervalDaysFromMask,} from 'shared/helpers/formatData';
import i18next from "i18next";
import './style.styl';
import {bindActionCreators} from 'redux';

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  days: string;
  hours: string;
  hostGroups: any[];
  addAgentPolicies: any;
  id: any;
  val: any;
}

const selector = formValueSelector('add_agent_policies');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    days: selector(state, 'days') as string,
    hours: selector(state, 'hours') as string,
    addAgentPolicies: selector(state, 'hostgroups') as string[],
    id: selector(state, 'id') as string[],
    val: selector(state, 'value') as string[],
    hostGroups: state.policy.hostGroups,
  };
}

interface IDispatchProps {
  loadHostGroups: typeof actions.loadHostGroups;
  activateAgentPolicy: typeof actions.activateAgentPolicy;
}

function mapDispatchToProps(dispatch: any) {
  return bindActionCreators({
    loadHostGroups: actions.loadHostGroups,
    activateAgentPolicy: actions.activateAgentPolicy,
  }, dispatch);
}

const b = block('add-rule');

// function convertRuleActionsToOptionData(data: any): any[] {
//   return Object.keys(data).map((key: string) => ({ label: data[key], value: key }));
// }

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'add_agent_policies',
  validate,
})


class AddAgentPolicyForm extends React.PureComponent<TypeFormProps & IDispatchProps, {}> {

  public render() {
    const { invalid, pristine, error, days, hours } = this.props;
    const { addAgentPolicies, id /*, printerGroupsForm */ } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('groups-wrapper')}>
          <Field
            label={i18next.t('AddAgentPolicyForm.header')}
            name="hostgroups"
            value={addAgentPolicies}
            component={this.renderHostGroups}
          />
        </div>
        <Field
          label={i18next.t('AddAgentPolicyForm.name')}
          name="name"
          value={addAgentPolicies}
          component={this._renderInputField}
        />
        <Field
          label={i18next.t('AddAgentPolicyForm.days')}
          name="days"
          format={this.formatDay}
          value={days}
          component={this.renderDaysField}
        />
        <Field
          label={i18next.t('AddAgentPolicyForm.hours')}
          name="hours"
          format={this.formatHours}
          value={hours}
          component={this.renderHoursField}
        />
        <div style={{display: !id ? 'none' : 'block'}}>
          {/* <Button  className={b('activate')}
              isPrimary
              label="Активировать"
              onClick={this.handleActivate.bind(this, true)}
          />
          <Button
              label="Деактивировать"
              onClick={this.handleActivate.bind(this, false)}
          /> */}
          <Field label={i18next.t('AddAgentPolicyForm.action')} name="value" component={this.renderActionField} />
        </div>
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddAgentPolicyForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddAgentPolicyForm.save')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  handleActivate(state: boolean) {
    const {  activateAgentPolicy } = this.props;
    activateAgentPolicy(state);
  }

  @bind
  private renderActionField(field: WrappedFieldProps<{}> & IDropdownProps) {
    return (
      <Dropdown
        {...field}
        {...field.input}
        source={[{label: `${i18next.t('AddAgentPolicyForm.activates')}`, value: 'true'}, {label: `${i18next.t('AddAgentPolicyForm.deactivates')}`, value: 'false'}]}
      />
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
  private renderHostGroups(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { hostGroups, addAgentPolicies } = this.props;
    console.log('addAgentPolicies');
    console.log(addAgentPolicies);
    return (
      <CheckboxMultiselect
        {...field}
        values={convertDataForMultiselect(hostGroups)}
        title={field.label}
        selectedValues={addAgentPolicies ? addAgentPolicies : []}
        onChange={this.onChangeMultiCheckbox.bind(this, field.input.onChange, field.input.name)}
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
  private _renderInputField(field: WrappedFieldProps<{}> & any) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        error={touched && error ? error : false}
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

  @bind
  private onChangeMultiCheckbox(reduxFormChange: React.EventHandler<any>, name: string, value: any) {
    if (!1) console.log(name);
    const { addAgentPolicies } = this.props;
    const groups = addAgentPolicies || [];
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
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddAgentPolicyForm };
export default connect<{}, {}, IOwnProps >(mapStateToProps, mapDispatchToProps)(AddAgentPolicyForm);
