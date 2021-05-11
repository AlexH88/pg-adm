import React, {CSSProperties, FC, forwardRef, ReactElement} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker, {registerLocale, setDefaultLocale} from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import {useTranslation} from 'react-i18next';
import * as styles from '../../../../shared/view/elements/TextInput/style.styl';
import { TextInput } from '../../../../shared/view/elements';
import { block } from 'bem-cn';



registerLocale('ru', ru);
setDefaultLocale('ru');

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  dateFormat?: string | string[];
  customInput?(): React.ReactElement;
  inputClassName?: string;
  disabled?: boolean;
  popperPlacement?: string;
  popperClassName?: string;
  // iconSize?: IconSize;
  iconStyle?: CSSProperties;
  calendarClassName?: string;
  showTimeInput?: boolean;
  shouldCloseOnSelect?: boolean;
  startOpen?: boolean;
  selectsEnd?: boolean;
  selectsStart?: boolean;
  startDate?: Date;
  endDate?: Date;
  withIcon?: boolean;
  isClearable?: boolean;
  onClear?: () => void;
  error?: string;
}

const defaultDatePickerDateFormat = 'dd.MM.yyyy';

const b = block('edit-operators');


const DatePickerComponent: FC<DatePickerProps> = (props: DatePickerProps): ReactElement<HTMLDivElement> => {
  const { t } = useTranslation();
  
  const CustomInput = forwardRef((fprops: any, ref) => {

    const {
      type, theme, value, required, error, onBlur, step, 
      multiline, onClick, onChange, label, disabled, minValue, onFocus, onEnter, touched
    } = fprops;

    return (
      <div style={{ position: 'relative' }}>
        <TextInput
          theme={theme ? theme : styles}
          disabled={disabled}
          required={required}
          label={label}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          onClick={onClick}
          // type={type}
          type={'text'}
          value={value}
          step={step}
          multiline={multiline}
          // onKeyPress={onEnter}
          // min={minValue}
        />
      </div>
    );
  });

  const {
    value,
    onChange,
    showTimeSelect,
    dateFormat = defaultDatePickerDateFormat,
    customInput: CustomInputComponent,
    disabled,
    popperPlacement = "auto",
    popperClassName,
    calendarClassName,
    showTimeInput,
    shouldCloseOnSelect,
    startOpen,
    selectsEnd,
    selectsStart,
    maxDate,
    minDate,
    startDate,
    endDate,
    isClearable = false,
    error
  } = props;

  const popperBehavior = popperPlacement === 'auto' ? 'flip' : popperPlacement;
  
  return (
    <div
      style={{
        position: 'relative',
        flex: '1 0 auto',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DatePicker
        placeholderText={t('components.elements.datePicker.notSet')}
        disabledKeyboardNavigation
        showTimeSelect={showTimeSelect}
        showTimeInput={showTimeInput}
        onChange={onChange}
        selected={value}
        dateFormat={dateFormat}
        customInput={CustomInputComponent ? <CustomInputComponent /> : <CustomInput />}
        disabled={disabled}
        popperPlacement={popperPlacement}
        popperModifiers={{
          flip: {
            behavior: [popperBehavior as any]
          },
          preventOverflow: {
            enabled: popperPlacement === 'auto'
          },
          hide: {
            enabled: false
          }
        }}
        popperClassName={popperClassName}
        calendarClassName={calendarClassName}
        shouldCloseOnSelect={shouldCloseOnSelect}
        startOpen={startOpen}
        selectsEnd={selectsEnd}
        selectsStart={selectsStart}
        startDate={startDate}
        endDate={endDate}
        minDate={minDate}
        maxDate={maxDate}
        isClearable={isClearable}
      />

      <span className={b('general-error')}>{error}</span>
    </div>
  );
}

export default DatePickerComponent;