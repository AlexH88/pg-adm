// import {IPeriod} from "../namespace/apiCommunication";

interface IReduxState {
  showReportModal: boolean;
  showRegularModal: boolean;
  showRemoveModal: boolean;
  showPdfModal: boolean;
  showReportSpinner: boolean;
  pdfData: any;
  userDynamicReportData: any;
  userGroupsDynamicReportData: any;
  printerDynamicReportData: any;
  printerGroupsDynamicReportData: any;
}

interface IFailedResponse {
  error: {};
}

interface ISuccessResponse {
  data: {};
}

export {
  IReduxState,
  IFailedResponse,
  ISuccessResponse,
}

export * from './actionTypes';
export * from './apiCommunication';

export const initialTypeFilter = [
  {id:0 , name:'pages', label:'Количество страниц', isChecked: true},
  {id:1 , name:'jobs', label:'Количество заданий', isChecked: false},
  {id:2 , name:'price', label:'Общая стоимость', isChecked: false},
];
export const initialIntervalFilter = [
  {id:0 , name:'day', label:'День', isChecked: true},
  {id:1 , name:'week', label:'Неделя', isChecked: false},
  {id:2 , name:'month', label:'Месяц', isChecked: false},
];

// --------------------------------------------------------------------

export function formatTimeReport(resp: any, yAxis: string, interval: string, label:string) {

  const createTimeBorders = (resp: any) => {
    let timeSet: any = {};
    for (let user in resp){
      resp[user].items.forEach((point: any)=>{
        timeSet[point.time]=true;
      });
    }
    let numArr: number[] = [];
    for (let str in timeSet){
       numArr.push(+str);
    }
    let borders = {
      start: Math.min(...numArr),
      end:   Math.max(...numArr)
    }
    return borders;
  }

  const createLabels = (start: number, end: number, diff: number): string[] =>{
    let result: string[] = [];
    let msStart: number = start*1000;
    let msEnd: number = end*1000;

    if (diff == 0){
      let month;
      let year;
      while(msStart<=msEnd){
        result.push(new Date(msStart).toLocaleDateString());
        year = new Date(msStart).getFullYear();
        month = new Date(msStart).getMonth();
        month +=1
        msStart = new Date(year, month, 1).getTime();
      }
    } else {
      while(msStart<=msEnd){
        result.push(new Date(msStart).toLocaleDateString());
        msStart += diff;
      }
    }

    return result;
}

  const createMapFromArr = (arr: string[]) => {
    let obj: any = {};
    for (let index in arr){
      obj[arr[index]] = index;
    }
    return obj;
  }

  const fillNullOnLength = (labels: string[]): number[] => {
    let result: number[] = [];
    for(let i=0; i<labels.length; i++){
      result[i]=0;
    }
    return result;
  }

// -----------------------------------------------------------

  let diff: number = 0;
  switch (interval){
    case 'day':
      diff = 86400*1000;
      break;
    case 'week':
      diff = 86400*1000*7;
      break;
    case 'month':
      diff = 0;
      break;
  }

  let borders = createTimeBorders(resp);
  let labels: string[] = createLabels(borders.start, borders.end, diff);
  let labelsMap = createMapFromArr(labels);
  let data = {
      datasets: [] as any[],
      labels: labels
  };
  let dataset = {
      data: [] as any[],
      label: '',
      fill: false,
      backgroundColor: '',
      borderColor: ''
  };
  let colors = [
    "rgb(54, 162, 235)",
    "rgb(255, 99, 132)",
    "rgb(255, 205, 86)",
    "rgb(150, 192, 192)",
    "rgb(169, 243, 164)",
    "rgb(100, 100, 170)",
    "rgb(200, 50, 164)",
    "rgb(255, 150, 100)",
    "rgb(10, 100, 170)",
    "rgb(100, 200, 170)"
  ];
  let colorCount = 0;

  for (let user in resp){
    let userSet = Object.assign({}, dataset);
    userSet.label = resp[user].info[label];
    userSet.data = fillNullOnLength(labels);
    userSet.backgroundColor=colors[colorCount];
    userSet.borderColor=colors[colorCount];
    colorCount++;

    resp[user].items.forEach((point: any)=>{
      let formatedDate = new Date(point.time*1000).toLocaleDateString();
      if( labelsMap[formatedDate] ){
        userSet.data[labelsMap[formatedDate]] = +point[yAxis];
      };
    });
    data.datasets.push(userSet);
  }

  return data;
}
