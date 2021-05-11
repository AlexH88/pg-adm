import * as React from 'react';
import {block} from 'bem-cn';
import './Tabs.styl';

interface IState {
  active: any;
  style: any;
}

const b = block('modal');

class Tabs extends React.Component<any> {
  public state = {
    active: 0
  }
  
  private select = (i) => {
    let _this = this;
    return function() {
      _this.setState({
        active: i
      });
    }
  }
  
  private renderTabs = () => {
    return React.Children.map(this.props.children, (item:any, i:any) => {
      if(item) {
        if (i%2 === 0) {
          let active = this.state.active === i ? 'active' : '';
          return <a onClick={this.select(i)} className={`${active} tab`}>{item}</a>;
        }
      } else {
        return null
      }
    });
  }
  
  private renderContent() {
    return React.Children.map(this.props.children, (item:any, i:any) => {
      if (i-1 === this.state.active) {
        return <div className='content'>{item}</div>;
      } else {
        return;
      }
    });
  }
  
  public render() {
    const {style=null} = this.props;

    return (
      <div className="tabs" style={style}>
        <div className='tabs_header'>{this.renderTabs()}</div>
        {this.renderContent()}
      </div>
    );
  }
}

export default Tabs;