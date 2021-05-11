import {Label} from './label';
import {
  fixDimensions,
  fixRectSizes,
  getCursourByEdgeType
} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor/utils';

export type IStep = 1 | 5 | 10;

export type ICursorType = 'default' | 'pointer' | 'nw-resize';

class CanvasController {

  public markForm: any; // TODO type
  public readonly canvas: HTMLCanvasElement;
  public readonly ctx: CanvasRenderingContext2D;
  public labels: Label[] = [];
  public inResizing: boolean = false;
  public inRotating: boolean = false;

  public dx: number = 0;
  public dy: number = 0;

  public mouseX: number = 0;
  public mouseY: number = 0;
  private renderTimerId: number;

  constructor(canvas: HTMLCanvasElement, markForm: React.Component<any, any>) {
    this.canvas = canvas;
    this.markForm = markForm;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.renderTimerId = requestAnimationFrame(this.render);

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('dblclick', this.handleDblClick);

    return this;
  }

  public addLabel(label: any) { // TODO
    const { canvas } = this;

    const sheetWidthPX = canvas.offsetWidth;
    const sheetHeightPX = canvas.offsetHeight;
    const onePercentWidthInPx = sheetWidthPX / 100;
    const onePercentHeightInPx = sheetHeightPX / 100;

    new Label(
      // Number(label.X) * onePercentWidthInPx,
      // Number(label.Y) * onePercentHeightInPx,
      // Number(label.W) * onePercentWidthInPx,
      // Number(label.H) * onePercentHeightInPx,
      label.X,
      label.Y,
      label.W,
      label.H,
      label,
      this
    );
  }

  public removeLabel = (index: number) => {
    this.labels.splice(index, 1);
    this.markForm.setLabels(this.labels);
  }

  public selectLabel = (index: number) => {
    this.labels.forEach((label: Label, i: number) => {
      if (i === index) {
        label.isSelected = true;
        this.markForm.setSelectedLabel(label);
      } else {
        label.isSelected = false;
      }
    });
  }

  public changeOpacity = (index: number, newValue: number) => {
    this.labels[index].opacity = newValue;
    this.markForm.setSelectedLabel(this.labels[index]);
  }

  public changeFontSize = (index: number, newValue: number) => {
    this.labels[index].fontSize = newValue;
    this.markForm.setSelectedLabel(this.labels[index]);
  }

  public changeOrientation = () => {
    this.labels.forEach((label: Label) => {
      label.X = 0;
      label.Y = 0;
      fixRectSizes(label, { W: label.W, H: label.H });
      fixDimensions(label);
    });
  }

  public changeFormat = (coeff: number) => {
    this.labels.forEach((label: Label) => {
      const old = { W: label.W, H: label.H };
      const { W, H } = old;
      label.X = 0;
      label.Y = 0;
      label.W = label.W * coeff;
      label.H = label.H * coeff;
      fixRectSizes(label, { W, H });
      fixDimensions(label);
    });
  }

  public setLabels(labels: any[]) { // TODO Type
    const { canvas } = this;
    labels.forEach((label: any) => {

      const sheetWidthPX = canvas.offsetWidth;
      const sheetHeightPX = canvas.offsetHeight;

      const onePercentWidthInPx = sheetWidthPX / 100;
      const onePercentHeightInPx = sheetHeightPX / 100;

      new Label(
        Number(label.X) * onePercentWidthInPx,
        Number(label.Y) * onePercentHeightInPx,
        Number(label.W) * onePercentWidthInPx,
        Number(label.H) * onePercentHeightInPx,
        // round(Number(label.X) * onePercentWidthInPx, this.markForm.state.step),
        // round(Number(label.Y) * onePercentHeightInPx, this.markForm.state.step),
        // round(Number(label.W) * onePercentWidthInPx, this.markForm.state.step),
        // round(Number(label.H) * onePercentHeightInPx, this.markForm.state.step),
        // label.X,
        // label.Y,
        // label.W,
        // label.H,
        label,
        this
      );
    });
    this.markForm.setLabels(this.labels);
  }

