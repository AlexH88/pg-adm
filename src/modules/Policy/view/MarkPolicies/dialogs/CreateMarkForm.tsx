import * as React from 'react';
import './style.styl';
import {Button, CheckboxMultiselect, RadioGroup, TextInput} from 'shared/view/elements';
import {block} from 'bem-cn';
// import * as logo from './../../../../Login/view/images/logo.png';
import {connect} from 'react-redux';
import {bind} from 'decko';
import {bindActionCreators} from 'redux';
import {IPolicy} from './../../../namespace/apiCommunication';
import Slider from 'react-toolbox/lib/slider';
import {Modal} from 'shared/view/components';
import {AddLabelDialog} from './AddLabelDialog';
import {convertDataForMultiselect} from 'shared/helpers/formatData';
import actions from './../../../redux/actions/index';
import {Card} from 'react-toolbox/lib/card';
import {policyApi} from './../../../api';
import {CanvasController} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor';
import {Label} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor/label';

interface IStateProps {
  choosenMarkPolicyEdit: any;
  userGroups: any[];
  printerGroups: any[];
  textLabelsData: any[];
  imageId: any;
}

interface IDispatchProps {
  saveMarkPolicy: typeof actions.saveMarkPolicy;
  loadTextData: typeof actions.loadTextData;
  uploadImage: typeof actions.uploadImage;
  getImage: typeof actions.getImage;
}

interface IOwnProps {
  onCancel(): void;
}

function mapStateToProps(state: any): IStateProps {
  return {
    choosenMarkPolicyEdit: state.policy.choosenMarkPolicyEdit,
    userGroups: state.policy.userGroups,
    printerGroups: state.policy.printerGroups,
    textLabelsData: state.policy.textLabelsData,
    imageId: state.policy.imageId,
  }
}

function mapDispatchToProps(dispatch: any): IDispatchProps {
  return bindActionCreators({
    saveMarkPolicy: actions.saveMarkPolicy,
    loadTextData: actions.loadTextData,
    uploadImage: actions.uploadImage,
    getImage: actions.getImage,
  }, dispatch);
}

type IFormat = 'a3' | 'a4' | 'a5';
type IOrientation = 'portrait' | 'landscape';

const formats: any = {
  'a3': {
    widthMM: 297,
    heightMM: 420,
  },
  'a4': {
    widthMM: 210,
    heightMM: 297,
  },
  'a5': {
    widthMM: 148,
    heightMM: 210,
  },
}

const formatTypes: any = {
  'barcode' : 'штрих-код',
  'qrcode' : 'QR-код',
  'image' : 'изображение',
  'text' : 'текст',
}

function getHeightInMM(format: any, orientation: any) {
  return orientation === 'portrait' ? formats[format].heightMM : formats[format].widthMM;
}

function getWidthInMM(format: any, orientation: any) {
  return orientation === 'portrait' ? formats[format].widthMM : formats[format].heightMM;
}

const b = block('list_a4');
const b2 = block('selected-labels');

function getSizeByFormat(format: IFormat, orientation: IOrientation) {
  const width = 420;
  const height = 594;

  return orientation === 'portrait' ? { width, height } : { width: height, height: width }
}

interface IState {
  showHint: boolean;
  showAddLabelDialog: boolean;
  boxHeight: number;
  boxWidth: number;
  selectedUserGroups: any[];
  selectedPrinterGroups: any[];
  showSpinner: boolean;
  currentPolicy: IPolicy;
  isUploadCancel: boolean;
  step: 1 | 5 | 10;
  labels: any[]; // TODO
  selectedLabel: any;
}

class CreateMarkFormPure extends React.Component<IStateProps & IDispatchProps & IOwnProps, IState> {

  canvas: HTMLCanvasElement;
  controller: CanvasController;

  state: IState = {
    showHint: false,
    showAddLabelDialog: false,
    boxHeight: 594,
    boxWidth: 420,
    showSpinner: false,
    isUploadCancel: false,
    selectedUserGroups: [],
    selectedPrinterGroups: [],
    currentPolicy: {
      id: -1,
      state: true,
      owner: 'asdasd',
      owner_id: 1,
      name: '',
      operator_id: 2,
      list_format: {
        orientation: 'portrait',
        format: 'a4',
      },
      labels: [],
    },
    step: 5,
    labels: [],
    selectedLabel: null
  }

  @bind
  public setLabels(labels: any[]) {
    this.setState({ ...this.state, labels});
  }

