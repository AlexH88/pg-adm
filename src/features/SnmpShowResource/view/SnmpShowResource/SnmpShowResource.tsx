import * as React from 'react';
import { block } from 'bem-cn';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bind } from 'decko';
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TypesResources } from 'shared/types/app';
import { SnmpAggregate } from 'shared/view/components';
import { IconButton } from 'shared/view/elements';
import injectResource from 'shared/helpers/injectResource';
import { address } from 'shared/api/HttpActions';
import { actions } from '../../redux';
import { initialResource } from '../../redux/data/initial';
import { ISnmpReduxState,ISnmpResourceReduxState } from '../../namespace';
import './SnmpShowResource.styl';
import AddIcon from './addIcon';
import DeleteIcon from './deleteIcon';
import ExpandIcon from './expandIcon';
import SnmpPagination from '../SnmpPagination/SnmpPagination';
import { AutocompleteFilter } from 'shared/view/components';
import { getSearchOptions } from 'features/filterResource/redux/actions/communication';
import { Stage, Layer, Image } from 'react-konva';
import Konva from 'konva';
import * as printer_on from './images/printer_on.svg';
import * as printer_off from './images/printer_off.svg';
import InfoIcon from '../../../../modules/Printers/view/Printers/infoIcon';
import { Icon } from '../../../../shared/view/elements';
import RemoveModal from '../../../../shared/view/components/RemoveModal/index';
import { deletePrinter } from 'features/SnmpShowResource/redux/actions/communication';
import { deleteFloor } from 'features/SnmpShowResource/redux/actions/communication';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import * as circularTheme from 'shared/view/components/Table/circularTheme.styl';
import {generateIdElement} from 'shared/helpers';

interface IState {
  bodyPicture: boolean;
  modalAddPrinters: boolean;
  currentPage: any;
  rate: number;
  hoveredItemId: number;
  showRemoveModal: boolean;
  showRemoveFloorModal: boolean; // floor
  printerDeliteId: any;
  printerMenu: boolean;
  printerMenuZoom: boolean;
  printerMenuTop: number;
  printerMenuLeft: number;
  printerId: number;
  snmpStatusLog: any;
  snmpStatusValue: boolean;
  snmpStatusValueZoom: boolean;
  snmpStatusInfoValue: boolean;
  pictureValue: any;
}

interface IDispatchProps {
  getSearchOptions: typeof getSearchOptions;
  deletePrinter: typeof deletePrinter;
  deleteFloor: typeof deleteFloor;
  initResource: typeof actions.initResource;
  SnmpLoadResource: typeof actions.SnmpLoadResource;
  snmpLoadPicture: typeof actions.snmpLoadPicture;
  addPrinterToFloor: typeof actions.addPrinterToFloor;
  addCoordinatesPrinterToFloor: typeof actions.addCoordinatesPrinterToFloor;
  stopLoadRecursiveResource: typeof actions.stopLoadRecursiveResource;
  SnmpChangeLoader: typeof actions.SnmpChangeLoader;
  putTimerId: typeof actions.putTimerId;
}

interface IStateProps {
  pages: any;
  // currentPage: number;
  picture: string;
  totalFloor: number;
  totalPrinter: number;
  printers: any,
  addPrinters: any,
  pictureId: number, 
  errorFloors: any,
  isLoading: boolean;
  printerSize: any;
}

interface IOwnProps {
  resource: TypesResources;
  configs: Partial<ISnmpResourceReduxState>;
  onDel?: any;
  onAdd?: any;
  pullingData?: boolean;
}

