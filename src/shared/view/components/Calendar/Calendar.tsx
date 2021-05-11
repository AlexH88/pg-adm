import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import DayPicker from 'react-day-picker';
import {Button, TextInput} from 'shared/view/elements';
// import * as button from '../ValueFilter/button.styl';
import * as button from './button.styl';


import 'react-day-picker/lib/style.css';
import './Calendar.styl';

// import Button from "../../elements/Button/index";

interface ICalendarRange {
  from: any; // need type Date, but complicate write empty value with Date type 
  to: any; // need type Date, but complicate write empty value with Date type 
}

interface IState {
  showOverlay: boolean;
  range: ICalendarRange;
}

interface IUnixtimeData {
  from: number;
  to: number;
}

interface IProps {
  onRemove?():void;
  label: string;
  onChange(data: IUnixtimeData): void;
  acceptFilter(): void;
  onRemoveFilter?(): void;
  value: any;
}

const b = block('calendar');

class Calendar extends React.PureComponent<IProps, IState> {
  public state = {
    showOverlay: false,
    // value: '',
    range: {
      from: new Date(),
      to: new Date(),
    },
  };

  public render() {
    const { label, onRemove} = this.props;
    const { from, to } = this.state.range;

    const today = `${new Date().getDate()}/${new Date().getMonth()+1}`;

    let currentValue;

    if (this.props.value) {
      const fromSaved = new Date(Number(this.props.value.from)*1000);
      const toSaved = new Date(Number(this.props.value.to)*1000);

      const fromSavedDate = fromSaved ? `${fromSaved.getDate()}/${fromSaved.getMonth()+1}` : today;
      const toSavedDate = toSaved ? `${toSaved.getDate()}/${toSaved.getMonth()+1}` : today;
      currentValue = `${fromSavedDate} - ${toSavedDate}`;
    } else {
      const fromDate = from ? `${from.getDate()}/${from.getMonth()+1}` : today;
      const toDate = to ? `${to.getDate()}/${to.getMonth()+1}` : today;
      currentValue = `${fromDate} - ${toDate}`;
    }

    return (
      <div className={b()}>
        <TextInput
          label={label}
          onFocus={this.onInputFocus}
          value={currentValue}
        />
        <div className={b('button-rem')}>
          <Button label="x" theme={button} onClick={onRemove}/>
        </div>
        {
          this.state.showOverlay
          ?
            <div>
              <div
                className={b('overlay')}
                onClick={this.onOverlayClick}
              />
              <DayPicker
                numberOfMonths={2}
                selectedDays={[from, { from, to }]}
                onDayClick={this.handleDayClick}
              />
            </div>
          :
            null
        }
      </div>
    );
  }

  @bind
  private handleDayClick(day: Date) {
    const { range: { from, to } } = this.state;
    const rangeIsSelected = from && to;
    const range = rangeIsSelected ? { from: day, to: null } : DayPicker.DateUtils.addDayToRange(day, this.state.range);
    this.setState((state) => ({ ...state, range, showOverlay: range.to === null }));
    if (range.from !== null && range.to !== null) {
      this.props.onChange({ from: +range.from/1000, to: +range.to/1000 });
      this.props.acceptFilter();
    }
  }

  @bind
  private onInputFocus(e: React.FocusEvent<HTMLInputElement>) {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      showOverlay: !prevState.showOverlay,
    }));
  }

  @bind
  private onOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    this.setState((prevState) => ({
      ...prevState,
      showOverlay: !prevState.showOverlay,
    }));
  }

}

export default Calendar;
