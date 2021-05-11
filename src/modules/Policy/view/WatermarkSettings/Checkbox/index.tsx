import React, {FC, ReactElement} from 'react';
import Mark from './mark';
import styles from './checkbox.module.styl';

export interface CheckboxProps {
  id?: string;
  value: boolean;
  onChange?: (newValue: boolean) => void;
  disabled?: boolean;
  zoneW?: string;
  zoneH?: string;
  override?: any;
}

const Checkbox: FC<CheckboxProps> = (props: CheckboxProps): ReactElement<HTMLLabelElement> => {

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { onChange, disabled } = props;
    if (onChange && !disabled) {
      onChange(event.target.checked);
    }
  };

  const {
    value,
    disabled,
    id,
    zoneW = '20px',
    zoneH = '20px',
    override
  } = props;

  const wrapperOverride = typeof override !== 'undefined' ? override.wrapper : {};
  const inputOverride = typeof override !== 'undefined' ? override.input : {};
  const displayedOverride = typeof override !== 'undefined' ? override.displayed : {};

  return (
    <label onClick={(e) => { e.stopPropagation(); }}>
      <div
        className={styles.checkbox_wrapper}
        style={{ width: zoneW, height: zoneH, ...wrapperOverride }}
      >
        <input
          type="checkbox"
          disabled={disabled}
          className={styles.checkbox_input}
          style={inputOverride}
          onChange={handleChange}
          checked={value}
          id={id}
        />
        <div
          className={styles.checkbox_displayed} 
          style={displayedOverride}
        >
          <Mark
            w={12}
            h={12}
          />
        </div>
      </div>
    </label>
  );
};

export default Checkbox;
