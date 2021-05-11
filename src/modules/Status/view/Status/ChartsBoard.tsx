import * as React from 'react';
import {Line, Pie} from 'react-chartjs-2';
import {
    createLineMock,
    createPieMock,
    findIdInArr,
    formatDataForLine,
    formatDataForPie,
    formatDataForPieByLogin
} from '../../helpers/viewHelpers';
import i18next from "i18next";
import moment from "moment";

interface IOwnProps {
  currentCharts: any;
  chartsData: any;
  getTopUsersFromGroup: any;
  setReplacedChart: any;
  getPrintedPages: any;
  getDynamicGrow: any;
  replaced: any;
}

let groupName = '';
let printedPagesAddedTitle= i18next.t('Status.byDay');
let dynamicGrowAddedTitle = i18next.t('Status.byDay');

class ChartsBoard extends React.PureComponent<IOwnProps, {}> {
  render(){
    const {
      currentCharts,
      chartsData,
      getTopUsersFromGroup,
      setReplacedChart,
      replaced,
      getPrintedPages,
      getDynamicGrow,
    } = this.props;

    const topGroupsData = chartsData.top_groups !== undefined
      ? formatDataForPie(chartsData.top_groups.groups)
      : createPieMock();
    const topUsersData = chartsData.top_users !== undefined
      ? formatDataForPieByLogin(chartsData.top_users.users)
      : createPieMock();
    const topGroupsUsersData = chartsData.top_groups_users !== undefined
      ? formatDataForPie(chartsData.top_groups_users.groupsUsers)
      : createPieMock();
    const topGroupsChart = replaced.top_groups === undefined || replaced.top_groups === 'groups'
      ? topGroupsData
      : topUsersData;
    const topPrintersData = chartsData.top_printers !== undefined
      ? formatDataForPie(chartsData.top_printers.printers)
      : createPieMock();
    const printedPagesInterval = replaced || 'DAY';
    const printedPagesChart = chartsData.printed_pages !== undefined
      ? formatDataForLine(chartsData.printed_pages.data, printedPagesInterval)
      : createLineMock();

    let printedPagesGroupsChart = createLineMock();
    let lineOptions = {}
    let DataPrintedPagesGroupsChart = {}


  if(chartsData.printed_groups_pages !== undefined) {
    const dataSet = chartsData.printed_groups_pages.data.reduce((tmp, x) => {
      const match = tmp.find(y => y.some(z => z.name === x.name));
      if (match) {
        match.push(x);
      } else {
        tmp.push([x]);
      }

      return tmp;
    }, []);

    let dataSetNoZero1 = dataSet
    const dataGroupsSet = []
    let counter = 0;
    let color = 'rgb(255, 99, 132)';
    let label;
    for(let item of dataSetNoZero1) {
      if(counter == 0) {
        color = 'rgb(255, 99, 132)'
      }
      if(counter == 1) {
        color = 'rgb(77, 31, 132)'
      }
      if(counter == 2) {
        color = 'rgb(36, 186, 28)'
      }
      if(counter == 3) {
        color = 'rgb(22, 62, 222)'
      }
      if(counter == 4) {
        color = 'rgb(169, 243, 164)'
      }
      if(counter == 5) {
        color = 'rgb(117, 20, 43)'
      }
      if(counter == 6) {
        color = 'rgb(209, 74, 6)'
      }
      if(counter == 7) {
        color = 'rgb(255, 205, 86)'
      }
      if(counter == 8) {
        color = 'rgb(255, 99, 86)'
      }
      if(counter == 9) {
        color = 'rgb(77, 99, 86)'
      }
      if(counter == 10) {
        color = 'rgb(77, 89, 76)'
      }
      if(counter == 11) {
        color = 'rgb(67, 89, 96)'
      }

      let data = item.map((item, index) => {
        label = item.name
        return {x: item.time, y: item.pages}
      })

      let set = {
        label: label,
        fill: false,
        borderColor: color,
        pointBackgroundColor: color,
        data: data,
      }
      dataGroupsSet.push(set)
      counter++;
    }

    let unit = 'day';

    if(printedPagesInterval == 'DAY') {
      unit = 'day';
    }
    if(printedPagesInterval == 'WEEK') {
      unit = 'week';
    }
    if(printedPagesInterval == 'MONTH') {
      unit = 'month';
    }

    lineOptions = {
      title: {
        display: true,
        text: currentCharts[5].title,
      },
      maintainAspectRatio: true,
      scales: {
        xAxes: [
          {
            type: "time",
            distribution: "series",
            time: {
              unit: unit,
              tooltipFormat: "DD.MM.YYYY",
              displayFormats: {
                  day: 'DD MM YYYY',
                  week: 'DD MM YYYY',
                  month: 'DD MM YYYY',
              }
            },
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              display: true,
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              drawBorder: false,
            },
            ticks: {
              display: true,
            }
          }
        ]
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltips: {
        enabled: true
      }
    };

    DataPrintedPagesGroupsChart = {
      datasets: dataGroupsSet
    }
  }


    return (
      <div className='chart-board'>
          <div className='chart-container' hidden={!currentCharts[0].isConnected}>
            <Pie
              data={topUsersData}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: currentCharts[0].title,
                },
                legend: {
                  position: 'bottom',
                },
              }}
            />
          </div>

          <div className='chart-container' hidden={!currentCharts[1].isConnected}>
            <Pie
              data={topGroupsUsersData}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: currentCharts[1].title,
                },
                legend: {
                  position: 'bottom',
                },
              }}
            />
          </div>

          <div className='chart-container' hidden={!currentCharts[2].isConnected}>
            <Pie
              data={topGroupsChart}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: currentCharts[2].title
                },
                legend: {
                  position: 'bottom',
                },
              }}
            />
          </div>

          <div className='chart-container' hidden={!currentCharts[3].isConnected}>
            <Pie
              data={topPrintersData}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: currentCharts[3].title,
                },
                legend: {
                  position: 'bottom',
                },
              }}
            />
          </div>

          <div className='chart-container' hidden={!currentCharts[4].isConnected} style={{cursor: 'pointer'}}>
            <Line
              data={printedPagesChart}
              options={{
                maintainAspectRatio: false,
                title: {
                  display: true,
                  text: currentCharts[4].title,
                },
                legend: {
                  position: 'bottom',
                  display: false,
                }
              }}
            />
          </div>

          <div className='chart-container' hidden={!currentCharts[5].isConnected} style={{cursor: 'pointer'}}>
            <Line
              data={DataPrintedPagesGroupsChart ? DataPrintedPagesGroupsChart : printedPagesGroupsChart}
              options={lineOptions ? lineOptions : null}
              height={180}
            />
          </div>

      </div>
    );
  }

}

export default ChartsBoard;
