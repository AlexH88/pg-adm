import * as React from 'react';
import {connect} from 'react-redux';
import {IReduxState} from 'shared/types/app';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import './EditRoles.styl';
import {IRole, IRuleDescription} from 'modules/Settings/namespace';
import {validate} from 'shared/helpers/validators/validateRoleCreation';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}

interface IStateProps {
  rules: IRuleDescription[];
  currentOperator: any;
  authorities: [];
}

const b = block('edit-roles');

type IFormProps = FormProps<IRole, IOwnProps, {}> & IOwnProps&IStateProps ;

function mapStateToProps(state: IReduxState): IStateProps {
  return {
    rules: state.settings.ruleDescription,
    currentOperator: state.showResource.currentOperator,
    authorities: state.settings.authorities
  };
}
@reduxForm<IRole, IOwnProps, {}>({
  form: 'addLicense',
  validate,
})

class AddLicense extends React.PureComponent<IFormProps , {}> {
  public render() {
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          label="Ключ*"
          name="licenseKey"
          component={this._renderField}
          type="text"
        />
        {/* <Field
          label="Примечание"
          name="description"
          component={this._renderField}
          type="text"
        /> */}

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditRoles.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditRoles.save')}
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
  private handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    this.props.onSave();
  }

  @bind
  private handleCancel(): void {
    this.props.onCancel();
  }

}

export { AddLicense };
export default connect<IStateProps, {}, IOwnProps >(mapStateToProps, {})(AddLicense);
