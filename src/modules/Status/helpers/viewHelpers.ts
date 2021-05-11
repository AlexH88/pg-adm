import {IValue} from '../view/Status/Status';

// ------------------------------------------------------------------
// ChartBoards helpers

const createPieMock = () => {
  const pieMock = {
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: [],
      label: '',
    }],
    labels: ['', '', '', '', ''],
  };

  return pieMock;
};

const createLineMock = () => {
  const lineMock = {
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: '',
      borderColor: '',
      fill: false,
      label: '',
    }],
    labels: ['', '', '', '', ''],
  };

  return lineMock;
};

const formatDataForPie = (data: any[]) => {

  let result = {
    datasets: [{
      data: [] as any[],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(169, 243, 164)',
      ],
      label: 'top_groups',
    }],
    labels: [] as string[],
  };

  for (let item of data){
    result.labels.push(item.name);
    result.datasets[0].data.push(item.pages);
  }

  return result;
};

const formatDataForPieByLogin = (data: any[]) => {
  let result = {
    datasets: [{
      data: [] as any[],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(75, 192, 192)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(169, 243, 164)',
      ],
      label: 'top_groups',
    }],
    labels: [] as string[],
  };

  for (let item of data){
    result.labels.push(item.login);
    result.datasets[0].data.push(item.pages);
  }

  return result;
};

const formatDataForLine = (data: any[], interval: string) => {

  const createTimeBorders = (items: any) => {
    let timeSet: any = {};

    items.forEach((point: any) => {
      timeSet[point.time] = true;
    });

    let numArr: number[] = [];
    for (const str in timeSet) {
      if (str in timeSet && timeSet.hasOwnProperty(str)) {
        numArr.push(parseInt(str, 10));
      }
    }
    return {
      start: Math.min(...numArr),
      end:   Math.max(...numArr),
    };
  };

  const createLabels = (start: number, end: number, diff: number): string[] => {
    let result: string[] = [];
    let msStart: number = start * 1000;
    let msEnd: number = end * 1000;

    if (diff === 0) {
      let month;
      let year;
      while (msStart <= msEnd) {
        result.push(new Date(msStart).toLocaleDateString());
        year = new Date(msStart).getFullYear();
        month = new Date(msStart).getMonth();
        month += 1;
        msStart = new Date(year, month, 1).getTime();
      }
    } else {
      while (msStart <= msEnd) {
        result.push(new Date(msStart).toLocaleDateString());
        msStart += diff;
      }
    }
    return result;
  };

  const createMapFromArr = (arr: string[]) => {
    let obj: any = {};
    for (const index in arr) {
      if (index in arr) {
        obj[arr[index]] = index;
      }
    }
    return obj;
  };

  const fillNullOnLength = (labels: string[]): number[] => {
    let result: number[] = [];
    for (let i = 0, length = labels.length; i < length; i++) {
      result[i] = 0;
    }

    return result;
  };

  let result = {
    datasets: [{
      data: [] as any[],
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      fill: false,
      label: 'Объем печати',
    }],
    labels: [] as string[],
  };

  let diff: number = 0;
  switch (interval) {
    case 'DAY':
      diff = 86400 * 1000;
      break;
    case 'WEEK':
      diff = 86400 * 1000 * 7;
      break;
    case 'MONTH':
      diff = 0;
      break;
    default:
      break;
  }

  const borders = createTimeBorders(data);
  const labels: string[] = createLabels(borders.start, borders.end, diff);
  result.labels = labels;
  result.datasets[0].data = fillNullOnLength(labels);
  const labelsMap = createMapFromArr(labels);

  for (const item of data){
    const formatedDate = new Date(item.time * 1000).toLocaleDateString();
    if (labelsMap[formatedDate] ) {
      result.datasets[0].data[labelsMap[formatedDate]] = parseInt(item.pages, 10);
    }
  }

  return result;
};

const findIdInArr = (arr: any[], name: string) => {
  for (let item of arr) {
    if (item.name === name) {
      return item.id;
    }
  }
};

// ------------------------------------------------------------------
// Status helpers

const connectAllCharts = (initialCharts: any[]) => {
  return initialCharts.map(item => {
    item.isConnected = true;
    return item;
  });
};

const getSelectedValues = (currentCharts: any[]): any[] => {
  let namesArr: string[] = [];
  currentCharts.forEach((item: IValue) => {
    if (item.isConnected) {
      namesArr.push(item.value);
    }
  });
  return namesArr;
};

const getCleanValues = (currentCharts: any[]) => {
  return currentCharts.map(item => {
    const { title, value } = item;
    return {
      title,
      value,
    };
  });
};

// ------------------------------------------------------------------

export {
  createLineMock,
  createPieMock,
  formatDataForPie,
  formatDataForPieByLogin,
  formatDataForLine,
  findIdInArr,
  connectAllCharts,
  getSelectedValues,
  getCleanValues
};