function mapStateToProps(state: ISnmpReduxState): IStateProps {
  const resourceState = state.SnmpShowResource['floors'];
  const {
    picture,
    pages,
    // currentPage,
    totalFloor,
    totalPrinter,
    pictureId, 
    printers,
    addPrinters,
    errorFloors,
    isLoading,
    printerSize
    
  } = resourceState || initialResource;

  return {
    pages,
    // currentPage,
    picture,
    totalFloor,
    totalPrinter,
    printers,
    pictureId,
    addPrinters, 
    errorFloors,
    isLoading,
    printerSize
  };
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    changeHeader: injectResource(ownProps.resource, actions.changeHeader),
    SnmpChangeLoader: injectResource(ownProps.resource, actions.SnmpChangeLoader),
    initResource: injectResource(ownProps.resource, actions.initResource),
    SnmpLoadResource: injectResource(ownProps.resource, actions.SnmpLoadResource),
    snmpLoadPicture: injectResource(ownProps.resource, actions.snmpLoadPicture),
    addPrinterToFloor: injectResource(ownProps.resource, actions.addPrinterToFloor),
    addCoordinatesPrinterToFloor: injectResource(ownProps.resource, actions.addCoordinatesPrinterToFloor),
    putTimerId: injectResource(ownProps.resource, actions.putTimerId),
    stopLoadRecursiveResource: injectResource(ownProps.resource, actions.stopLoadRecursiveResource),
    getSearchOptions: injectResource(ownProps.resource, getSearchOptions),
    deletePrinter: injectResource(ownProps.resource, deletePrinter),
    deleteFloor: injectResource(ownProps.resource, deleteFloor),
  }, dispatch);
}

type Props = IDispatchProps & IStateProps & IOwnProps;

const b = block('show-resource');

class SnmpShowResource extends React.PureComponent<Props, IState > {
  public state: IState = {
    bodyPicture: false,
    modalAddPrinters: false,
    currentPage: Number(localStorage.getItem('storageCurrentFloor')),
    rate : 1,
    hoveredItemId: null,
    showRemoveModal: false,
    showRemoveFloorModal: false,
    printerDeliteId: null,
    printerMenu: false,
    printerMenuZoom: false,
    printerMenuTop: null,
    printerMenuLeft: null,
    printerId: null,
    snmpStatusLog: null,
    snmpStatusValue: false,
    snmpStatusValueZoom: false,
    snmpStatusInfoValue: false,
    pictureValue: {}
  };

  private stompClient: Client;

  public componentDidMount() {
    const {
      initResource,
      configs,
      resource,
      SnmpLoadResource,
      printerSize,
      snmpLoadPicture,
      pictureId
    } = this.props;

    const { printerMenuZoom } = this.state

    window.addEventListener("keydown", async (e) => {
      const clickedOnEmpty = e.target
      if (clickedOnEmpty && e.key === "Escape") {
        this.setState({
          bodyPicture: false,
          rate: 1
        })
      }
    }, false);

    initResource(configs);
      SnmpLoadResource(false, false);

    const resources: string[] = ['hosts-network', 'hosts-local', 'jobs', 'printers-local', 'printers-network', 'floors'];

    if (resources.includes(resource)) {
      let endpoint: string = resource;

      if (resource.includes('floors')) {
        endpoint = 'floors';
      }

      this.stompClient = new Client();
      this.stompClient.configure({
        connectHeaders: {
          login: 'frontend'
        },
        webSocketFactory: () => new SockJS(`${address}/frontend-endpoint`),
        onConnect: () => {
          this.stompClient.subscribe(`/queue/frontend/${endpoint}`, ({body}) => {

            if (body === 'RELOAD') {
                    
              if(printerMenuZoom === true){
                SnmpLoadResource(false, false);
                this.setState({
                  printerMenuZoom: true
                })
              }  else {
                SnmpLoadResource(false, false);
              }      
            }
          })
        }
      });

      this.stompClient.activate();
    }
  };

