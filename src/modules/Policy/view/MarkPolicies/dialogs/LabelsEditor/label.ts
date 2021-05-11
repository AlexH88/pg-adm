import {CanvasController} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor';
import {
  fixDimensions,
  fixRectSizes,
  fixWrapperSizes,
  grad2Rad,
  inRect,
  round,
  translateRect
} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor/utils';
import {fillLabel, resizeRect, rotateRect, strokeLabel} from './utils';
import * as Barcode from './svg/barcode.svg';
import * as QRCode from './svg/qrcode.svg';
import {address} from 'shared/api/HttpActions';

export const EDGE_COLOR = '#4899CC';
export const NULLIFY_RECT_COLOR = '#4FC7FF';
export const NULLIFY_RECT_COLOR_HOVER = '#2EA5FF';
export const WRAPPER_COLOR = '#FF9797';
export const TEXT_COLOR = '#222222';

type IMode = 'resize' | 'rotate';
export type ILabelType = 'barcode' | 'image' | 'text' | 'qrcode';

class Label {

  public x: number;
  public y: number;
  public w: number;
  public h: number;
  public X: number;
  public Y: number;
  public W: number;
  public H: number;
  public angle: number;
  public deltaAngle: number;
  public ctx: CanvasRenderingContext2D;
  public controller: CanvasController;
  public isDrag: boolean = false;
  public isRotate: boolean = false;
  public isSelected: boolean = false;
  public edgeType: string | null = null;
  public mode: IMode = 'resize';
  public type: ILabelType = 'qrcode';
  public fontSize: number;
  public labelData: any;

  public barCode: any;
  public QRCode: any;

  public image: any;
  public text: string;
  public opacity: number = 1;

  public nullifyLabelColor: string = NULLIFY_RECT_COLOR;
  private willClick: boolean = true;

  constructor(X: number, Y: number, W: number, H: number, labelData: any, controller: CanvasController) { // TODO
    this.ctx = controller.ctx;
    this.controller = controller;
    const { canvas } = this.controller;
    const { step } = this.controller.markForm.state;
    this.angle = labelData.angle || 0;

    this.X = round(X, step);
    this.Y = round(Y, step);
    this.W = round(W, step);
    this.H = round(H, step);

    const sheetWidthPX = canvas.offsetWidth;
    const sheetHeightPX = canvas.offsetHeight;

    const onePercentWidthInPx = sheetWidthPX / 100;
    const onePercentHeightInPx = sheetHeightPX / 100;

    this.w = labelData.w * onePercentWidthInPx || this.W;
    this.h = labelData.h * onePercentHeightInPx || this.H;
    this.x = labelData.x * onePercentWidthInPx || this.X;
    this.y = labelData.y * onePercentHeightInPx || this.Y;

    this.deltaAngle = this.angle;
    fixRectSizes(this, { W, H });
    fixWrapperSizes(this);

    this.labelData = labelData;

    this.fontSize = labelData.font_size || 16;
    this.opacity = labelData.opacity;
    this.text = labelData.text && labelData.text.data;
    if (labelData.type === 'barcode' && labelData.barcode_format === 'QRCode') {
      this.type = 'qrcode';
    } else {
      this.type = labelData.type;
    }

    if (this.type === 'image') {
      const img = new Image();
      img.src = `${address}/api/files/${labelData.image_id}`;
      img.onload = () => {
        this.image = img;
      }
    }

    const barcode = new Image();
    barcode.src = Barcode;

    const qrcode = new Image();
    qrcode.src = QRCode;

    barcode.onload = () => {
      this.barCode = barcode;
    }

    qrcode.onload = () => {
      this.QRCode = qrcode;
    }

    controller.labels.push(this);
    controller.markForm.setLabels(controller.labels);
  }

  public inRect(clientX: number, clientY: number) {
    const { X, Y, W, H } = this;
    return (
      clientX > X &&
      clientX <= (X + W) &&
      clientY > Y &&
      clientY <= (Y + H)
    );
  }

