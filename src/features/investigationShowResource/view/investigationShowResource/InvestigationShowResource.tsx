import * as React from 'react';
import { block } from 'bem-cn';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bind } from 'decko';
import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { TypesResources } from 'shared/types/app';
import injectResource from 'shared/helpers/injectResource';
import { address } from 'shared/api/HttpActions';
import { actions } from '../../redux';
import './InvestigationShowResource.styl';
import {AlertModal} from 'shared/view/components';
import { Decoder } from '@nuintun/qrcode';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Quagga from 'quagga';//
import Pdf2Image from './pdf2image'
import Pagination from './pagination/pagination'
import {TextInput, Button} from 'shared/view/elements';
import {actions as actionsResorce} from '../../../showResource/redux';
import uploadIcon from './images/upload-icon.png'
import {formatDateTime} from 'shared/helpers/formatData';
import {generateIdElement} from 'shared/helpers';

interface IState {
  file: any;
  numPages: number;
  pageNumber: number;
  fileData: any;
  fileName: string;
  resultScan: string;
  decodeText: string;
  src: any;
  crop: any;
  croppedImageUrl: any;
  imageRef?: any;
  imagesPdf?: any;
  currentPagePdf?:number;
  totalPagePdf?: number;
  searchStr?: string;
}

interface IDispatchProps {
  imageRef?: any;
  getHashData: typeof actions.getHashData;
  switchModalStatus: typeof actions.switchModalStatus;
  loadResource: typeof actionsResorce.loadResource;
}

interface IStateProps {
  showModal: boolean;
  result: any;
}

interface IOwnProps {
  resource?: TypesResources;
  configs?: any;
  onAdd?: any;
  pullingData?: boolean;
  imageRef?: any;
}

function mapStateToProps(state: any): IStateProps {

  return {
    showModal: state.investigationResource.showModal,
    result: state.investigationResource.result
  }
}

function mapDispatchToProps(dispatch: any, ownProps: IOwnProps): IDispatchProps {
  return bindActionCreators({
    getHashData: actions.getHashData,
    switchModalStatus: actions.switchModalStatus,
    loadResource: injectResource(ownProps.resource, actionsResorce.loadResource)
  }, dispatch);
}

type Props = IDispatchProps & IStateProps & IOwnProps;

const b = block('show-investigation-resource');

class InvestigationShowResource extends React.PureComponent<Props, IState > {
  public state: IState = {
    file: null,
    numPages: 0,
    pageNumber: 1,
    fileData: '',
    fileName: '',
    resultScan: '',
    decodeText: '',
    src: null,
    crop: {
      unit: "%",
      width: 15,
      aspect: 16 / 12
    },
    croppedImageUrl: null,
    imagesPdf: [],
    currentPagePdf: null,
    totalPagePdf: null,
    searchStr: ''
  };

  private stompClient: Client;

  public componentDidMount() {
    const resource = 'investigation'
    const resources: string[] = ['hosts-network', 'hosts-local', 'jobs', 'printers-local', 'printers-network'];
    const { loadResource } = this.props;
    loadResource(false, false);
  };

  public componentWillUnmount() {
    const { pullingData/*, stopLoadRecursiveResource*/ } = this.props;
    if (pullingData) {
//      stopLoadRecursiveResource();
    }
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  public decodeQR = (crop) => {
    const qrcode = new Decoder();
    qrcode
      .scan(String(crop))
      .then(result => {
        this.setState({
          decodeText: result.data
        })
      })
      .catch(error => {
        this.setState({
          decodeText: '',
        })
        console.error('ERROR QR CODE', error);
      });
  }

  public decodeBarCode = (crop) => {
    Quagga.decodeSingle({
        decoder: {
          readers: ["code_128_reader",
            "code_39_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader"]
        },
        locate: true,
        src: crop
    }, (result) => {
        if(result) {
          if(result.codeResult) {
            this.setState({
              decodeText: result.codeResult.code
            })
          } else {
            this.setState({
              decodeText: '',
            })
            console.log("not detected");
          }
        }
    })
  }

  clearState = () => {
    this.setState({
      imagesPdf: null,
      totalPagePdf:null
    })
  }

  async onSelectFile(event) {
    let file = event.target.files[0];
    let reader = new FileReader();

    if(file.name.indexOf('pdf') > 0 || file.name.indexOf('PDF') > 0){
      try {
        const filePDF = file;
        const urlPDF = URL.createObjectURL(filePDF);
        const pdf2image = await Pdf2Image.open(urlPDF);
        const images = await pdf2image.getAllImageDataUrl({ width: 400, height: 400 });
        this.setState({
          imagesPdf: images,
          src: images[0],
          totalPagePdf: images.length
        })
      } catch (error) {
//        console.log('ERROR', error);
      }
    } else {
      reader.onloadend = (e) => {
        this.clearState()
        this.setState({
          fileData: reader.result,
          src: reader.result,
        })
        //this.convertePDF(event)
        this.decodeQR(reader.result)
        this.decodeBarCode(reader.result)
      }

      reader.readAsDataURL(file);
    }
  }


  imageRef;
  fileUrl;

  onImageLoaded = (image: any) => {
    this.imageRef = image;
  };

  onCropComplete = crop => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
        this.setState({ crop});
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "crop.jpeg"
      );

