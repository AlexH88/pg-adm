import * as React from 'react';
import {Field, FormProps, reduxForm, WrappedFieldProps} from 'redux-form';
import {block} from 'bem-cn';
import {bind} from 'decko';
import {Button, ITextInputProps, TextInput} from 'shared/view/elements';
import {IPrinter} from 'shared/types/printers';
import {validate} from 'shared/helpers/validators/validateAddPrinterGroup';
import './AddPrinterGroup.styl';
import i18next from "i18next";

interface IOwnProps {
  onCancel(): void;
  onSave(): void;
  onRestartAgent(): void;
  onActivate(state: boolean): void;
}

const b = block('add-group');

type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps;

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'editHostgroups',
  validate
})

class EditHostGroup extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error } = this.props;
    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field label={i18next.t('EditHostGroup.name')} name="name" component={this._renderField} type="text" disabled={false} />
        <Field label={i18next.t('EditHostGroup.version')} name="version" component={this._renderField} type="text" disabled={false} />

        <div className={b('restart')}>
          <Button
              isPrimary
              label={i18next.t('EditHostGroup.restart')}
              onClick={this.handleRestart}
          />
        </div>

        <div className={b('activate')}>
          <Button
              isPrimary
              label={i18next.t('EditHostGroup.activate')}
              onClick={this.handleActivate.bind(this, true)}
          />
          <Button
              label={i18next.t('EditHostGroup.deactivate')}
              onClick={this.handleActivate.bind(this, false)}
          />
        </div>

        <span className={b('general-error')}>{error}</span>
        <div className={b('footer')}>
          <Button
            label={i18next.t('EditHostGroup.cancel')}
            onClick={this.handleCancel}
          />
          <Button
            label={i18next.t('EditHostGroup.save')}
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

  @bind
  private handleRestart(): void {
    this.props.onRestartAgent();
  }

  @bind
  private handleActivate(isActivate: boolean): void {
    this.props.onActivate(isActivate);
  }

}

export default EditHostGroup;
