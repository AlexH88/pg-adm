import {IGroupHeaderConfigs} from '../namespace';

const JobFormatConfigs: IGroupHeaderConfigs = {
  color: ['ЧБ', 'Цветная'],
  status: {
    printed: { label: 'Распечатано', color: 'rgb(20, 175, 89)' },
    inprocess: { label: 'Обрабатывается', color: 'rgb(241, 194, 58)' },
    wait: { label: 'Ожидает', color: 'rgb(241, 194, 58)' },
    deny_funds: { label: 'Отказ (нет средств', color: 'rgb(255, 64, 39)' },
    deny_policy: { label: 'Отказ (правило)', color: 'rgb(255, 64, 39)' },
    corrupted: { label: 'Ошибка', color: 'rgb(255, 64, 39)' },
    queue: { label: 'В очереди', color: '#2ea5ff' },
  },
};

export { JobFormatConfigs };
