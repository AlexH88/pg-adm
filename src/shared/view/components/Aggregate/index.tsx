import * as React from 'react';
import {block} from 'bem-cn';
import './style.styl';

export interface IStat {
  title: string;
  value: string | number;
}

interface IProps {
  stats: IStat[];
}

class Aggregate extends React.Component<IProps, {}> {

  private b = block('aggregate');

  public render() {
    const b = this.b;
    const { stats } = this.props;
    return (
      <div className={b()}>
        {
          stats.map((stat: IStat, index: number) => (
            <div key={index} className={b('stat')}>
              <span className={b('title')}>{stat.title}:</span> <span className={b('value')}>{stat.value}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Aggregate;
