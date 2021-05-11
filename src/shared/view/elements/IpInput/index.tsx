import * as React from 'react';
import ReactDOM from 'react-dom'
import {block} from 'bem-cn';
import IPut from 'iput';
import './style.styl';

interface IOwnProps {
  label: string;
  disabled?: boolean;
  value: any;
  prefix?: string;
  onChange(e: React.FormEvent<HTMLInputElement>): void;
}

class IpInput extends React.Component<IOwnProps, {}> {

  private b = block('ip-wrapper');

  state = { focus: false }

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
          focus: false
      });
    }
  }

  onFocusate = () => {
    this.setState({focus: true})
  }

  public render() {
    const b = this.b;
    let { label, value, onChange, disabled } = this.props;
    const focus = this.state.focus ? 'ip-bar' : null

    if(value == '') {
      value = "..."
    }

    return (
      <div className={b({disabled: disabled})}>
        <span className={b('label')}>{label}</span>
        <div className={`${b('frame')} ${focus}`}  onClick={this.onFocusate}>
          <IPut
            defaultValue={value}
            onChange={onChange}
          />
          <div className={b('bar')}/>
        </div>
      </div>
    );
  }
}

export default IpInput;
