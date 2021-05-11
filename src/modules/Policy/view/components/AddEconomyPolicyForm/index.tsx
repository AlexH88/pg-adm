import * as React from 'react';
import {block} from 'bem-cn';

import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy, IRuleGroup} from 'shared/types/policy';
import {Button, Checkbox, CheckboxMultiselect, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import {convertDataForMultiselect} from 'shared/helpers/formatData';

import '../AddCopyForm/style.styl';
import i18next from "i18next";

interface IOwnProps {
  userGroups: IRuleGroup[];
  printerGroups: IRuleGroup[];
  onCancel(): void;
  onAdd(): void;
}

interface IStateProps {
  userGroupsForm: string[];
  printerGroupsForm: string[];
}

const selector = formValueSelector('add_economies');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    userGroupsForm: selector(state, 'usergroups') as string[],
    printerGroupsForm: selector(state, 'printergroups') as string[],
  };
}

const b = block('add-rule');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'add_economies',
  validate,
})

class AddEconomyPolicyForm extends React.PureComponent<TypeFormProps, {}> {

  public render() {
    const { invalid, pristine, error } = this.props;
    const { userGroupsForm, printerGroupsForm } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('groups-wrapper')}>
          <Field
            label={i18next.t('AddEconomyPolicyForm.printergroups')}
            name="printergroups"
            value={printerGroupsForm}
            component={this.renderPrinterGroups}
          />
          <Field
            label={i18next.t('AddEconomyPolicyForm.usergroups')}
            name="usergroups"
            value={userGroupsForm}
            component={this.renderUserGroups}
          />
        </div>
        <Field label={i18next.t('AddEconomyPolicyForm.name')} name="name" component={this.renderInputField} type="text"/>
        <Field
            label={i18next.t('AddEconomyPolicyForm.seal')}
            name={"bw"}
            component={this._renderCheckboxField}
            type="checkbox"
            value={true}
        />
        <Field
            label={i18next.t('AddEconomyPolicyForm.duplex')}
            name={"duplex"}
            component={this._renderCheckboxField}
            type="checkbox"
            value={true}
        />
        <Field
            label={i18next.t('AddEconomyPolicyForm.economical')}
            name={"economical"}
            component={this._renderCheckboxField}
            type="checkbox"
            value={true}
        />

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddEconomyPolicyForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddEconomyPolicyForm.add')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderCheckboxField(field: WrappedFieldProps<{}>&ICheckboxProps) {
    return (
			<div style={{padding: '0.8rem 0'}}>
				<Checkbox
					{...field.input}
					{...field}
				/>
			</div>
    );
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
  private renderInputField(field: WrappedFieldProps<{}> & ITextInputProps) {
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    
    this.props.onAdd(); // Обработчик добавления
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddEconomyPolicyForm };
export default connect<{}, {}, IOwnProps >(mapStateToProps, {})(AddEconomyPolicyForm);
