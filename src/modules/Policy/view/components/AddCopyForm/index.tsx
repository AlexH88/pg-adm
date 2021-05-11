import * as React from 'react';
import {block} from 'bem-cn';

import {connect} from 'react-redux';
import {bind} from 'decko';
import {IReduxState} from 'shared/types/app';
import {Button, CheckboxMultiselect, ICheckboxProps, ITextInputProps, TextInput} from 'shared/view/elements';
import {validate} from 'shared/helpers/validators/validatePolicy';
import {IPolicy} from 'shared/types/policy';
import {Field, FormProps, formValueSelector, reduxForm, WrappedFieldProps} from 'redux-form';
import i18next from "i18next";
import './style.styl';

interface IOwnProps {
  onCancel(): void;
  onAdd(): void;
}

interface IStateProps {
  userGroups: any,
  printerGroups: any,
  userGroupsForm: string[];
  printerGroupsForm: string[];
}

function mapStateToProps(state: IReduxState): IStateProps {
  const {usergroups, printergroups} = state.showResource.short;

  const processSource = (source: any) => {
    let processedSource: any[] = [];
    if (source && source.items && source.length > 0) {
      // processedSource = source.map((s: any) => ({ value: s.name, label: s.name }));
      processedSource = source.items.map((s: any) => ({ title: s.name, value: s.id.toString() }));
    }
    return processedSource;
  }
  return {
    userGroupsForm: formValueSelector('addBackup')(state, 'userGroups') as string[],
    printerGroupsForm: formValueSelector('addBackup')(state, 'printerGroups') as string[],
    userGroups: processSource(usergroups),
    printerGroups: processSource(printergroups)
  };
}

const b = block('add-rule');

type TypeFormProps = FormProps<IPolicy, IOwnProps, {}> & IOwnProps & IStateProps;

@reduxForm<IPolicy, IOwnProps, {}>({
  form: 'addBackup',
  validate,
})

class AddCopyForm extends React.PureComponent<TypeFormProps, {}> {

  public render() {
    const { invalid, pristine, error } = this.props;
    const { userGroupsForm, printerGroupsForm } = this.props;
    console.log('userGroupsForm', userGroupsForm);
    console.log('printerGroupsForm', printerGroupsForm);
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label={i18next.t('AddCopyForm.name')} name="name" component={this.renderInputField} type="text"/>

        <div className={b('groups-wrapper')}>
          <Field
            label={i18next.t('AddCopyForm.printerGroups')}
            name="printerGroups"
            value={printerGroupsForm}
            component={this.renderPrinterGroups}
          />
          <Field
            label={i18next.t('AddCopyForm.userGroups')}
            name="userGroups"
            value={userGroupsForm}
            component={this.renderUserGroups}
          />
        </div>

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('AddCopyForm.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('AddCopyForm.add')}
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private renderUserGroups(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { userGroups } = this.props;
    const { input: { value, onChange} } = field;

    return (
      <CheckboxMultiselect
        {...field}
        values={userGroups}
        title={field.label}
        selectedValues={value || []}
        onChange={this.onChangeMultiCheckbox.bind(this, onChange, value)}
      />
    );
  }

  @bind
  private renderPrinterGroups(field: WrappedFieldProps<{}> & ICheckboxProps) {
    const { printerGroups } = this.props;
    const { input: { value, onChange} } = field;
    return (
      <CheckboxMultiselect
        {...field}
        values={printerGroups}
        title={field.label}
        selectedValues={value || []}
        onChange={this.onChangeMultiCheckbox.bind(this, onChange, value)}
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
  private onChangeMultiCheckbox(reduxFormChange: React.EventHandler<any>, currentValue: any, value: string) {
    const groups = currentValue;
    
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
    this.props.onAdd();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddCopyForm };
export default connect<IStateProps, {}, {} >(mapStateToProps, {})(AddCopyForm);
