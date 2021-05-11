import * as React from 'react';
import { Field, reduxForm, WrappedFieldProps, FormProps } from 'redux-form';
import { block } from 'bem-cn';
import { bind } from 'decko';
import { Button, TextInput, ITextInputProps } from '../../../../../shared/view/elements';
import { validate } from '../../../../../shared/helpers/validators/validateAddFloor';
import { IPrinter } from '../../../../../shared/types/printers';
import './AddFloorForm.styl';
import * as styles from '../../../../../modules/Policy/view/WatermarkSettings/styles.styl'
import Previews from './Previews';

const b = block('add-floor');
interface IOwnProps {
  onCancel(): void;
  onSave(): void;
}
type IFormProps = FormProps<IPrinter, IOwnProps, {}> & IOwnProps;

@reduxForm<IPrinter, IOwnProps, {}>({
  form: 'addFloor',
  validate,
})

class AddFloorForm extends React.PureComponent<IFormProps, {}> {
  public render() {
    const { invalid, pristine, error} = this.props;

    return (
      <form onSubmit={this.handleSubmit} className={b()} >
        <Field
          name="floorPicture"
          component={this._renderFieldPicture}
          type="file"
        />
        <Field
          name="floorNumber"
          component={this._renderField}
          type="text"
        />

        <span className={b('general-error')}>{error}</span>

        
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={this.handleCancel}
          />
          <Button
            label="Загрузить"
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
      <div>
        <label htmlFor={name} className={styles['form-group-custom__input-row']}>
          <div>
            <span style={{ marginRight: '10px' }}>Номер этажа</span>
          </div>
          <div style={{ position: 'relative' }}>
            <TextInput
              {...field.input}
              {...field}
              error={touched && error ? error : false}
            />
          </div>
        </label>
      </div>
    );
  }

  @bind
  private _renderFieldPicture(field: any /*WrappedFieldProps<{}>&ITextInputProps*/) {
  // const { touched, error } = field.meta;
  //  console.log('error', error)  
    return (
      <div>
        <Previews 
         {...field.input}
         {...field}
        //  error={touched && error ? error : false}
         />
      </div>
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

export default AddFloorForm;