  public inEdgeRect = (clientX: number, clientY: number) => {
    const { X, Y, W, H, mode } = this;
    const x = X;
    const y = Y;
    const w = W;
    const h = H;
    if (clientX > x - 3 && clientX < x + 3 && clientY > y - 3 && clientY < y + 3) return '11';
    if (clientX > x + w - 3 && clientX < x + w + 3 && clientY > y - 3 && clientY < y + 3) return '12';
    if (clientX > x - 3 && clientX < x + 3 && clientY > y + h - 3 && clientY < y + h + 3) return '21';
    if (clientX > x + w - 3 && clientX < x + w + 3 && clientY > y + h - 3 && clientY < y + h + 3) return '22';
    if (mode === 'resize') {
      if (clientX > (x+w/2) - 3 && clientX < (x+w/2) + 3 && clientY > y - 3 && clientY < y + 3) return 'top';
      if (clientX > x + w - 3 && clientX < x + w + 3 && clientY > (y+h/2) - 3 && clientY < (y+h/2) + 3) return 'right';
      if (clientX > (x+w/2) - 3 && clientX < (x+w/2) + 3 && clientY > y + h - 3 && clientY < y + h + 3) return 'bottom';
      if (clientX > x - 3 && clientX < x + 3 && clientY > (y+h/2) - 3 && clientY < (y+h/2) + 3) return 'left';
    }
    return false;
  }

  public isInNullifyRect = (clientX: number, clientY: number) => {
    const { Y, W, X } = this;
    return inRect(clientX, clientY, { x: X + W - 15, y: Y + 5, w: 10, h: 10 });
  }

  public mouseDown = (clientX: number, clientY: number) => {

    if (this.isInNullifyRect(clientX, clientY)) {
      this.angle = 0;
      this.deltaAngle = 0;
      this.isSelected = true;
      fixWrapperSizes(this);
      fixDimensions(this);
      return;
    }

    if (!this.inEdgeRect(clientX, clientY)) {
      this.isDrag = true;
    }
    this.isSelected = true;
  }

  public onEdgeMouseDown = (clientX: number, clientY: number) => {
    const edge = this.inEdgeRect(clientX, clientY) as string; // TODO

    this.isRotate = true;

    if (this.mode === 'rotate') {
      const { H, W } = this;
      const coeff = W / H;
      const coeffByEdge: any = {
        11: 180 + Math.atan(coeff) / grad2Rad,
        12: 90 + Math.atan(1 / coeff) / grad2Rad,
        21: 270 + Math.atan(1 / coeff) / grad2Rad,
        22: 0 + Math.atan(coeff) / grad2Rad
      };
      this.deltaAngle = this.angle + coeffByEdge[edge] - 45;
    }

    this.edgeType = edge;
  }

  public mouseUp = () => {
    if (this.isRotate) {
      fixDimensions(this);
    }
    this.isDrag = false;
    this.isRotate = false;
    this.willClick = true;
    this.edgeType = null;
  }

  public mouseMove = (newX: number, newY: number) => {
    const { dx, dy, canvas } = this.controller;
    const step = this.controller.markForm.state.step; // TOOOOODO
    if (this.isDrag) {
      translateRect(this, newX, newY, step);
    } else if (this.edgeType && this.mode === 'resize') {
      resizeRect(this, newX, newY, step);
    } else if (this.isRotate && this.mode === 'rotate') {
      rotateRect(this, newX, newY);
    }

    if (this.isInNullifyRect(newX, newY)) {
      this.nullifyLabelColor = NULLIFY_RECT_COLOR_HOVER;
    } else {
      this.nullifyLabelColor = NULLIFY_RECT_COLOR;
    }

    this.willClick = false;
  }

  public dblClick = () => {
    if (this.mode === 'resize') {
      this.mode = 'rotate';
    } else {
      this.mode = 'resize';
    }
  }