  @bind
  public setSelectedLabel(label: any) {
    this.setState({ ...this.state, selectedLabel: label }, () => {
      this.setLabels(this.controller.labels);
    });
  }

  public componentDidMount() {
    const { choosenMarkPolicyEdit } = this.props;
    const { currentPolicy } = this.state;

    console.log(choosenMarkPolicyEdit);

    if (choosenMarkPolicyEdit) {
      this.setState({
        ...this.state,
        selectedUserGroups: choosenMarkPolicyEdit.usergroups || [],
        selectedPrinterGroups: choosenMarkPolicyEdit.printergroups || [],
        currentPolicy: {
          ...currentPolicy,
          name: choosenMarkPolicyEdit.name,
          id: choosenMarkPolicyEdit.id,
          list_format: {
            ...currentPolicy.list_format,
            orientation: choosenMarkPolicyEdit.list_format.orientation,
            format: choosenMarkPolicyEdit.list_format.format,
          }
        }
      }, () => {
        this.controller = new CanvasController(this.canvas, this);
        this.controller.setLabels(this.props.choosenMarkPolicyEdit.labels);
      });
    } else {
      this.controller = new CanvasController(this.canvas, this);
      this.controller.setLabels([]);
    }
  }

  @bind
  public componentWillUnmount() {
    if (this.controller) {
      this.controller.destroy();
    }
  }

  @bind
  public switchAddLabelDialog() {
    this.setState(prevState => { return {
      ...prevState,
      showAddLabelDialog: !this.state.showAddLabelDialog,
      isUploadCancel: true,
    }})
  }

  @bind
  public async onAddNewLabel(newLabel: any) {

    try {
      if (newLabel.type === 'image') {

        this.setState(prevState => { return {
          ...prevState,
          isUploadCancel: false,
          showSpinner: true
        }});

        const form = new FormData();
        form.append('file', newLabel.image_data);
        const uploadResponse = (await policyApi.uploadFile(form)).response;
        newLabel.image_id = uploadResponse.id;

        const { isUploadCancel } = this.state;
        if (isUploadCancel) {
          this.setState({
            ...this.state,
            showSpinner: false
          });
          return;
        }

        this.setState({
          ...this.state,
          showSpinner: false
        });
      } else {
        this.setState({
          ...this.state,
          showSpinner: false
        });
      }
    } catch (error) {
      console.error(error);
    }
    this.controller.addLabel(newLabel);
    this.switchAddLabelDialog();
  }