  public destroy = () => {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('dblclick', this.handleDblClick);
    cancelAnimationFrame(this.renderTimerId);
  }

  private renderGrid = () => {
    const { ctx, canvas, markForm } = this;
    const step = markForm.state.step;
    const { width, height, offsetLeft, offsetTop } = canvas;
    ctx.save();
    ctx.strokeStyle = '#4899CC';
    ctx.lineWidth = 0.2;
    ctx.beginPath();
    for (let i = 0; i < height; i += step) {
      ctx.moveTo(0, i);
      ctx.lineTo(offsetLeft + width, i);
    }
    for (let i = 0; i < width; i += step) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, offsetTop + height);
    }
    ctx.stroke();
    ctx.restore();
  }

  public render = () => {
    const { ctx, canvas } = this;
    const { width, height } = canvas;
    ctx.clearRect(0,0,width,height);
    if (this.markForm.state.step !== 1) {
      this.renderGrid();
    }
    const labels = this.labels;
    for (let i = 0; i < labels.length; i++) {
      labels[i].update();
      labels[i].render();
    }
    this.renderTimerId = requestAnimationFrame(this.render);
  }

  private handleMouseDown = (event: MouseEvent) => {
    const labels: Label[] = this.labels;
    const { clientX, clientY } = event;

    const coords = this.canvas.getBoundingClientRect();
    const canvasLeft = coords.left;
    const canvasTop = coords.top;

    const x = clientX - canvasLeft;
    const y = clientY - canvasTop;

    for ( let i = 0; i < labels.length; i++ ) {
      const label = labels[i];
      label.isSelected = false;
    }

    for ( let i = 0; i < labels.length; i++ ) {
      const label = labels[i];
      const edge = label.inEdgeRect(x, y);
      if (edge) {
        label.isSelected = true;
        label.onEdgeMouseDown(x, y);
        this.markForm.setSelectedLabel(label);
        break;
      } else if (label.inRect(x, y)) {
        label.mouseDown(x, y);
        this.dx = x - label.X;
        this.dy = y - label.Y;
        this.markForm.setSelectedLabel(label);
        break;
      } else {
        this.markForm.setSelectedLabel(null);
      }
    }

  }

  private handleDblClick = (event: MouseEvent) => {
    const labels: Label[] = this.labels;
    const { clientX, clientY } = event;

    const coords = this.canvas.getBoundingClientRect();
    const canvasLeft = coords.left;
    const canvasTop = coords.top;

    const x = clientX - canvasLeft;
    const y = clientY - canvasTop;

    for ( let i = 0; i < labels.length; i++ ) {
      const label = labels[i];
      if (label.inRect(x, y)) {
        label.dblClick();
        break;
      }
    }
  }

  private handleMouseMove = (event: MouseEvent) => {
    const labels: Label[] = this.labels;
    const { dx, dy } = this;
    const { clientX, clientY } = event;
    let cursorType: ICursorType = 'default';
    const coords = this.canvas.getBoundingClientRect();
    const canvasLeft = coords.left;
    const canvasTop = coords.top;

    const x = clientX - canvasLeft;
    const y = clientY - canvasTop;

    this.mouseX = x;
    this.mouseY = y;

    for ( let i = 0; i < labels.length; i++ ) {
      const label = labels[i];
      label.mouseMove(x, y);
      const edgeType = label.inEdgeRect(x, y);
      if (edgeType) {
        if (label.mode === 'resize') {
          cursorType = getCursourByEdgeType(edgeType, label);
        } else {
          cursorType = 'pointer';
        }
      }
      if (label.isInNullifyRect(x, y)) {
        cursorType = 'pointer';
      }
    }

    this.canvas.style.cursor = cursorType;
  }

  private handleMouseUp = () => {
    const labels: Label[] = this.labels;
    this.inResizing = false;
    this.inRotating = false;

    for(let i = 0; i < labels.length; i++) {
      const label = labels[i];
      label.mouseUp();
    }
  }

}

export { CanvasController };