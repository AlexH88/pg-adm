let PDFJS = require('pdfjs-dist');
let PDFJSWorker = require('pdfjs-dist/build/pdf.min');

PDFJS.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.js`;;

interface IPdf2Image {
  pdfDoc: any;
}

class Pdf2Image<IPdf2Image> {
  static async open(pdfUrl: any) {
console.log('PDFJSWorker', PDFJSWorker)
console.log('pdfUrl', pdfUrl)
    const pdfDoc = await PDFJS.getDocument({ url: pdfUrl }).promise;
    return new Pdf2Image(pdfDoc);
  }

  pdfDoc

  constructor(pdfDoc) {
    this.pdfDoc = pdfDoc;
  }

  numPages() {
    return this.pdfDoc.numPages;
  }

  async getImageDataUrl(pageNo, option) {
    const page:any = await this.pdfDoc.getPage(pageNo);
    const scale:any = Pdf2Image.calcScale(page, option);
    const viewport:any = page.getViewport({ scale });
    const canvas:any = document.createElement('canvas');
    const canvasContext:any = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    canvasContext.height = viewport.height;
    canvasContext.width = viewport.width;

    const renderContext = {
      canvasContext,
      viewport,
    };
    await page.render(renderContext).promise;
    switch (option.image) {
      case 'jpeg':
        return canvas.toDataURL('image/jpeg');
      case 'webp':
        return canvas.toDataURL('image/webp');
      default:
        return canvas.toDataURL();
    }
  }

  static calcScale(page, option) {
    if (option.scale !== undefined) {
      return option.scale;
    }
    if (option.width === undefined || option.height === undefined) {
      return 1.0;
    }
    const viewport = page.getViewport({ scale: 1.0 });
    return Math.min(option.width / viewport.width, option.height / viewport.height);
  }

  async getAllImageDataUrl(option) {
    const pages = [];
    const numPages = this.numPages();
    for (let i = 1; i <= numPages; i += 1) {
      const img = await this.getImageDataUrl(i, option);
      pages.push(img);
    }
    return pages;
  }
}

export default Pdf2Image;