  @bind
  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  render() {
    const { showAddLabelDialog, selectedUserGroups, selectedPrinterGroups } = this.state;
    const { format, orientation } = this.state.currentPolicy.list_format;
    const { printerGroups, userGroups } = this.props;
    const { onCancel } = this.props;

    return (
      <div style={{ userSelect: 'none', maxHeight: '80vh', overflowY: 'auto', overflowX: 'hidden', minWidth: '85vw' }}>

        <Modal
          title="Новая метка"
          isOpen={showAddLabelDialog}
          onClose={this.switchAddLabelDialog}
        >
          <AddLabelDialog
            allTextLabels={this.props.textLabelsData}
            onAddNewLabel={this.onAddNewLabel}
            showSpinner={this.state.showSpinner}
          />
        </Modal>
        <div className={b('format')}>Формат: {format}</div>
        <div className={b('table')}>
          <div className={b('column')}>

            <canvas
              ref={this.setCanvas}
              width={getSizeByFormat(format, orientation).width}
              height={getSizeByFormat(format, orientation).height}
              style={{
                border: '1px solid #2ea5ff',
                background: 'ghostwhite'
              }}
            />

          </div>
          <div className={b('column')}>
            <div
              style={{color: '#2ea5ff', cursor: 'pointer' }}
            >
              <span onMouseEnter={() => { this.setState({ ...this.state, showHint: true }) }}>Сетка</span>
            </div>
            <div style={{position: 'absolute', width: '300px', zIndex: 999, marginTop: '-5px'}}>
              <div className={b2()} style={{display: this.state.showHint ? 'inline-block' : 'none' }}>
                <Card
                  style={{padding: '5px', color: 'black'}}
                  onMouseLeave={() => { this.setState({ ...this.state, showHint: false }) }}
                >
                  <RadioGroup
                    name="step"
                    value={String(this.state.step)}
                    onChange={(value: string) => {

                      this.setState({
                        ...this.state,
                        step: Number(value) as 1 | 5 | 10
                      });

                    }}
                    values={[
                      { value: '1', label: 'Нет' },
                      { value: '5', label: '5 пикселей' },
                      { value: '10', label: '10 пикселей' },
                    ]}
                  />
                </Card>
              </div>
            </div>
            <TextInput
              label="Название политики*"
              value={this.state.currentPolicy.name}
              onChange={(val: any) => { this.setState({
                ...this.state,
                currentPolicy: {
                  ...this.state.currentPolicy,
                  name: val,
                }
              }) }}
            />
            <span
              title={this.state.labels.length >= 4 ? 'Вы добавили максимальное кол-во меток' : 'Добавить новую метку'}
            >

            <div style={{ float: 'left', marginTop: '10px', position: 'relative', zIndex: 10 }}>
              <span
                className={this.state.labels.length >= 4 ? block('btn-sm-disabled')() : block('btn-sm')()}
                onClick={this.state.labels.length >= 4 ? () => {} : this.switchAddLabelDialog}
              >
                Новая метка
              </span>
            </div>

            </span>

            <div className={b('groups')}>
              <div className={b('groups-column')}>
                <CheckboxMultiselect
                  title="Группы пользователей"
                  values={convertDataForMultiselect(userGroups)}
                  selectedValues={selectedUserGroups.map(item => String(item))}
                  onChange={this.onChangeMultiCheckbox.bind(this, 'users')}
                />
              </div>
              <div className={b('groups-column')}>
                <CheckboxMultiselect
                  title="Группы принтеров"
                  values={convertDataForMultiselect(printerGroups)}
                  selectedValues={selectedPrinterGroups.map(item => String(item))}
                  onChange={this.onChangeMultiCheckbox.bind(this, 'printers')}
                />
              </div>
            </div>

            <hr />
            <RadioGroup
              name="orientation"
              value={orientation}
              onChange={(value: IOrientation) => { 
                this.onChangeOrientation(value);
                this.setState(prevState => { return {
                   ...prevState,
                   currentPolicy: {
                     ...prevState.currentPolicy,
                     list_format: {
                       ...prevState.currentPolicy.list_format,
                       orientation: value
                     }
                   }
                } });
                this.onRefreshLabels();
              }}
              values={[
                { value: 'portrait', label: 'Книжная' },
                { value: 'landscape', label: 'Альбомная' },
              ]}
            />
            <hr />
            <RadioGroup
              name="format"
              value={format}
              onChange={(value: IFormat) => { 
                this.onChangeMarksSize(this.state.currentPolicy.list_format.format, value);
                this.setState((prevState: IState) => { return {
                  ...prevState,
                   currentPolicy: {
                     ...prevState.currentPolicy,
                     list_format: {
                       ...prevState.currentPolicy.list_format,
                       format: value
                     }
                    }
                   } });
                this.onRefreshLabels();
              }}
              values={[
                { value: 'a3', label: 'A3' },
                { value: 'a4', label: 'A4' },
                { value: 'a5', label: 'A5' },
              ]}
            />
            <hr />
            Установленные метки
            <div className={b2()}>
                {
                  this.state.labels.map((label: any, index: number) => (
                    <div
                      className={b2('label-')}
                      style={{ background: label.isSelected ? '#eee' : 'transparent' }}
                      key={index}
                    >
                      <span
                        className={b2('name')}
                        onClick={this.onSelectLabel.bind(this, index)}
                      >Метка {index + 1} ({formatTypes[label.type]})</span>
                      <span
                        title="Удалить"
                        className={b2('close-span')}
                        onClick={this.onRemoveLabel.bind(this, index)}
                      >
                        X
                      </span>
                    </div>
                  ))
                }
            </div>
            {
              (this.state.selectedLabel && this.state.selectedLabel.type !== 'barcode')
                || (this.state.selectedLabel && this.state.selectedLabel.type === 'text') ? <hr /> : null
            }
            {
              this.state.selectedLabel && this.state.selectedLabel.type !== 'barcode' ?
            <div className={b('slider')}>
              Прозрачность
              <Slider
                min={0}
                max={1}
                value={1 - this.state.selectedLabel.opacity}
                onChange={this.onOpacityChange}
              />
            </div>
            :
            null
            }
            {
              this.state.selectedLabel && this.state.selectedLabel.type === 'text' ?
            <div>
              Размер шрифта {Math.round(this.state.selectedLabel.fontSize)} px
              <Slider
                step={1}
                min={8}
                max={72}
                value={this.state.selectedLabel.fontSize}
                onChange={this.onFontSizeChange} 
              />
            </div>
            :
            null
            }
          </div>
        </div>
        <div className={b('footer')}>
          <Button
            label="Отмена"
            onClick={onCancel}
          />
          <Button
            isPrimary
            onClick={this.onSaveCoords}
            label="Сохранить"
          />
        </div>
      </div>
    );
  }

