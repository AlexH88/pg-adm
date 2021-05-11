import {ISource} from 'shared/types/app';
import {IPolicy, IRuleGroup} from 'shared/types/policy';
import {IMultiSelectOption, ISelectOption} from './namespace';

interface IIndexSignature {
  [ key: string ]: string;
}

type WeekDays = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

function getStringIds(arr: any): string {
  return arr.map((item: any) => item.name).join(', ');
}

function getHoursFromMask(hours: number[]): string {
  let resultString = '';
  if (!Array.isArray(hours)) {
    return resultString;
  }
  hours.sort((a, b) => a-b);
  let prelim: number[] = [];
  let chunks: number[][] = [];
  for (let i = 0; i < hours.length; i++) {
    if (i === 0) {
      prelim.push(hours[i]);
    } else {
      if (hours[i] - prelim[prelim.length - 1] === 1) {
        prelim.push(hours[i]);
      } else {
        chunks.push(prelim);
        prelim = [hours[i]];
      }
    }
    if (i === hours.length - 1) {
      chunks.push(prelim);
    }
  }
  for (let j = 0; j < chunks.length; j++) {
    if (j > 0) {
      resultString += ` , `;
    }
    const lengthen = (hour: number) => hour.toString().length < 2 ? `0${hour}` : hour;

    resultString += `${lengthen(chunks[j][0])}:00`;
    if (chunks[j].length > 1) {
      resultString += ` - ${lengthen(chunks[j][chunks[j].length - 1])}:00`;
    }
  }
  return resultString;
}

function getIntervalDaysFromMask(incomingDays: string[]): string {
  const weekDays = {
    'MONDAY': 'пн',
    'TUESDAY': 'вт',
    'WEDNESDAY': 'ср',
    'THURSDAY': 'чт',
    'FRIDAY': 'пт',
    'SATURDAY': 'сб',
    'SUNDAY': 'вс'
  };
  let resultString = '';
  if (Array.isArray(incomingDays)) {
    const dayOptions = Object.keys(weekDays);
    incomingDays.sort((a, b) => dayOptions.indexOf(a) - dayOptions.indexOf(b));
    incomingDays.forEach((day: WeekDays) => {
      if (resultString.length) {
        resultString += `, ${weekDays[day]}`;
      } else {
        resultString += `${weekDays[day]}`;
      }
    });
  }
  return resultString;
}

function getDaysFromMask(incomingDays: string[]): string {
  const weekDays = {
    'MONDAY': 'пн',
    'TUESDAY': 'вт',
    'WEDNESDAY': 'ср',
    'THURSDAY': 'чт',
    'FRIDAY': 'пт',
    'SATURDAY': 'сб',
    'SUNDAY': 'вс'
  };
  let resultString = '';
  if (Array.isArray(incomingDays)) {
    const dayOptions = Object.keys(weekDays);
    incomingDays.sort((a, b) => dayOptions.indexOf(a) - dayOptions.indexOf(b));
    incomingDays.forEach((day: WeekDays) => {
      if (resultString.length) {
        resultString += `, ${weekDays[day]}`;
      } else {
        resultString += `${weekDays[day]}`;
      }
    });
  }
  return resultString;
}

function convertSourceToOptionData(source: ISource[]): ISelectOption[] {
  return source.map(item => ({ value: item.name, label: item.label }));
}

function convertGroupToOptionData(data: IRuleGroup[]): ISelectOption[] {
  return data.map((item: IRuleGroup) => ({ label: item.name, value: item.id.toString() }));
}

function convertDataForMultiselect(data: IRuleGroup[]): IMultiSelectOption[] {
  return data.map((item: IRuleGroup) => ({ title: item.name, value: item.id.toString() }));
}

function replaceAtStringByIndex(str: string, index: number, replacement: string): string {
  return `${str.substr(0, index)}${replacement}${str.substr(index + replacement.length)}`;
}

function convertRuleActionsToOptionData(data: IIndexSignature): ISelectOption[] {
  return Object.keys(data).map((key: string) => ({ label: data[key], value: key }));
}

function convertToRuleGroup(originFormatGroups: IRuleGroup[], stringFormatGroups: string[]): IRuleGroup[] {
  return originFormatGroups.filter((group: IRuleGroup) => stringFormatGroups.includes(group.id.toString()));
}

function getPolicyById(policyData: IPolicy[][], id: number): IPolicy | undefined {
  // let policy = undefined;
  for (const policies of policyData) {
    var policy = policies.find((rule: IPolicy) => id === rule.id);
    if (policy) {
      return policy;
    }
  }
}


function checkZero(item) {
  if(Number(item) < 10 || Number(item) == 0) {
    return `0${item}`
  } else {
    return `${item}`
  }
}

function formatDateTime(date: string) {
  const month31 = [1,3,5,7,8,10,12]

  const timeZone = -new Date().getTimezoneOffset()/60
  let hours = Number(date.slice(11, 13))
  let minutes = date.slice(14, 16)
  let seconds = date.slice(17, 19)

  let day = date.slice(8, 10)
  let month = date.slice(5, 7)
  let year = date.slice(0, 4)

  hours = hours + timeZone

  if( 24 - Number(hours) <= 0 ) {
    let resHours = Number(hours) - 24
    let resDay = Number(day) + 1
    let resMonth = Number(month)
    let resYear = Number(year)

    if(resDay > 31 && month31.includes(resMonth) || (resDay > 30 && resMonth != 2) ) {
      resDay = 1
      resMonth = resMonth +1
    }

    if( ( resDay > 29 && resMonth == 2 && resYear%4 == 0 ) || (resDay > 28 && resMonth == 2 && resYear%4 != 0) ) {
      resDay = 1
      resMonth = resMonth +1
    }

    if(resMonth > 12) {
      resMonth = 1
      resYear = resYear + 1
    }

    return `${checkZero(resHours)}:${minutes}:${seconds} ${checkZero(resDay)}.${checkZero(resMonth)}.${checkZero(resYear)}`
  } else {
    return `${checkZero(hours)}:${minutes}:${seconds} ${day}.${month}.${year}`
  }
}

export {
  getStringIds,
  getHoursFromMask,
  getDaysFromMask,
  convertGroupToOptionData,
  getIntervalDaysFromMask,
  replaceAtStringByIndex,
  convertRuleActionsToOptionData,
  convertDataForMultiselect,
  convertToRuleGroup,
  getPolicyById,
  convertSourceToOptionData,
  formatDateTime,
}