  public componentWillUnmount() {
    const { pullingData, stopLoadRecursiveResource } = this.props;
    if (pullingData) {
      stopLoadRecursiveResource();
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  public handleDragStart = e => {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15
      },
      scaleX: 1.1,
      scaleY: 1.1
    });
  };

  public handleDragEnd = (id, e) => {
    const { pictureId } = this.props;

    let x = e.target.attrs.x + (this.props.printerSize === '1x' ? 0 : 10)
    let y = e.target.attrs.y + (this.props.printerSize === '1x' ? 0 : 10)

    if(this.state.bodyPicture){
      x = (e.target.attrs.x / this.state.rate) + (this.props.printerSize === '1x' ? 0 : 7)
      y = (e.target.attrs.y / this.state.rate) + (this.props.printerSize === '1x' ? 0 : 7)
    }

    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    });

    this.props.addCoordinatesPrinterToFloor( id, pictureId, x, y );
  };

  public handlePtinterOver = (id) => {
    this.setState({
      hoveredItemId: id
    });
  }

  public handlePtinterOut = () => {
    this.setState({
      hoveredItemId: null
    });
  }

  public switchRemoveModalTrue = (id) => {
    this.setState({
      showRemoveModal: true,
      printerDeliteId: id
    });
  }

  public switchRemoveFloorModalTrue = () => { //floor
    this.setState({
      showRemoveFloorModal: true,
    });
  }

  public switchRemoveModalTrueScreen = () => {
    this.setState({
      showRemoveModal: true,
      printerDeliteId: this.state.printerId
    });
  }

  public switchRemoveModalFalse = () => {
    this.setState({
      showRemoveModal: false,
      printerDeliteId: null,
      printerId: null
    });
  }

  public switchRemoveFloorModalFalse = () => {
    this.setState({
      showRemoveFloorModal: false,
    });
  }

  public deletePrinter = () => {
    this.props.deletePrinter(this.state.printerDeliteId, this.props.pictureId);
    this.setState({
      showRemoveModal: false,
      printerDeliteId: null,
      printerId: null,
      printerMenu: false,
      printerMenuZoom: false,
      printerMenuTop: null,
      printerMenuLeft: null,
      snmpStatusValue: false
    });
  }

  public deleteFloor = () => {
    const { pictureId, deleteFloor, pages } = this.props;
    deleteFloor(pictureId)
    this.setState({
      showRemoveFloorModal: false,
    });
  }

  public printerMenu = (x, y, id, status) => {
    const left = x + 40;
    const top = y - 54;

    this.setState({
      printerMenu: true,
      printerMenuTop: top,
      printerMenuLeft: left,
      printerId: id,
      snmpStatusLog: status
    });
  }

  public changePrinterMenu = (x, y) => {
    const left = x + 40;
    const top = y - 54;

    this.setState({
      printerMenuTop: top,
      printerMenuLeft: left,
    });
  }

  public printerMenuZoomFunc = (x, y, id, status) => {
    const left = x * this.state.rate + 55
    const top = y * this.state.rate - 45

    this.setState({
      printerMenuZoom: true,
      printerMenuTop: top,
      printerMenuLeft: left,
      printerId: id,
      snmpStatusLog: status
    });
  }

  public snmpStatus = () => {
    this.setState((status) => ({
      ...status,
      snmpStatusValue: true
    }));
  }

  public snmpStatusZoom = () => {
    this.setState((state) => ({
      ...state,
      snmpStatusValueZoom: true
    }));
  }

  public snmpStatusOut = () => {
    this.setState({
      snmpStatusValue: false,
      snmpStatusValueZoom: false,
      snmpStatusInfoValue: false
    });
  }

  public snmpStatusInfo = (status) => {
    this.setState({
      snmpStatusLog: status
    });
  }

  public renderFloorImage = (item) => {
    const {
      id,
      floorX,
      floorY,
      active,
      snmpInfo
    } = item;

    const {
      rate
    } = this.state;

    const color = this.state.hoveredItemId === id ? '#4ebfd9' : 'transparent';

    let resultSnmpStatus;

    if(item.snmp === false) {
     resultSnmpStatus = 'SNMP не доступен'
    } else if (item.snmp === true && item.snmpInfo !== null){
        item.snmpInfo.forEach(i => {
          if (i.type === 'STATUS') {
            resultSnmpStatus = i.value.length === 0 ? 'OK' : i.value[0]
          }
        })
      } else {
        resultSnmpStatus = 'SNMP не доступен'
      }


    const image = document.createElement('img');
    image.src = active ? printer_on : printer_off;

    console.log('floorX', floorX)
    console.log('floorY', floorY)
    console.log('rate', rate)

    this.changePrinterMenu(floorX, floorY)
    

    return (
      <Image
        id={id}
        key={id}
        image={image}
        x={floorX * rate - (this.props.printerSize === '1x' ? 0 : 10)}
        y={floorY * rate - (this.props.printerSize === '1x' ? 0 : 10)}
        opacity={1}
        draggable
        width={30 * rate * (this.props.printerSize === '1x' ? 1 : 1.5)}
        height={30 * rate * (this.props.printerSize === '1x' ? 1 : 1.5)}
        onDragStart={this.handleDragStart}
        onDragEnd={this.handleDragEnd.bind(this, id)}
        shadowEnabled={false}
        onMouseOver={this.handlePtinterOver.bind(this, id)}
        onMouseOut={this.handlePtinterOut}
        onClick={!this.state.bodyPicture ? this.printerMenu.bind(this, floorX, floorY, id, resultSnmpStatus) : this.printerMenuZoomFunc.bind(this, floorX, floorY, id, resultSnmpStatus) }
        stroke={color}
        strokeWidth={3 * this.state.rate}
        dragBoundFunc={(pos) => {
          let x: number;
          let y: number;
          if (pos.x < 0) { x = 0 }
          else if (pos.x > 670 * rate) { x = 670 * rate }
          else { x = pos.x }
          if (pos.y < 0) { y = 0 }
          else if (pos.y > 500 * rate) { y = 500 * rate }
          else { y = pos.y }

          return { x, y };
        }}
      />
    )
  };

  public renderStage = () => {
    const {
      printers
    } = this.props;

    const {
      rate
    } = this.state;

    return (
      <Stage
        width={700 * rate}
        height={534 * rate}
        onMouseDown={async (e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (clickedOnEmpty && this.state.printerMenuZoom || this.state.printerMenu) {
            this.setState({
              printerMenuZoom: false,
              printerMenu: false,
              printerId: null,
              printerMenuTop: null,
              printerMenuLeft: null,
              snmpStatusLog: null
            })
          }
        }}
      >
        <Layer>
          {printers && printers.length !== 0 ? printers.map((item) => this.renderFloorImage(item)) : null}
        </Layer>
      </Stage>
    );
  }

  public render() {
    const {
      bodyPicture,
      modalAddPrinters,
      currentPage
    } = this.state;

    const {
      pages,
      onAdd,
      picture,
      totalFloor,
      totalPrinter,
      printers = [],
      addPrinters,
      getSearchOptions,
      isLoading
    } = this.props;

    const addPrintersArray = (
      <>
        <div  className={b('AutocompleteFilter')}>
          <AutocompleteFilter
            getOptions={getSearchOptions}
            filterName={'Поиск'}
            label={'Поиск'}
            acceptFilter={()=>{}}
          />
        </div>    
        <div className={b('addPrinters-array')}>
          {addPrinters.map((item) => (
            <div
              key={item.id}
              onClick={this.handleIdAddPrinters.bind(this, item.id)}
              className={b('addPrinters')}
            >
              <p>{item.name}</p>
            </div>
            )
          )}
        </div>
      </>
    );

    const printersArray = this.props.isLoading ? null : printers.length !== 0 && (
      <div className={b('addPrinters-array')}>
        {printers.map((item) => {
          const color = this.state.hoveredItemId === item.id ? '#dedede' : '#fff';

          let resultSnmpStatus;
          let status;

          if(item.snmpInfo === null) {
            resultSnmpStatus = 'SNMP не доступен'
           } else {
             item.snmpInfo.forEach(i => {
               if (i.type === 'STATUS') {
                 resultSnmpStatus = i.value.length === 0 ? 'OK' : i.value[0]
                 status = i.value[0] === '"Sleep"' ? '"Sleep"' : i.value[0]
                 console.log('status', status)
               }                              
             })
           }

             
          const snmpInfoError = item.snmpInfo !== null && resultSnmpStatus !== "" && status !== '"Sleep"'&& status !== '';

          return (
            <div  
              key={item.id}
              className={b('addPrinters-wrap')} 
              style={{backgroundColor: `${color}`}}
              onMouseOver={this.handlePtinterOver.bind(this, item.id)}
              onMouseOut={this.handlePtinterOut}
            >
              <div
                className={b('addPrinters')}              
              >
                <p>{item.name}</p>
              </div>

              <div className={b('icon')}>
                <Icon
                  icon="trash"
                  onClick={this.switchRemoveModalTrue.bind(this, item.id)}
                />
              </div>
              {item.snmp === false ? null :
                <div 
                  className={b('icon-info', {error: snmpInfoError})}
                  onMouseOver={this.snmpStatusInfo.bind(this, resultSnmpStatus)}
                >
                  <InfoIcon />
                  <div className={b('infoBlockArray')}>
                    Статус: {this.state.snmpStatusLog}
                  </div> 
                </div>    
              }
            </div> 
          );
        })}
      </div>
    );

    const printerMenuBlock = (
      <div
        style={{
          width: 150,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: "#fff",
          position: 'absolute',
          top: this.state.printerMenuTop + 30,
          left: this.state.printerMenuLeft - 10,
          zIndex: 200,
          borderRadius: 5,
          border: '1px solid #d8d8d8',
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        <div
          className={b('status')}
          onMouseOver={this.snmpStatus}
          onMouseOut={this.snmpStatusOut}
        >
          {this.state.snmpStatusLog}
        </div>
        {/* <div 
          className={b('status')} 
          onClick={this.switchRemoveModalTrueScreen}
        >
          Удалить
        </div> */}
      </div>
    );

    const infoBlock = (
      <div
        style={{
          width: 100,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          backgroundColor: "#fff",
          position: 'absolute',
          top: this.state.printerMenuTop,
          left: this.state.printerMenuLeft + 85,
          zIndex: 201,
          borderRadius: 5,
          border: '1px solid #d8d8d8',
          padding: 10
        }}
      >
        {this.state.snmpStatusLog}
      </div>
    );

    const printerMenuBlockZoom = (
      <div
        style={{
          width: 150,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: "#fff",
          position: 'absolute',
          top: this.state.printerMenuTop + 30,
          left: this.state.printerMenuLeft - 10,
          zIndex: 200,
          borderRadius: 5,
          border: '1px solid #d8d8d8',
          paddingLeft: 10,
          paddingRight: 10
        }}
      >
        {this.state.snmpStatusLog}
        {/* <div
          className={b('status')}
          onMouseOver={this.snmpStatusZoom}
          onMouseOut={this.snmpStatusOut}
        >
          Статус
        </div>
        <div
          className={b('status')}
          onClick={this.switchRemoveModalTrueScreen}
        >
          Удалить
        </div> */}
      </div>
    );

    return (
      <div>
        <div className={b()} style={{width: 1002}}>
          <div className={b('container')}>
            <div className={b('plan-floor')}>
              {isLoading ? (
                <ProgressBar
                  theme={circularTheme}
                  type="circular"
                  mode="indeterminate"
                />
              ) : (
                <div
                  className={b('plan-floor-img')}
                  style={{
                    backgroundImage: `url(data:image/png;base64,${picture})`,
                    display: 'block',
                    backgroundRepeat: 'no-repeat',  
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    width: 700,
                    height: 534
                  }}
                >
                  {this.state.printerMenu && printerMenuBlock}
                  {/* {this.state.snmpStatusValue && infoBlock} */}

                  {this.renderStage()}

                  <div
                    className={b('plan-floor-bodyPictureOpen')}
                    style={pages.length === 0 ? {display: 'none'} : null}
                  >
                    <IconButton
                      onClick={this.modalPictureOpen}
                      icon={<ExpandIcon />}
                      isPrimary
                      disabled={pages.length === 0}
                      title="На весь экран"
                      id={`floors-expand-${generateIdElement()}`}
                    />
                  </div>
                  <div className={b('plan-floor-btn')}>

                    {pages.length === 0 ?
                      null :
                      <IconButton
                        style={{'right': '5px'}}
                        onClick={this.switchRemoveFloorModalTrue}
                        icon={<DeleteIcon/>}
                        isPrimary
                        title="Удалить этаж"
                        id={`floors-delete-${generateIdElement()}`}
                      />
                    }


                    <IconButton
                      onClick={onAdd}
                      icon={<AddIcon/>}
                      isPrimary
                      title="Добавить этаж"
                      id={`floors-add-${generateIdElement()}`}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className={b('printers')}>
              <div className={b('btn-wrapper')}>
                <button
                  disabled={pages.length === 0}
                  id="floor-add_printer"
                  onClick={this.modalAddPrintersClose}>
                    <span id="span-add_printer">{!modalAddPrinters ? <>Добавить принтер</> : <>Отмена</>}</span>
                </button>
              </div>

              <div className={b('printers-wrapper')}>
                {!modalAddPrinters ? printersArray : addPrintersArray}
              </div>
            </div>
          </div>

          <SnmpPagination
            currentPage={currentPage}
            pages={pages}
            onChangePage={this.handleChangePage}
            errorFloors={this.props.errorFloors}
          />

          <SnmpAggregate
            floorNumber={totalFloor}
            printerNumber={totalPrinter}
            currentFloorPrinters={printers.length || 0}
          />
        </div>

        {bodyPicture && (
          <div className={b('bodyPicture-wrapper')}>
            <div
              className={b('bodyPicture')}
              style={{
                backgroundImage: `url(data:image/png;base64,${picture})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                display: 'block',
                backgroundAttachment: 'scroll',
                width: 700 * this.state.rate,
                height: 534 * this.state.rate
              }}
            >
              {this.state.printerMenuZoom && printerMenuBlockZoom}
              {/* {this.state.snmpStatusValueZoom && infoBlockZoom} */}

              {this.renderStage()}

              <div className={b('bodyPicture-close')} id="bodyPicture-close">
                <IconButton
                  onClick={this.modalPictureClose}
                  icon={<ExpandIcon />}
                  id="button_bodyPicture-close"
                  isPrimary
                  title="Свернуть"
                />
              </div>
            </div>
          </div>
        )}

        <RemoveModal
          isOpen={this.state.showRemoveModal || this.state.showRemoveFloorModal}
          alertMessage={this.state.showRemoveModal ? "Вы действительно хотите удалить принтер с этажа?" : "Вы действительно хотите удалить этаж?"}
          onRemove={this.state.showRemoveModal ? this.deletePrinter : this.deleteFloor }
          onClose={this.state.showRemoveModal ? this.switchRemoveModalFalse : this.switchRemoveFloorModalFalse}
          planFloor={true}
        />
      </div>
    );
  }

  @bind
  private handleChangePage(page: number) {
    const { snmpLoadPicture } = this.props
    snmpLoadPicture(page)
    this.setState({
      currentPage: page,
      printerMenu: false
    })
  }

  @bind
  private handleIdAddPrinters(idPrinter: number) {
    const { addPrinterToFloor } = this.props
    console.log('this.props.pictureId', this.props.pictureId)
    addPrinterToFloor(idPrinter, this.props.pictureId)
    this.setState({
      modalAddPrinters: !this.state.modalAddPrinters
    })
  }

  @bind
  private modalPictureClose(){
    this.setState({
      bodyPicture: false,
      rate: 1
    })
  }

  @bind
  private modalPictureOpen(){
    this.setState({
      bodyPicture: true,
      printerMenu: false,
      printerMenuZoom: false, 
      printerMenuTop: null,
      printerMenuLeft: null,
      snmpStatusLog: null,
      rate: 1.5
    })
  }

  @bind
  private modalAddPrintersClose(){
    this.setState({
      modalAddPrinters: !this.state.modalAddPrinters
    })
  }
}

export { SnmpShowResource };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(SnmpShowResource);