  @bind
  public onChangeMarksSize(prevFormat: IFormat, newFormat: IFormat) {
    const changing: any = {
      'a3-a4': 2,
      'a4-a3': 0.5,
      'a3-a5': 4,
      'a5-a3': 0.25,
      'a4-a5': 2,
      'a5-a4': 0.5,
    };
    const coefficient = changing[`${prevFormat}-${newFormat}`];
    const { offsetWidth, offsetHeight } = this.canvas;
    this.controller.changeFormat(coefficient);
  }

  @bind
  public onRemoveLabel(index: number) {
    this.controller.removeLabel(index);
  }

  @bind
  public onSelectLabel(index: number) {
    this.controller.selectLabel(index);
  }
  
  @bind
  public onRefreshLabels() {

  }

  @bind
  public onChangeOrientation(newOrientation: IOrientation) {
    const { boxWidth, boxHeight } = this.state;

    const newBoxHeight = newOrientation === 'portrait' ? boxHeight : boxWidth;
    const newBoxWidth = newOrientation === 'portrait' ? boxWidth : boxHeight;

    this.controller.changeOrientation();
  }

  @bind
  public onSaveCoords() {
    const { saveMarkPolicy } = this.props;
    const { currentPolicy, selectedUserGroups, selectedPrinterGroups } = this.state;

    const { format, orientation } = currentPolicy.list_format;

    const sheetWidthMM = getWidthInMM(format, orientation);
    const sheetHeightMM = getHeightInMM(format, orientation);

    const sheetWidthPX = getSizeByFormat(format, orientation).width;
    const sheetHeightPX = getSizeByFormat(format, orientation).height;

    const onePercentWidthInPx = sheetWidthPX / 100;
    const onePercentHeightInPx = sheetHeightPX / 100;

    const newData: any = {
      id: currentPolicy.id,
      labels: this.controller.labels.map((label: Label) => {

        const specialAngle = label.angle === 90 || label.angle === 270;

        const labelData: any = {
          ...label.labelData,
          Y: (label.Y / onePercentHeightInPx).toFixed(4),
          X: (label.X / onePercentWidthInPx).toFixed(4),
          H: (label.H / onePercentHeightInPx).toFixed(4),
          W: (label.W / onePercentWidthInPx).toFixed(4),
          y: (label.y / onePercentHeightInPx).toFixed(4),
          x: (label.x / onePercentWidthInPx).toFixed(4),
          h: (label.h / onePercentHeightInPx).toFixed(4),
          w: (label.w / onePercentWidthInPx).toFixed(4),
          // h: (label.h / (specialAngle ? onePercentWidthInPx : onePercentHeightInPx)).toFixed(4),
          // w: (label.w / (specialAngle ? onePercentHeightInPx : onePercentWidthInPx)).toFixed(4),
          font_size: label.fontSize,
          opacity: label.opacity,
          angle: label.angle
        };

        delete labelData.imageBase64;
        return labelData;
      }),
      name: currentPolicy.name,
      usergroups: selectedUserGroups.map(item => Number(item)),
      printergroups: selectedPrinterGroups.map(item => Number(item)),
      operator_id: 1,
      state: true,
      list_format: currentPolicy.list_format,
    };

    // console.log(newData);
    saveMarkPolicy(newData);
  }

  @bind
  public onOpacityChange(newVal: number) {
    this.controller.changeOpacity(this.controller.labels.indexOf(this.state.selectedLabel), (1 - newVal));
  }

  @bind
  public onFontSizeChange(newVal: number) {
    this.controller.changeFontSize(this.controller.labels.indexOf(this.state.selectedLabel), newVal);
  }

  @bind
  private onChangeMultiCheckbox(type: string, value: string) {
    const { selectedUserGroups, selectedPrinterGroups } = this.state;

    const newGroups = type === 'users' ? [ ...selectedUserGroups ] : [ ...selectedPrinterGroups ];

    if (newGroups.includes(Number(value))) {
      const index = newGroups.indexOf(value);
      newGroups.splice(index, 1);
    } else {
      newGroups.push(Number(value));
    }

    this.setState({
      ...this.state,
      [type === 'users' ? 'selectedUserGroups' : 'selectedPrinterGroups']: newGroups
    });

  }

}

export const CreateMarkForm = connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps)(CreateMarkFormPure);