      this.setState({ croppedImageUrl });

      this.fetchAsBlob(croppedImageUrl)
        .then(this.convertBlobToBase64)
        .then((res) => {
          this.decodeQR(res)
          this.decodeBarCode(res)
        })
    }
  }

  fetchAsBlob = url => fetch(url)
    .then(response => response.blob());

  convertBlobToBase64 = blob => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  })

  getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob: any) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  setCurrentPagePdf = (index) => {
    this.setState({
      src: this.state.imagesPdf[index]
    })
  }

  onClikSpan = () => {
    const {getHashData} = this.props;
    getHashData(this.state.decodeText);
  }

  openModal = () => {
    this.props.switchModalStatus({ status: true, mode: '' });
  }

  closeModal = () => {
    this.props.switchModalStatus({ status: false, mode: '' });
  }

  handleChangeSearch = (event) => {
    this.setState({searchStr: event});
  }

  public render() {
    const {crop, croppedImageUrl, src} = this.state;
    const {showModal, result, getHashData} = this.props;

      const convertResultToText = () => {
        if(result && typeof(result) == 'string') {
          return result
        }

        if(result && typeof(result) == 'object') {
          let res = `JobID - ${result.id} \n`
          res = res + `Имя пользователя- ${result.user.name} \n`
          res = res + `email пользователя - ${result.user.email} \n`
          res = res + `Время печати - ${formatDateTime(result.inputTime)} \n`
          res = res + `Хост - ${result.printer.host.name} \n`
          res = res + `Принтер - ${result.printer.name} \n`
          res = res + `Название файла - ${result.title} \n`
          res = res + `Количество страниц - ${result.pages} \n`
          return res
        }
      }


      return (
        <div>
          <div className={b()}>
            <div
              className={b('investigation-btn')}
              title="Загрузить"
              id={`investigation-${generateIdElement()}`}
            >
              <label htmlFor="file-input">
                <img src={uploadIcon}/>
              </label>
              <input id="file-input" type="file" onChange={() => {this.onSelectFile(event)} } />
            </div>

            <div className={b('container')}>
              <div className={b('investigation')}>
                <div className={b('investigation-img')} >  
                    {src && (
                      <ReactCrop
                        src={src}
                        crop={crop}
                        ruleOfThirds
                        onImageLoaded={this.onImageLoaded}
                        onComplete={this.onCropComplete}
                        onChange={this.onCropChange}
                        style={{ width: "100% !important" }}
                      />
                    )}
                </div>
              </div>
              <div className={b('decode-block')}>

                <div className={b('search-input')}>
                  <TextInput
                    label="Поиск"
                    value={this.state.searchStr}
                    onChange={this.handleChangeSearch}
                    onEnter={() => {
                      getHashData(this.state.searchStr)}
                    }
                  />
                </div>

                {this.state.decodeText ?
                  <span 
                    style={
                      {
                        paddingTop: '0px',
                        display: 'block',
                        width: '90%',
                        margin: '0 auto',
                        wordWrap: 'break-word'
                      }
                    }
                    onClick={this.onClikSpan}
                  >
                    {this.state.decodeText}
                  </span> :
                  null
                }
              </div>
            </div>

            {
              this.state.totalPagePdf ? 
              <Pagination items={this.state.imagesPdf} onClick={this.setCurrentPagePdf} /> :
              null
            }

          </div>

          <AlertModal
            isOpen={showModal}
            title={'Результат расследования'}
            alertMessage={convertResultToText()}
            onClose={this.closeModal}
          >
          <Button
            label="Ок"
            onClick={this.closeModal}
          />
          </AlertModal>

        </div>
      );
    }

}

export { InvestigationShowResource };
export default connect<IStateProps, IDispatchProps, IOwnProps >(mapStateToProps, mapDispatchToProps)(InvestigationShowResource);
