import * as React from 'react';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {connect} from 'react-redux';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {
    Button,
    Checkbox,
    Dropdown,
    ICheckboxProps,
    IDropdownProps,
    IRadioGroupProps,
    ITextInputProps,
    RadioGroup,
    TextInput
} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validateGroupCreation';
import {IMode} from '../../../namespace';
import {IGroup} from 'shared/types/groups';
import './AddGroupForm.styl';
import i18next from "i18next";

interface IOwnProps {
  mode: IMode;
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  type?: string;
}

const selector = formValueSelector('add_usergroups');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    type: selector(state, 'type') as string,
  };
}

const b = block('add-group');

type IFormProps = FormProps<IGroup, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IGroup, IOwnProps, {}>({
  form: 'add_usergroups',
  validate,
})
class AddGroupForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { mode, invalid, pristine, error, type } = this.props;
    const isPartial = mode === 'partial-edit';
    const isEdit = mode === 'edit';
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div>
          <Field label={i18next.t('GroupForm.name')} name="name" component={this._renderField} type="text" disabled={isPartial} />
        </div>
        <div>
          <Field
            label={i18next.t('GroupForm.initialFee')}
            name="initialCredit"
            normalize={this.normalizeNumberField}
            component={this._renderField}
            type="number"
            disabled={type ? type : false}
          />
        </div>
        <div>
          <Field
            label={i18next.t('GroupForm.negativeBalance')}
            name="initialRestricted"
            type="checkbox"
            component={this._renderCheckboxField}
            disabled={type ? type : false}
          />
        </div>
        <div>
          <Field
            label={i18next.t('GroupForm.accrualAmount')}
            name="amount"
            normalize={this.normalizeNumberField}
            component={this._renderField}
            type="number"
          />
        </div>
        <div>
          <Field
            label="Период*"
            name="period"
            source={[
              { value: 'day', label: i18next.t('GroupForm.daily') },
              { value: 'week', label: i18next.t('GroupForm.weekly') },
              { value: 'month', label: i18next.t('GroupForm.monthly') },
            ]}
            component={this._renderDropdownField}
          />
        </div>
        {
          isEdit
          ?
            <Field
              name="type"
              values={[
                { value: true, label: i18next.t('GroupForm.update') },
                { value: false, label: i18next.t('GroupForm.accrual') },
              ]}
              component={this._renderRadioGroupField}
            />
          :
            null
        }
        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Сохранить"
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderField(field: WrappedFieldProps<{}>&ITextInputProps) {
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
    return (
      <Checkbox
        {...field.input}
        {...field}
      />
    );
  }

  @bind
  private _renderDropdownField(field: WrappedFieldProps<{}>&IDropdownProps) {
    return (
      <Dropdown
        {...field.input}
        {...field}
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
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

  @bind
  private normalizeNumberField(value: string): number | undefined {
    return value ? parseInt(value, 10) : undefined;
  }
}

export { AddGroupForm };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(AddGroupForm);
