import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, Checkbox, ITextInputProps, TextInput, PasswordInput} from 'shared/view/elements';
import Dropdown from 'shared/view/components/StatefulDropdown';
import {validate} from 'shared/helpers/validators/validateEditCatalog';
import {ICatalogEditForm} from 'shared/types/catalog';
import {IMode} from '../../../namespace';
import {actions} from '../../../redux';
import {connect} from 'react-redux';
import { IReduxState } from 'shared/types/app';
import './style.styl';

interface IOwnProps {
  changeFormField: typeof actions.changeCatalogFormField;
  testConnentClear: typeof actions.testConnentClear;
  sendingCatalogData: boolean;
  mode: IMode;
  onCancel(): void;
  onSave(): void;
  onTest(): void;
}
 

interface IStateProps {
  success: string;
  // url: string;
  // name: string;
  // base_dn: string;
  // user: string;
}

// const selector = formValueSelector('addCatalogs');

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    success: state.integration.success
    // url: selector(state, 'url') as string,
    // name: selector(state, 'name') as string,
    // base_dn: selector(state, 'base_dn') as string,
    // user: selector(state, 'user') as string,
  };
}


const b = block('add-catalog-upd');

type TypeFormProps = FormProps<ICatalogEditForm, IOwnProps, {}> & IStateProps & IOwnProps ;

@reduxForm<ICatalogEditForm, IOwnProps, {}>({
  form: 'addCatalogs',
  validate,
})

class AddCatalogForm extends React.PureComponent<TypeFormProps, {}> {

  componentWillUnmount() {
    const { testConnentClear } = this.props;
    testConnentClear();
  }

  public render() {
    const {
      mode,
      invalid,
      pristine,
      error, 
      success
    } = this.props;

    const isPartial = mode === 'partial-edit';

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <div className={b('fields')}>
          <div>
            <Field
              label="???????????????? ????????????????*"
              name="name"
              component={this._renderField}
              type="text"
            />
            <Field
              label="??????????*"
              name="username"
              component={this._renderField}
              type="text"
            />
            <Field
              label="????????????*"
              name="password"
              component={/*this._renderField*/this._renderPasswordField}
              type="text"
            />
            <Field
              label="???????? (IP-??????????)*"
              name="ldapHost"
              component={this._renderField}
              type="text"
            />
            <Field
              label="????????*"
              name="ldapPort"
              component={this._renderField}
              type="text"
            />
            <Field
              label="SSL"
              name="sslEnabled"
              component={this._renderCheckbox}
              type="text"
            />
          </div>
          <div>
            <Field
              label="Base DN*"
              name="baseDn"
              component={this._renderField}
              type="text"
              disabled={isPartial}
            />
            <Field
              label="?????? LDAP"
              name="ldapType"
              component={this._renderActionField}
              type="text"
            />
            <Field
              label="LDAP ?????????????? ????????????"
              name="loginAttr"
              component={this._renderField}
              type="text"
            />
            <Field
              label="LDAP ?????????????? ??????????"
              name="emailAttr"
              component={this._renderField}
              type="text"
            />
            <Field
              label="Prefix"
              name="prefix"
              component={this._renderField}
              type="text"
            />
            <Field
              label="OU/????????????"
              name="groupMappingType"
              component={this._renderActionField}
              type="text"
            />
          </div>
        </div>
        <span className={b('general-error')}>{error}</span>

        {success === "???????????????????? ?????????????? ??????????????????????" 
            ? 
          <span className={b('success')}>{success}</span> 
            :  
          <span className={b('general-error')}>{success}</span>
        }
        
        <div className={b('footer')}>
          <Button
            label="????????????"
            onClick={this.handleCancel}
          />
          <Button
            label="?????????????????? ????????????????????"
            onClick={this.handleTest}
          />
          <Button
            label="??????????????????"
            disabled={invalid || pristine}
            type="submit"
            isPrimary
          />
        </div>
      </form>
    );
  }

  @bind
  private _renderActionField(field: any) {
    let source: any[];

    switch (field.input.name) {
      case 'groupMappingType':
        source = [
          { value: 'OU', label : 'OU' },
          { value: 'GROUP', label: '????????????' }
        ];
        break;
      case 'ldapType':
        source = [
          { value: 'EDIRECTORY', label : 'EDirectory' },
          { value: 'ACTIVE_DIRECTORY', label: 'Active Directory' }
        ];
        break;
      default:
        source = [];
    }

    return (
      <div className={b('dropdown-wrapper')}>
        <Dropdown
          {...field}
          {...field.input}
          source={source}
        />
      </div>
    );
  }

  @bind
  private _renderCheckbox(field: any) {
    const { label, input: { name, value } } = field; 
    return (
      <div className={b('checkbox-wrapper')}>
        <Checkbox
          name={name}
          label={label}
          checked={Boolean(value)}
          onChange={this.changeCatalogFieldForm.bind(this, field.input.onChange, field.input.name)}
        />
      </div>
    );
  }

  @bind
  private _renderPasswordField(field: any) {
    const { touched, error } = field.meta;
    return (
      <PasswordInput
        {...field.input}
        {...field}
        onChange={this.changeCatalogFieldForm.bind(this, field.input.onChange, field.input.name)}
        error={touched && error ? error : false}
      />
    );
  }

  @bind
  private changeCatalogFieldForm(
    reduxFormChange: React.FormEventHandler<any>,
    fieldName: string,
    event: React.FormEvent<any>,
  ) {
    const { changeFormField } = this.props;
    reduxFormChange(event);
    changeFormField(fieldName);
  }

  @bind
  private _renderField(field: WrappedFieldProps<{}> & ITextInputProps) {
    const { touched, error } = field.meta;
    return (
      <TextInput
        {...field.input}
        {...field}
        onChange={this.changeCatalogFieldForm.bind(this, field.input.onChange, field.input.name)}
        error={touched && error ? error : false}
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
  private handleTest(): void {
    this.props.onTest();
  }
}

export { AddCatalogForm };export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(AddCatalogForm);