  public render = () => {
    const { ctx, x, y, w, h, isSelected, angle } = this;
    ctx.save();
    ctx.translate(x + w/2,y + h/2);
    ctx.rotate(angle * Math.PI / 180);
    ctx.translate(-(x + w/2),-(y+h/2));
    ctx.globalAlpha = this.opacity;
    fillLabel(ctx, this);
    strokeLabel(ctx, this);
    ctx.restore();
    if (isSelected) {
      this.renderWrapper();
      this.renderCenter();
      if (angle % 90 !== 0) {
        if (!this.isRotate) {
          this.renderNullifyAngleLabel();
        }
      }
      this.renderDragEdges();
    }
  }

  private renderWrapper = () => {
    const { ctx } = this;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = WRAPPER_COLOR;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(this.X, this.Y, this.W, this.H);
    ctx.restore();
  }

  private renderCenter = () => {
    const { ctx, X, Y, W, H } = this;
    const center = { x: this.X + this.W / 2, y: this.Y + this.H / 2 };
    const { x, y } = center;
    ctx.save();
    ctx.strokeStyle = EDGE_COLOR;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 5, y + 5);
    ctx.closePath();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + 5, y - 5);
    ctx.lineTo(x - 5, y + 5);
    ctx.closePath();

    ctx.stroke();
    ctx.restore();
  }

  private drawCircle = (x: number, y: number, r: number) => {
    const { ctx } = this.controller;
    const circle = new Path2D() as any;
    circle.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill(circle);
  }

  private renderNullifyAngleLabel = () => {
    const { ctx } = this.controller;
    const { X, Y, W } = this;
    ctx.save();
    ctx.strokeStyle = this.nullifyLabelColor;
    ctx.font = '14px TimesNewRoman';
    ctx.lineWidth = 1;
    ctx.strokeText('↻', X + W - 15, Y + 15);
    ctx.restore();
  }

  private renderDragEdges = () => {
    const { isSelected, drawCircle, H, W, X, Y, ctx, mode, isRotate, angle } = this;

    ctx.fillStyle = EDGE_COLOR;

    if (mode === 'resize') {
      if (angle % 90 === 0 && this.type !== 'qrcode') {
        ctx.fillRect(X+W/2-3,Y-3,6,6);
        ctx.fillRect(X+W/2-3,Y+H-3,6,6);
        ctx.fillRect(X+W-3,Y+H/2-3,6,6);
        ctx.fillRect(X-3,Y+H/2-3,6,6);
      }
      ctx.fillRect(X-3,Y-3,6,6);      
      ctx.fillRect(X+W-3,Y-3,6,6);
      ctx.fillRect(X+W-3,Y+H-3,6,6);
      ctx.fillRect(X-3,Y+H-3,6,6);
    } else if (mode === 'rotate' && !isRotate) {
      drawCircle(X, Y, 3);
      drawCircle(X + W, Y, 3);
      drawCircle(X, Y + H, 3);
      drawCircle(X + W, Y + H, 3);
    }
  }

  public update = () => {
    // const center = { x: this.X + this.W / 2, y: this.Y + this.H / 2 };
    // this.controller.ctx.fillRect(center.x, center.y, 2, 2);
    // const { ctx, H, W, X, Y, w, h } = this;
    // const { mouseY, mouseX } = this.controller;

    // const maxSide = Math.max(W, H);
    // ctx.save();
    // // ctx.beginPath();
    // // // ctx.strokeRect(X - (maxSide - W) / 2, Y - (maxSide - H) / 2, maxSide, maxSide);
    // // ctx.fillStyle = 'blue';
    // // ctx.arc(center.x, center.y, 2, 0, 2 * Math.PI);
    // // ctx.fill();
    // // ctx.closePath();
    // if (this.isRotate) {
    //   ctx.beginPath();
    //   ctx.lineWidth = 1;
    //   ctx.strokeStyle = 'red';
    //   ctx.moveTo(center.x, center.y);
    //   ctx.lineTo(mouseX, mouseY);
    //   ctx.stroke();
    //   ctx.closePath();
    // }
    
    // ctx.restore();
  }

}

export { Label };