import * as React from 'react';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {
  Button,
  Checkbox,
  CheckboxMultiselect,
  ICheckboxProps,
  IDropdownProps,
  ITextInputProps,
  TextInput,
  IRadioGroupProps, 
  RadioGroup
} from 'shared/view/elements';
import {ISelectTimeFieldProps, SelectTimeField} from 'shared/view/components';
import MultiSelectField from 'shared/view/components/MultiSelectField';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import {getHoursFromMask, getIntervalDaysFromMask} from 'shared/helpers/formatData';
import './style.styl';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
  policyType?: 'time' | 'restriction' | 'backup' | 'watermark';
}

interface IStateProps {
  days: any;
  hours: any;
  documentFormatSet: any;
  userGroupsForm: string[];
  printerGroupsForm: string[];
  userGroups: any;
  printerGroups: any;
  initialValues: any;
}

function mapStateToProps(state: IReduxState): IStateProps {
  const {usergroups, printergroups} = state.showResource.short;


  let userGroups = usergroups.items.filter(item => {
    if(item.loginEnabled) {
      if(item.ldapSource && item.name.indexOf('[') < 0) {
        let prefix = '';
        prefix = `[${item.ldapSource.name}] ${item.name}`
        item.name = prefix
      }
      return true
    }
    return false
  })

  usergroups.items = userGroups

  const processSource = (source: any) => {
    let processedSource: any = {};
    if (source && source.items && source.items.length > 0) {
      const filteredSource = source.items;

      filteredSource.forEach((s: any) => {
        processedSource[s.id.toString()] = s.name;
      });
    }
    return processedSource;
  }
  return {
    days: formValueSelector('addPolicy')(state, 'days.days') as string[],
    hours: formValueSelector('addPolicy')(state, 'hours.hours') as number[],
    documentFormatSet: formValueSelector('addPolicy')(state, 'documentFormatSet.documentFormatSet') as string[],
    userGroupsForm: formValueSelector('addPolicy')(state, 'userGroups') as string[],
    printerGroupsForm: formValueSelector('addPolicy')(state, 'printerGroups') as string[],
    userGroups: processSource(usergroups),
    printerGroups: processSource(printergroups),
    initialValues: {
      'timePolicyType': 'PROHIBITION'
    }
  };
}

const b = block('add-policy');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'addPolicy',
  validate
})

class AddPolicyForm extends React.PureComponent<TypeFormProps, {}> {

