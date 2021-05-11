import {IGroupHeaderConfigs} from '../namespace';

const headerGroupConfigs: IGroupHeaderConfigs = {
  initialRestricted: ['Нет', 'Да'],
  type: ['Обновление', 'Начисление'],
  period: {
    day: 'Ежедневно',
    week: 'Еженедельно',
    month: 'Ежемесячно',
  },
};

export { headerGroupConfigs };
