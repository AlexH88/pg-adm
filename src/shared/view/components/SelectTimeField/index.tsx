import * as React from 'react';
import {block} from 'bem-cn';
import {getDaysFromMask, getHoursFromMask} from 'shared/helpers/formatData';
import {TextInput} from 'shared/view/elements';
import {bind} from 'decko';
import i18next from "i18next";
import './style.styl';

const b = block('select-time');

const days = {
  'пн': 'MONDAY',
  'вт': 'TUESDAY',
  'ср': 'WEDNESDAY',
  'чт': 'THURSDAY',
  'пт': 'FRIDAY',
  'сб': 'SATURDAY',
  'вс': 'SUNDAY'
};

const hours = Array.from(new Array(24), (_, index) => (index).toString());

interface IOwnProps {
  daysCode?: string[];
  hoursCode?: string[];
  value: string[] | number[];
  typeTime: 'days' | 'hours';
  onChange(data: string[], event: React.FormEvent<HTMLInputElement>): void;
  error?: string | boolean;
  onBlur?(event: React.FormEvent<HTMLFormElement> | string): void;
}

interface IState {
  showList: boolean;
}

type DayKey = 'пн' | 'вт' | 'ср' | 'чт' | 'пт' | 'сб' | 'вс';

class SelectTimeField extends React.PureComponent<IOwnProps, IState> {

  constructor(props: IOwnProps) {
    super(props);
    this.state = {
      showList: false,
    };
  }

  public render() {
    const { showList } = this.state;
    return (
      <div className={b()}>
        {this.renderDaysWidget()}
        {this.renderHoursWidget()}
        {showList ? <div onClick={this.onChangeVisibleDays} className={b('overlay')}/> : null}
      </div>
    );
  }

  @bind
  private renderDaysWidget(): JSX.Element[] | null {
    const { typeTime, daysCode, value, error, onBlur } = this.props;
    const { showList } = this.state;

    const daysString = [...value].map(d => d.toString());
    let daysToDisplay: string = getDaysFromMask(daysString);

    if (typeTime === 'days' && daysCode) {
      return ([
        <div key={0} className={b('input-wrapper', { datepicker: true })}>
          <TextInput
            value={daysToDisplay}
            label="Дни печати*"
            onClick={this.onChangeVisibleDays}
            onBlur={(e: any) => {onBlur(e.target.daysToDisplay)}}
            // onBlur={() => {}}
            error={error}
          />
        </div>,
        <div key={1} className={b('items-list', { show: showList })}>
          {Object.keys(days).map((day: DayKey) =>
            <div
              key={days[day]}
              className={b('item', { active: daysCode.includes(days[day]) })}
              onClick={this.onSelectDay.bind(this, days[day])}
            >
              {day}
            </div>
          )}
        </div>,
      ]);
    }
    return null;
  }

  @bind
  private renderHoursWidget(): JSX.Element[] | null {
    const { typeTime, value, hoursCode, error, onBlur } = this.props;
    const { showList } = this.state;

    console.log('SelectTimeField', error)

    const hoursNumber = [...value].map(h => Number(h));
    let hoursToDisplay: string = getHoursFromMask(hoursNumber);

    if (typeTime === 'hours' && hoursCode) {
      return ([
        <div key={2} className={b('input-wrapper', { hours: true })}>
          <TextInput
            value={hoursToDisplay}
            label="Часы печати*"
            onClick={this.onChangeVisibleDays}
            onBlur={(e: any) => {onBlur(e.target.hoursToDisplay)}}
            // onBlur={() => {}}
            error={error}
          />
        </div>,
        <div key={3} className={b('items-list', { show: showList, hours: true })}>
          {hours.map((hour, index) =>
            <div
              key={index}
              className={b('item', { active: hoursCode.includes(hour) })}
              onClick={this.onSelectHour.bind(this, hour)}
            >
              {hour}
            </div>,
          )}
        </div>,
      ]);
    }
    return null;
  }

  @bind
  private onChangeVisibleDays(): void {
    this.setState((state) => ({ showList: !state.showList }));
  }

  @bind
  private onSelectHour(hourIndex: string, event: React.FormEvent<HTMLInputElement>): void {
    const { onChange, hoursCode } = this.props;
    let code: string[] = [];
    if (hoursCode && Array.isArray(hoursCode)) {
      if (hoursCode.includes(hourIndex)) {
        code = hoursCode.filter(hour => hour !== hourIndex);
      } else {
        code = [...hoursCode, hourIndex];
      }
    }
    onChange(code, event);
  }

  @bind
  private onSelectDay(dayName: string, event: React.FormEvent<HTMLInputElement>): void {
    const { onChange, daysCode } = this.props;
    let code: string[] = [];
    
    if (daysCode && Array.isArray(daysCode)) {
      if (daysCode.includes(dayName)) {
        code = daysCode.filter(day => day !== dayName);
      } else {
        code = [...daysCode, dayName];
      }
    }
    onChange(code, event);
  }

}

export { IOwnProps as ISelectTimeFieldProps };
export default SelectTimeField;
