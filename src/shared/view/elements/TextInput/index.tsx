import React, {FC, ReactElement, RefObject} from 'react';
import {block} from 'bem-cn';
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


  const TextInput: FC<IOwnProps> = React.forwardRef((props: IOwnProps, ref: RefObject<HTMLInputElement>): ReactElement<HTMLDivElement> => {
    
  const formatValue = (value: any) => {
    if (props.type === 'number' && String(value).includes('.')) {
      return Number(String(value).slice(0, String(value).indexOf('.') + 3));
    }
    return value;
  }

  const onEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { onEnter } = props;
    if (event.key === 'Enter' && onEnter) {
      onEnter();
    }
  }

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { onFocus } = props;
    event.currentTarget.select();
    if (onFocus) {
      onFocus(event);
    }
  }

    const b = block('text-input');
    const { type, theme, value, required, error, onBlur, step } = props;
    const { multiline, onClick, onChange, label, disabled, minValue } = props;

    return (
      <div className={b()}>
        <ToolboxInput
          theme={theme ? theme : styles}
          disabled={disabled}
          required={required}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={onClick}
          ref={ref}
          type={type}
          value={formatValue(value)}
          error={error}
          step={step}
          multiline={multiline}
          onKeyPress={onEnter}
          min={minValue}
        />
      </div>
    );

})

export default TextInput;
export { IOwnProps as ITextInputProps };





























// import * as React from 'react';
// import { block } from 'bem-cn';
// import * as styles from './style.styl';

// import Input from 'react-toolbox/lib/input';
// import { bind } from 'decko';

// const ToolboxInput: any = Input;

// interface IOwnProps {
//   val?: string;
//   label: string;
//   value?: string;
//   error?: string | boolean;
//   disabled?: boolean;
//   required?: boolean;
//   theme?: any;
//   type?: string;
//   step?: string;
//   multiline?: boolean;
//   maxLength?: number;
//   minValue?: number;
//   onChange?(e: React.FormEvent<HTMLInputElement>): void;
//   onBlur?(e: React.FocusEvent<HTMLInputElement>): void;
//   onFocus?(e: React.FocusEvent<HTMLInputElement>): void;
//   onClick?(e: React.FocusEvent<HTMLInputElement>): void | any;
//   onEnter?(): void;
// }

// class TextInput extends React.PureComponent<IOwnProps, {}> {

//   private b = block('text-input');

//   public render() {
//     const b = this.b;
//     const { type, theme, value, required, error, onBlur, step } = this.props;
//     const { multiline, onClick, onChange, label, disabled, minValue } = this.props;

//     return (
//       <div className={b()}>
//         <ToolboxInput
//           theme={theme ? theme : styles}
//           disabled={disabled}
//           required={required}
//           label={label}
//           onChange={onChange}
//           onBlur={onBlur}
//           onFocus={this.onFocus}
//           onClick={onClick}
//           // type={type}
//           type={'text'}
//           value={this.formatValue(value)}
//           error={error}
//           step={step}
//           multiline={multiline}
//           onKeyPress={this.onEnter}
//           min={minValue}
//         />
//       </div>
//     );
//   }
//   /**
//    * 
//    * @param value value from props
//    * 
//    * if value is float number return number with precision to 2 sign
//    * else return original value
//    */
//   @bind
//   private formatValue(value: any) {
//     if (this.props.type === 'number' && String(value).includes('.')) {
//       return Number(String(value).slice(0, String(value).indexOf('.') + 3));
//     }
//     return value;
//   }

//   @bind
//   private onEnter(event: React.KeyboardEvent<HTMLInputElement>) {
//     const { onEnter } = this.props;
//     if (event.key === 'Enter' && onEnter) {
//       onEnter();
//     }
//   }

//   // @bind
//   // private onClick(event: React.FocusEvent<HTMLInputElement>) {
//   //   if(!1) if (!1) console.log(event);
//   //   const { onClick } = this.props;
//   //   onClick ? onClick(event) : null;
//   //
//   //   if (!1) console.log('fff ::: ');
//   //
//   // }

//   @bind
//   private onFocus(event: React.FocusEvent<HTMLInputElement>) {
//     const { onFocus } = this.props;
//     event.currentTarget.select();
//     if (onFocus) {
//       onFocus(event);
//     }
//   }
// }

// export default TextInput;
// export {
//   IOwnProps as ITextInputProps
// };
