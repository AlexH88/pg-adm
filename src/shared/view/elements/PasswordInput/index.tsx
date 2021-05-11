import React, {FC, ReactElement, RefObject} from 'react';
import {block} from 'bem-cn';
import * as IconShow from './svg/show.svg';
import * as IconHide from './svg/hide.svg';
import * as styles from './style.styl';

import Input from 'react-toolbox/lib/input';

const ToolboxInput: any = Input;

export interface IOwnProps {
  val?: string;
  label: string;
  value?: any;
  error?: string | boolean;
  disabled?: boolean;
  required?: boolean;
  theme?: any;
  type?: string;
  step?: string;
  ref?: RefObject<HTMLInputElement>;
  multiline?: boolean;
  maxLength?: number;
  minValue?: number;
  onChange?(e: React.FormEvent<HTMLInputElement>): void;
  onBlur?: Function;
  onFocus?(e: React.FocusEvent<HTMLInputElement>): void;
  onClick?(e: React.FocusEvent<HTMLInputElement>): void | any;
  onEnter?(): void;
}

class PasswordInput extends React.PureComponent<IOwnProps, {}> {
  state = {
    hide: true
  }

  hideSwitch = ev => {
      this.setState({ hide: !this.state.hide })
  }

  formatValue = (value: any) => {
    if (this.props.type === 'number' && String(value).includes('.')) {
      return Number(String(value).slice(0, String(value).indexOf('.') + 3));
    }
    return value;
  }

  onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onEnter } = this.props;
    if (event.key === 'Enter' && onEnter) {
      onEnter();
    }
  }

  onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onFocus } = this.props;
    event.currentTarget.select();
    if (onFocus) {
      onFocus(event);
    }
  }

  public render() {

    const b = block('text-password-input');
    const { type, theme, value, required, error, onBlur, step, ref } = this.props;
    const { multiline, onClick, onChange, label, disabled, minValue } = this.props;
    const { hide } = this.state
    return (
      <div className={b()}>
        <ToolboxInput
          theme={theme ? theme : styles}
          disabled={disabled}
          required={required}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={this.onFocus}
          onClick={onClick}
          ref={ref}
          type={hide ? 'password' : 'text'}
          value={this.formatValue(value)}
          error={error}
          step={step}
          multiline={multiline}
          onKeyPress={this.onEnter}
          min={minValue}
        />
        <div className="icon__visible" onClick={this.hideSwitch}>
          <img src={ hide ? IconShow : IconHide} alt="Logo" />
         </div>
      </div>
    );
  }
}



export default PasswordInput;
export { IOwnProps as IPasswordInputProps };