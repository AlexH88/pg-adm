import * as React from 'react';
import {bind} from 'decko';
import './index.styl';
import ProgressBar from 'react-toolbox/lib/progress_bar';

interface IOwnProps {
  settings: any;
  gallery: any[];
  isShow: boolean;
  onClose(): void;
  getImages(jobId: number, pages: number): any;
}

interface IState {
  pictures: any;
  imageIds: any[];
  enlargedImage: number | null;
  images: any[];
}

class Gallery extends React.Component<IOwnProps, IState> {
  state: IState = {
    pictures: {},
    imageIds: [],
    enlargedImage: null,
    images: []
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    this.onGalleryOpen();
  }

  public componentDidUpdate() {
    const {
      gallery = [],
      settings: {
        id
      }
    } = this.props;
    const {
      images
    } = this.state;

    const gallerySection = gallery[id.toString()] || [];

    if (gallerySection.length > 0 && images.length === 0) {
      let newImages: any[] = [];
      gallerySection.forEach(( item: any ) => {
        const newItem = this.createImage(item);
        newImages.push(newItem);
      });
      this.setState({images: newImages});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  @bind
  private onKeyDown(e: any) {
    if(e.keyCode === 27)
      this.props.onClose();
  }

  public render() {
    const {
      isShow,
      onClose
    } = this.props;

    const {
      images,
      enlargedImage
    } = this.state;

    const enlarged = images.filter(item => item.id === enlargedImage)[0];

    return (
      <div
        className="gallery"
        style={{display: isShow ? 'block' : 'none'}}
        onClick={this.onGalleryClick}
      >
        <span
          className="gallery__close-span"
          onClick={onClose}
        >
          x
        </span>
        {images.length > 0 && enlargedImage === null && (
          <div className="gallery__image-container">
            {images.map(( item: any, index: number ) => {
              if (item.status === 200) {
                return (
                  <div
                    key={index}
                    className="gallery__image-wrap"
                  >
                    <div
                      className={"gallery__image-small-" + item.orientation}
                      dangerouslySetInnerHTML={{__html: item.img}}
                      onClick={() => {this.onToggleEnlarge(item.id)}}
                    />
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="gallery__image-wrap"
                >
                  <div className="gallery__image-error portrait">
                    Загрузка изображения не удалась
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {images.length > 0 && enlargedImage !== null && 
          <div
            className={"gallery__image-enlarged-" + enlarged.orientation}
            dangerouslySetInnerHTML={{__html: enlarged.img}}
            onClick={() => this.onToggleEnlarge()}
          />
        }
        {images.length === 0 && (
          <div className="gallery__image-container">
            <ProgressBar
              className="gallery__loading-indicator"
              type="circular"
            />
          </div>
        )}
      </div>
    )
  }

  @bind
  private onToggleEnlarge(id?: number) {
    this.setState({enlargedImage: id || null});
  }

  @bind
  private onGalleryOpen() {
    const {
      settings: {
        id,
        pages
      },
      gallery = [],
      getImages
    } = this.props;

    const gallerySection = gallery[id.toString()] || [];

    if (gallerySection.length < pages) {
      getImages(id, pages);
    }
  }

  @bind
  private createImage(data: any) {
    const image = new Image();
    image.src = `data:image/png;base64,${data.img}`;
    var el= document.createElement("div");
    el.appendChild(image.cloneNode(false));
    const ready = el.innerHTML;

    const orientation = image.width > image.height ? 'landscape' : 'portrait';

    return {
      id: data.id,
      img: ready,
      orientation,
      status: data.status
    };
  }

  @bind
	private onGalleryClick(event: any) {
		const { onClose } = this.props;
		const targetClass: any = event.target.className;
  	if (targetClass === 'gallery' || targetClass === 'gallery__image-container') {
      onClose();
    }
	}
}

export { Gallery };