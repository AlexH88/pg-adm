import React, {CSSProperties, FC, LegacyRef, ReactElement} from 'react';
import cn from 'classnames';

import style from './button.module.styl';

type ButtonColor = 'primary' | 'secondary' | 'confirm' | 'decline';
type ButtonSize = 'small' | 'medium' | 'large';

interface Props {
  label?: string;
  className?: string;
  color?: ButtonColor;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  override?: CSSProperties;
  onClick?(e: React.MouseEvent<HTMLElement>): void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  children?: any;
  ref?: LegacyRef<HTMLButtonElement>;
}

export const Button: FC<Props> = React.forwardRef((props: Props, ref: LegacyRef<HTMLButtonElement>): ReactElement<HTMLButtonElement> => {
  const {
    label,
    className,
    color = 'secondary',
    size = 'medium',
    disabled,
    override,
    type = 'button',
    onClick,
    children
  } = props;

  return (
    <button
      ref={ref}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        style['button'],
        style[`button--${color}`],
        style[`button--${size}`],
        className
      )}
      style={override}
      type={type}
    >
      {label || children}
    </button>
  );
});

interface CancelSubmitButtonsProps {
  disabled?: boolean;
  labelSubmit?: string;
  style?: CSSProperties;
  onCancelClick(e: React.MouseEvent<HTMLElement>): void;
  onClickSubmit?(e: React.MouseEvent<HTMLButtonElement>): void;
}

export const CancelSubmitButtons: FC<CancelSubmitButtonsProps> = ({
  style,
  onCancelClick: onCancel,
  disabled,
  labelSubmit,
  onClickSubmit,
}: CancelSubmitButtonsProps): ReactElement<HTMLButtonElement> => (
  <div
    style={
      style || {
        margin: '20px 30px',
        display: 'flex',
        justifyContent: 'space-between',
      }
    }
  >
    <Button
      onClick={onCancel}
      type="button"
      color="secondary"
      label="cancelButtonLabel"
    />
    <Button
      disabled={disabled}
      type="submit"
      color="primary"
      label={labelSubmit || 'submitButtonLabel'}
      onClick={onClickSubmit}
    />
  </div>
);

export default Button;