  public render() {
    const { invalid, pristine, error, days, hours, documentFormatSet } = this.props;
    const { userGroupsForm, printerGroupsForm, policyType, userGroups, printerGroups } = this.props;

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label={i18next.t('AddPolicyForm.name')}
          name="name"
          component={this._renderInputField}
          type="text"
        />
        <Field
          label={i18next.t('AddPolicyForm.description')}
          name="description"
          component={this._renderInputField}
          type="text"
        />
        <Field
          label={i18next.t('AddPolicyForm.printerGroups')}
          name="printerGroups"
          value={printerGroupsForm}
          component={(field: any) => this._renderDropdownField(field, printerGroups)}
        />
        <Field
          label={i18next.t('AddPolicyForm.userGroups')}
          name="userGroups"
          value={userGroupsForm}
          component={(field: any) => this._renderDropdownField(field, userGroups)}
        />

        {policyType === 'backup' && 
          <span title="Политика активируется при создании">
            <Field
              label="Активна"
              name="state"
              type="checkbox"
              component={this._renderCheckboxField}
            />
          </span>
        }

        {policyType === 'watermark' && 
          <span title="Политика активируется при создании">
            <Field
              label="Активна"
              name="state"
              type="checkbox"
              component={this._renderCheckboxField}
            />
          </span>
        }



        {policyType === 'time' &&
          <React.Fragment>
            <Field
              label="Тип временной политики"
              name="timePolicyType"
              values={[
                { value: 'PROHIBITION', label: "Запрет печати по времени"},
                { value: 'PERMITTING', label: "Разрешение печати по времени"},
              ]}
              component={this._renderRadioGroupField}
            />
            <Field
              label={i18next.t('AddPolicyForm.days')}
              name="days"
              format={this.formatDay}
              value={days}
              component={this.renderDaysField}
            />
            <Field
              label={i18next.t('AddPolicyForm.hours')}
              name="hours"
              format={this.formatHours}
              value={hours}
              component={this.renderHoursField}
            />

            <span title="Политика активируется при создании">
              <Field
                label="Активна"
                name="state"
                type="checkbox"
                component={this._renderCheckboxField}
              />
            </span>

          </React.Fragment>
        }

        {policyType === 'restriction' &&
          <React.Fragment>
            <div className={b('format-wrapper')}>
              <Field
                label={i18next.t('AddPolicyForm.documentFormatSet')}
                name="documentFormatSet"
                value={documentFormatSet}
                component={this.renderPrintFormat}
              />
            </div>
            <Field
              label={i18next.t('AddPolicyForm.color')}
              name="color"
              type="checkbox"
              component={this._renderCheckboxField}
            />
            <Field
              label={i18next.t('AddPolicyForm.duplex')}
              name="duplex"
              type="checkbox"
              component={this._renderCheckboxField}
            />

            <Field
              label="Количество страниц"
              name="pages"
              component={this._renderInputField}
              type="number"
//              minValue={0}
            />

            <span title="Политика активируется при создании">
              <Field
                label="Активна"
                name="state"
                type="checkbox"
                component={this._renderCheckboxField}
              />
            </span>

          </React.Fragment>
        }
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddPolicyForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddPolicyForm.save')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
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
  private _renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
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
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    console.log("_renderCheckboxField", field.input.value )
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
  private _renderDropdownField(field: WrappedFieldProps<{}> & IDropdownProps, source: any) {
    const {
      input: {
        value,
        onChange,
        ...inputProps
      },
      label,
      ...fieldProps
    } = field;

    return (
      <MultiSelectField
        {...fieldProps}
        {...inputProps}
        onChange={onChange}
        value={value}
        source={source}
        getOptions={/*this.getOptions*/() => {}}
        label={field.label}
      />
    );
  }

  @bind
  private renderPrintFormat(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { input: { value, onChange} } = field;

    const formatTypes = [
      {value: 'A3', title: 'A3'},
      {value: 'A4', title: 'A4'},
      {value: 'A5', title: 'A5'}
    ];

    return (
      <CheckboxMultiselect
        {...field}
        values={formatTypes}
        title={field.label}
        selectedValues={value.documentFormatSet || []}
        onChange={this.onChangeFormatField.bind(this, onChange, value)}
      />
    );
  }
  @bind
  private renderDaysField(field: WrappedFieldProps<{}> & ISelectTimeFieldProps) {
    const { days = [] } = this.props;
    const { input: { value, ...inputProps }, ...fieldProps } = field;
    const { touched, error } = field.meta;

    return (
      <SelectTimeField
        key={0}
        value={days}
        {...fieldProps}
        {...inputProps}
        daysCode={days}
        typeTime="days"
        onChange={this.onChangeDayField.bind(this, field.input.onChange)}
        error={touched && error ? error : null}
      />
    );
  }

  @bind
  private renderHoursField(field: WrappedFieldProps<{}> & ISelectTimeFieldProps) {
    const { hours = [] } = this.props;
    const hourStrings: string[] = hours.map((h: string[]) => h.toString());
    const { input: { value, ...inputProps }, ...fieldProps } = field;
    const { touched, error } = field.meta;

    return (
      <SelectTimeField
        key={1}
        value={hours}
        {...fieldProps}
        {...inputProps}
        hoursCode={hourStrings}
        typeTime="hours"
        onChange={this.onChangeHoursField.bind(this, field.input.onChange)}
        error={touched && error ? error : null}
      />
    );
  }

  @bind
  private onChangeFormatField(reduxFormChange: React.EventHandler<any>, currentValue: any, value: string) {
    const formats = currentValue.documentFormatSet || [];
    const copyGroups = [...formats];
    if (copyGroups.includes(value)) {
      const index = copyGroups.indexOf(value);
      copyGroups.splice(index, 1);
    } else {
      copyGroups.push(value);
    }
    reduxFormChange({documentFormatSet: copyGroups});
  }

  @bind
  private onChangeDayField(reduxFormChange: React.EventHandler<any>, daysCode: string) {
    reduxFormChange({days: daysCode});
  }

  @bind
  private onChangeHoursField(reduxFormChange: React.EventHandler<any>, hoursCode: string) {
    reduxFormChange({hours: hoursCode});
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddPolicyForm };
export default connect<IStateProps, {}, {} >(mapStateToProps, {})(AddPolicyForm);
