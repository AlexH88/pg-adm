import React, {FC, ReactElement, RefObject} from 'react';
import cn from 'classnames';
// import { Icon, IconType } from '../Icon';
import style from './input.module.styl';

interface OwnProps {
  value: string;
  id?: string;
  required?: boolean;
  className?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: any;
  styleWidth?: any;
  clearTitle?: string;
  step?: number;
  min?: number;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  autoComplete?: 'on' | 'off';
  autoFocus?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  ref?: RefObject<HTMLInputElement>;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onClick?(e: React.MouseEvent<HTMLInputElement>): void;
  onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
  onMouseEnter?(): void;
  onMouseLeave?(): void;
  onKeyDown?(event: React.KeyboardEvent<Element>): void;
  validation?(value: string): void;
}

export const Input: FC<OwnProps> = React.forwardRef((props: OwnProps, ref: RefObject<HTMLInputElement>): ReactElement<HTMLInputElement> => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    const { onChange } = props;
    if (typeof onChange === 'function') {
      onChange(event.target.value);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    const { onFocus } = props;
    if (typeof onFocus === 'function') {
      onFocus(event);
    }
  };

  const {
    type = 'text',
    clearTitle,
    styleWidth,
    onClear,
    className,
    id,
    required,
    autoComplete,
    onMouseEnter,
    onMouseLeave,
    onKeyDown,
    defaultValue,
    onClick,
    readOnly,
    size = 'medium',
    ...inputProps
  } = props;

  const inputClassName = cn(
    style.input_sc,
    style[`input--${size}`],
    className, {
      [style.padding]: typeof onClear === 'function',
      [style.clickable]: typeof onClick === 'function'
    });

  return (
    <div
      className={cn(style.inputWrapper)}
      style={styleWidth}
    >
      <input
        {...inputProps}
        id={id}
        type={type}
        className={inputClassName}
        required={required}
        defaultValue={defaultValue}
        ref={ref}
        onClick={onClick}
        autoComplete={autoComplete}
        readOnly={readOnly}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        onFocus={handleFocus}
      />
      {typeof onClear === 'function' && (
        <div className={style.cross}>
          {/*
          <Icon
            title={clearTitle || t('components.elements.input.clearSpanTitle')}
            onClick={onClear}
            type={IconType.clear}
          />
          */}
          X
        </div>
      )}
    </div>
  );
});

export default { Input };
