import * as React from 'react';
import ReactDOM from 'react-dom'
import {FC, ReactElement} from 'react';
import { bind } from 'decko';
import Tooltip from '../Tooltip/';
import InfoIcon from './infoIcon';
import './style.styl';

interface Props {
  title: any;
  items: any;
//  onClick(): void;
}


class ItemTooltip extends React.PureComponent<Props, {}> {
  state = {
    visible: false
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside = event => {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {
      this.setState({
          visible: false
      });
    }
  }

  @bind
  private onShow() {
    this.setState({
        visible: true
    });
  }

  public render() {
    const { title, items } = this.props;
    return (
      <div className='info'>
        <div
          onClick={this.onShow}
          style={{display: 'flex'}}
        >
          <InfoIcon />
          <div style={{marginLeft: '5px'}}>
            {title}
          </div>
        </div>
        {
          this.state.visible ?
          <div className="tooltip-wrapper">
            <Tooltip
              item={items}
              tooltipPosition={{
                right: '305px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </div> :
          null
        }
      </div>
    );
  }
}


export default ItemTooltip;