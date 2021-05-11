import * as React from 'react';
import {block} from 'bem-cn';
import {bind} from 'decko';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Card} from 'react-toolbox/lib/card';
import {Checkbox, RadioGroup} from '../../../../shared/view/elements';
import RemoveModal from '../../../../shared/view/components/RemoveModal/index';
import { deleteFloor, printerSizeRate } from 'features/SnmpShowResource/redux/actions/communication';
import { initialResource } from 'features/SnmpShowResource/redux/data/initial';
import { ISnmpReduxState } from 'features/SnmpShowResource/namespace/index';
import injectResource from 'shared/helpers/injectResource';

import './CheckboxMultiselect.styl';
import * as cardTheme from './cardTheme.styl';

export interface IValue {
  value: string;
  disabled?: boolean;
  required?: boolean;
}

interface IOwnProps {
  values: IValue[];
  selectedValues: string[];
  onChange: (value: string, isCheck: boolean) => void;
  onOpenChange?(opened: boolean): void;
  onAdd?: any;
  deleteFloor?: any;
  printerSizeRate?: any;
}

interface IDispatchProps {
  deleteFloor: typeof deleteFloor;
  printerSizeRate: typeof printerSizeRate;
}

interface IState {
  isShow: boolean;
  isShowPrinterIconSize: boolean;
  showRemoveFloorModal: boolean; // floor
}

interface IStateProps {
  pictureId: number;
  printerSize: string;
  pages: any;
}

function mapStateToProps(state: ISnmpReduxState): IStateProps {
  const resourceState = state.SnmpShowResource['floors'];
  const { pictureId, printerSize, pages } = resourceState || initialResource;

  return { pictureId, printerSize, pages }
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    deleteFloor: injectResource('floors', deleteFloor),
    printerSizeRate: injectResource('floors', printerSizeRate)
  }, dispatch);
}

class SnmpRadioButtonSelect extends React.PureComponent<IOwnProps & IStateProps, IState > {
  public state = {
    isShow: false,
    isShowPrinterIconSize: false,
    showRemoveFloorModal: false
  };

  private b = block('checkbox-multiselect--wrapper');

  public render() {
    const b = this.b;
    const { values, onChange, pages } = this.props;
    const { isShow } = this.state;

    const disabled = values.length === 1;

    return (
      <div className={b()} >
        <div
          className={isShow ? b('button-dark') : b('button')}
          style={disabled ? { color: '#bbb' } : { }}
          onClick={disabled ? () => {} : this.togglePopover}
        >
          Содержимое
          <span className={b('expander')} />
        </div>

        <div className={b('popover', { activated: isShow })}>
          <Card theme={cardTheme}>
                  <div className={b('checkbox')} onClick={this.togglePopoverIcon}>
                    <p style={{marginTop: 10, marginBottom: 10}}>Размер принтеров ></p>
                  </div>

                  { this.state.isShowPrinterIconSize && 
                      <div
                      style={{
                        position: "absolute", 
                        zIndex: 10000, 
                        top: -1,
                        right: -73,
                        padding: 10,
                        backgroundColor: "#fff",
                        height: 70,
                        borderRadius: 2,
                        border: '1px solid #d8d8d8'
                    }}>
                        <RadioGroup
                          name="printerSize"
                          value={this.props.printerSize}
                          printerSize
                          printerSizeX={this.printerSizeX}
                          values={[
                            { value: '1x', label: "1x",},
                            { value: '2x', label: "2x"},
                          ]}
                        />
                    </div>
                  }

                  


                <div className={b('checkbox')} onClick={this.props.onAdd}>
                  <p style={{marginTop: 0, marginBottom: 10}}>Добавить этаж</p>
                </div>

                  {pages.length === 0 ?null : 
                    <div className={b('checkbox')} onClick={this.switchRemoveFloorModalTrue}>
                      <p style={{marginTop: 0, marginBottom: 10}}>Удалить этаж</p>
                    </div>
                  }
               

          </Card>
        </div>
        {isShow && <div onClick={this.togglePopover} className={b('overlay')}/>}

        <RemoveModal
          isOpen={this.state.showRemoveFloorModal}
          alertMessage={"Вы действительно хотите удалить этаж?"}
          onRemove={this.deleteFloor}
          onClose={this.switchRemoveFloorModalFalse}
          planFloor={true}
        />
      </div>
    );
  }

  @bind
  public printerSizeX(rate){
    const { printerSizeRate } = this.props;
    console.log('вид', rate)
    printerSizeRate(rate)
  }

  @bind
  public deleteFloor() {
    const { pictureId, deleteFloor } = this.props;
    deleteFloor(pictureId)

    this.setState({
      showRemoveFloorModal: false,
    });
  }

  @bind
  public switchRemoveFloorModalFalse(){
    this.setState({
      showRemoveFloorModal: false,
    });
  }

  @bind
  public switchRemoveFloorModalTrue(){
    this.setState({
      showRemoveFloorModal: true,
    });
  }

  @bind
  private togglePopover() {
    this.setState((prevState) => {
      const isShow = !Boolean(prevState.isShow);

      if (this.props.onOpenChange) {
        this.props.onOpenChange(isShow);
      }

      return { isShow };
    });
  }

  @bind
  private togglePopoverIcon() {
    this.setState((prevState) => {
      const isShowPrinterIconSize = !Boolean(prevState.isShowPrinterIconSize);

      if (this.props.onOpenChange) {
        this.props.onOpenChange(isShowPrinterIconSize);
      }

      return { isShowPrinterIconSize };
    });
  }
}


export { SnmpRadioButtonSelect };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(SnmpRadioButtonSelect);
