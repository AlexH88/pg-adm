import {ICursorType, IStep} from './index';
import {IRect} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor/types';
import {ILabelType, Label} from 'modules/Policy/view/MarkPolicies/dialogs/LabelsEditor/label';
import {TEXT_COLOR} from './label';

export const grad2Rad = Math.PI / 180;

export function round(num: number, step: IStep): number {
  return Math.round(num / step) * step;
};

export function getCursourByEdgeType(edge: any, label: Label): ICursorType {
  let cursorType: ICursorType = (
    { 11: 'nw', 12: 'ne', 21: 'ne', 22: 'nw', top: 'n', left: 'e', right: 'e', bottom: 'n' } as any
  )[edge] + '-resize' as ICursorType;
  if ((label.type === 'qrcode' || label.angle% 90 !== 0) && (['top', 'bottom', 'left', 'right'].indexOf(edge) !== -1)) {
    cursorType = 'default';
  }
  return cursorType;
}

interface IActions {
  [key: string]: () => void;
}

function getMinSizes(labelType: ILabelType) {
  return ({
    barcode: { w: 10, h: 10, p: false },
    qrcode: { w: 20, h: 20, p: true },
    image: { w: 50, h: 50, p: false },
    text: { w: 20, h: 20, p: false }
  } as any)[labelType];
}

export function resizeRect(rect: Label, clientX: number, clientY: number, step: IStep) {
  const canvas = rect.controller.canvas;
  const oldW = rect.W;
  const oldH = rect.H;
  const minRectSize = getMinSizes(rect.type);
  const min = { w: minRectSize.w, h: minRectSize.h };
  const proportional = rect.angle % 90 !== 0;
  const square = minRectSize.p;

  const resizeActions: IActions = {
    11: () => {
      if (clientX <= 0) {
        clientX = 0;
      }
      if (clientY <= 0) {
        clientY = 0;
      }
      const oldY = rect.Y;
      const oldX = rect.X;
      let newWrapperH = Math.max((oldY + rect.H) - round(clientY, step), min.h);
      let newWrapperW = Math.max((oldX + rect.W) - round(clientX, step), min.w);
      let newWrapperY = round(clientY, step);
      let newWrapperX = round(clientX, step);

      if ((oldY + rect.H) - clientY <= min.h) {
        newWrapperY = oldY + rect.H - min.h;
        newWrapperH = min.h;
      }
      if ((oldX + rect.W) - clientX <= min.w) {
        newWrapperX = oldX + rect.W - min.w;
        newWrapperW = min.w;
      }

      // if (square) {
      //   let rectSide = Math.max(newWrapperH, newWrapperW);
      //   newWrapperH = rectSide;
      //   newWrapperW = rectSide;
      //   newWrapperX = oldX + rect.W - rectSide;
      //   newWrapperY = oldY + rect.H - rectSide;
      // }

      if (proportional || square) {
        // if (clientX - (rect.X + rect.W) > clientY - (rect.Y + rect.H)) {
        //   const coeff = newWrapperW / rect.W;
        //   newWrapperW = newWrapperW;
        //   newWrapperH = rect.H * coeff;
        //   newWrapperX = oldX + rect.W - newWrapperW;
        //   newWrapperY = oldY + rect.H - newWrapperH;
        // } else {
        const coeff = newWrapperH / rect.H;
        newWrapperH = newWrapperH;
        newWrapperW = rect.W * coeff;
        newWrapperX = oldX + rect.W - newWrapperW;
        newWrapperY = oldY + rect.H - newWrapperH;
        // }


        if (newWrapperX <= 0) {
          newWrapperW = rect.X + rect.W;
          
          newWrapperX = 0;
          
          const coeff = newWrapperW / rect.W;
          newWrapperH = rect.H * coeff;
          newWrapperY = oldY + rect.H - newWrapperH;
        }


      }

      rect.H = newWrapperH;
      rect.W = newWrapperW;
      rect.Y = newWrapperY;
      rect.X = newWrapperX;
    },
    12: () => {
      if (clientY <= 0) {
        clientY = 0;
      }
      if (clientX >= (canvas.offsetWidth)) {
        clientX = canvas.offsetWidth;
      }
      const oldY = rect.Y;
      const oldX = rect.X;
      let newWrapperW = Math.max(round(clientX - rect.X, step), min.w);
      let newWrapperH = Math.max((oldY + rect.H) - round(clientY, step), min.h);
      let newWrapperY = round(clientY, step);
      if ((oldY + rect.H) - clientY <= min.h) {
        newWrapperY = oldY + rect.H - min.h;
        newWrapperH = min.h;
      }
      // if (square) {
      //   let rectSide = Math.max(newWrapperH, newWrapperW);
      //   newWrapperH = rectSide;
      //   newWrapperW = rectSide;
      //   newWrapperY = oldY + rect.H - rectSide;
      // }

      if (proportional || square) {
        // if (clientX - (rect.X + rect.W) > clientY - (rect.Y + rect.H)) {
        //   const coeff = newWrapperW / rect.W;
        //   newWrapperW = newWrapperW;
        //   newWrapperH = rect.H * coeff;
        //   newWrapperY = oldY + rect.H - newWrapperH;
        // } else {
        const coeff = newWrapperH / rect.H;
        newWrapperH = newWrapperH;
        newWrapperW = rect.W * coeff;
        newWrapperY = oldY + rect.H - newWrapperH;
        // }

        if (rect.X + newWrapperW > canvas.offsetWidth) {
          newWrapperW = canvas.offsetWidth - rect.X;
          const coeff = newWrapperW / rect.W;
          newWrapperH = rect.H * coeff;
          newWrapperY = oldY + rect.H - newWrapperH;
        }

      }

      rect.H = newWrapperH;
      rect.W = newWrapperW;
      rect.Y = newWrapperY;
    },
    21: () => {
      if (clientX <= 0) {
        clientX = 0;
      }
      if (clientY >= (canvas.offsetHeight)) {
        clientY = canvas.offsetHeight;
      }
      const oldY = rect.Y;
      const oldX = rect.X;
      let newWrapperH = Math.max(round(clientY - rect.Y, step), min.h);
      let newWrapperW = Math.max((oldX + rect.W) - round(clientX, step), min.w);
      let newWrapperX = round(clientX, step);
      if ((oldX + rect.W) - clientX <= min.w) {
        newWrapperX = oldX + rect.W - min.w;
        newWrapperW = min.w;
      }

      // if (square) {
      //   let rectSide = Math.max(newWrapperH, newWrapperW);
      //   newWrapperH = rectSide;
      //   newWrapperW = rectSide;
      //   newWrapperX = oldX + rect.W - rectSide;
      // }

      if (proportional || square) {
        // if (clientX - (rect.X + rect.W) > clientY - (rect.Y + rect.H)) {
          const coeff = newWrapperW / rect.W;
          newWrapperW = newWrapperW;
          newWrapperH = rect.H * coeff;
          newWrapperX = oldX + rect.W - newWrapperW;
        // } else {
        //   const coeff = newWrapperH / rect.H;
        //   newWrapperH = newWrapperH;
        //   newWrapperW = rect.W * coeff;
        //   newWrapperX = oldX + rect.W - newWrapperW;
        // }

        if (rect.Y + newWrapperH >= canvas.offsetHeight) {
          newWrapperH = canvas.offsetHeight - rect.Y;
          const coeff = newWrapperH / rect.H;
          newWrapperW = rect.W * coeff;
          newWrapperX = oldX + rect.W - newWrapperW;          
        }

      }

      rect.H = newWrapperH;
      rect.W = newWrapperW;
      rect.X = newWrapperX;
    },
    22: () => {
      if (clientX >= (canvas.offsetWidth)) {
        clientX = canvas.offsetWidth;
      }
      if (clientY >= (canvas.offsetHeight)) {
        clientY = canvas.offsetHeight;
      }

      let newWrapperW = Math.max(round(clientX - rect.X, step), min.w);
      let newWrapperH = Math.max(round(clientY - rect.Y, step), min.h);

      const rectSide = Math.max(newWrapperH, newWrapperW);

      if (proportional || square) {
        // if (clientX - (rect.X + rect.W) > clientY - (rect.Y + rect.H)) {
          const coeff = newWrapperW / rect.W;
          newWrapperW = newWrapperW;
          newWrapperH = rect.H * coeff;
        // } else {
        //   const coeff = newWrapperH / rect.H;
        //   newWrapperH = newWrapperH;
        //   newWrapperW = rect.W * coeff;
        // }

        // if (rect.X + newWrapperW >= canvas.offsetWidth || rect.Y + newWrapperH >= canvas.offsetHeight) {
        //   return;
        // }

        // if (rect.X + newWrapperW >= canvas.offsetWidth) {
        //   rect.W = canvas.offsetWidth - rect.X;
        // } else if (rect.Y + newWrapperH >= canvas.offsetHeight) {
        //   rect.H = canvas.offsetHeight - rect.Y;
        // } 

        if (rect.Y + newWrapperH >= canvas.offsetHeight) {
          newWrapperH = canvas.offsetHeight - rect.Y;
          const coeff = newWrapperH / rect.H;
          newWrapperW = rect.W * coeff;
        }

        rect.W = newWrapperW;
        rect.H = newWrapperH;

      } else {
        rect.W = square ? rectSide : newWrapperW;
        rect.H = square ? rectSide : newWrapperH;
      }

    },
    top: () => {
      if (clientY <= 0) {
        clientY = 0;
      }
      if (square || proportional) {
        return;
      }
      const oldY = rect.Y;
      let newWrapperH = Math.max((oldY + rect.H) - round(clientY, step), min.h);
      let newWrapperY = round(clientY, step);
      if ((oldY + rect.H) - clientY <= min.h) {
        newWrapperY = oldY + rect.H - min.h;
        newWrapperH = min.h;
      }
      rect.H = newWrapperH;
      rect.Y = newWrapperY;
    },
    right: () => {
      if (clientX >= (canvas.offsetWidth)) {
        clientX = canvas.offsetWidth;
      }
      if (square || proportional) {
        return;
      }
      const newWrapperW = Math.max(round(clientX - rect.X, step), min.w);
      rect.W = newWrapperW;
    },
    left: () => {
      if (clientX <= 0) {
        clientX = 0;
      }
      if (square || proportional) {
        return;
      }
      const oldX = rect.X;
      let newWrapperW = Math.max((oldX + rect.W) - round(clientX, step), min.w);
      let newWrapperX = round(clientX, step);
      if ((oldX + rect.W) - clientX <= min.w) {
        newWrapperX = oldX + rect.W - min.w;
        newWrapperW = min.w;
      }
      rect.W = newWrapperW;
      rect.X = newWrapperX;
    },
    bottom: () => {
      if (clientY >= (canvas.offsetHeight)) {
        clientY = canvas.offsetHeight;
      }
      if (square || proportional) {
        return;
      }
      const newWrapperH = Math.max(round(clientY - rect.Y, step), min.h);
      rect.H = newWrapperH;
    }
  }

  resizeActions[rect.edgeType || 11]();
  fixRectSizes(rect, { W: oldW, H: oldH });
}

export function rotateRect(rect: Label, clientX: number, clientY: number) {
  // console.clear();
  // console.log(' ::: START :::');  
  const cursor = { x: clientX, y: clientY };
  const centerOld = { x: rect.X + rect.W / 2, y: rect.Y + rect.H / 2 };
  const maxSide = Math.max(rect.W, rect.H);
  const center = { 
    x: rect.X - (maxSide - rect.W) / 2 + maxSide / 2,
    y: rect.Y - (maxSide - rect.H) / 2 + maxSide / 2
  };
  // console.log('rect.angle : ' + rect.angle);
  // console.log('rect.deltaAngle : ' + rect.deltaAngle);
  let newAngle = rect.angle;

  const fourth4 = cursor.x > center.x && cursor.y > center.y;
  const fourth3 = cursor.x < center.x && cursor.y > center.y;
  const fourth2 = cursor.x < center.x && cursor.y < center.y;
  const fourth1 = cursor.x > center.x && cursor.y < center.y;

  const ratio = (cursor.y - center.y) / (cursor.x - center.x);

  const coeff = rect.W / rect.H;

  // console.log('coeff : ' + coeff);
  // console.log('ratio : ' + ratio);

  if (fourth4) {
    newAngle = Math.atan(ratio) / grad2Rad - 42.5 + rect.deltaAngle;
  } else if (fourth3) {
    // newAngle = Math.atan(ratio * coeff) / grad2Rad + 135 + rect.deltaAngle;
    newAngle = Math.atan(ratio) / grad2Rad + 137.5 + rect.deltaAngle;
  } else if (fourth2) {
    newAngle = Math.atan(ratio) / grad2Rad + 137.5 + rect.deltaAngle;
  } else if (fourth1) {
    // newAngle = Math.atan(ratio * coeff) / grad2Rad - 45 + rect.deltaAngle;
    newAngle = Math.atan(ratio) / grad2Rad - 42.5 + rect.deltaAngle;
  }

  if (newAngle <= 0) {
    while (newAngle <= 0) {
      newAngle = 360 + newAngle;
    }
  }

  if (newAngle >= 360) {
    while (newAngle >= 360) {
      newAngle = newAngle - 360;
    }
  }

  rect.angle = Math.round(newAngle);
  // console.log('angle: ' + rect.angle);
  fixWrapperSizes(rect);
  // console.log(' ::: FINISH :::');
}

export function fixRectSizes(rect: Label, old: { W: number, H: number }) {
  const { w, h, X, Y, W, H } = rect;

  let newW = w * (W / old.W);
  let newH = h * (H / old.H);
  let newX = X + (W - newW) / 2;
  let newY = Y + (H - newH) / 2;

  if (rect.angle === 90 || rect.angle === 270) {
    // const coeff = old.W / old.H;
    newW = H;
    newH = W;
    newX = X + (W - newW) / 2;
    newY = Y + (H - newH) / 2;
  }

  rect.w = newW;
  rect.h = newH;
  rect.x = newX;
  rect.y = newY;
}

export function fixWrapperSizes(rect: Label) {
  const { x, y, w, h, angle } = rect;
  const R = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
  const gradToRad = Math.PI / 180;
  const bettaGrad = Math.atan((h / 2) / (w / 2)) / gradToRad;
  let angleForX = angle;
  let angleForY = angle;

  if (angle > 0 && angle < 90) {
    angleForY = 180 - angle;
  }
  if (angle > 90 && angle < 180) {
    angleForX = 180 - angle;
  }
  if (angle > 180 && angle < 270) {
    angleForY = 180 - angle;
  }
  if (angle > 270 && angle < 360) {
    angleForX = 180 - angle;
  }
  const newW = 2 * R * Math.abs(Math.cos((angleForX - bettaGrad) * gradToRad));
  const newH = 2 * R * Math.abs(Math.sin((angleForY - bettaGrad) * gradToRad));

  rect.X = x - (newW / 2 - w / 2);
  rect.Y = y - (newH / 2 - h / 2);
  rect.W = newW;
  rect.H = newH;
}

export function fixDimensions(label: Label) {
  const canvas = label.controller.canvas;

  if (label.W > canvas.offsetWidth) {
    const newWidth = Math.floor(canvas.offsetWidth / label.controller.markForm.state.step) * label.controller.markForm.state.step;
    const coeff = label.W / newWidth;
    const oldW = label.W;
    const oldH = label.H;
    label.X = 0;
    label.W = newWidth;
    label.H = label.H / coeff;
    fixRectSizes(label, { W: oldW, H: oldH });
  }

  if (label.H > canvas.offsetHeight) {
    const newHeight = Math.floor(canvas.offsetHeight / label.controller.markForm.state.step) * label.controller.markForm.state.step;
    const coeff = label.H / newHeight;
    const oldW = label.W;
    const oldH = label.H;
    label.Y = 0;
    label.H = newHeight;
    label.W = label.W / coeff;
    fixRectSizes(label, { W: oldW, H: oldH });
  }

  if (label.X < 0) {
    label.X = 0;
  }

  if (label.Y < 0) {
    label.Y = 0;
  }

  if (label.X + label.W >= canvas.offsetWidth) {
    const deltaX = label.X + label.W - canvas.offsetWidth;
    label.X = label.X - deltaX;
  }

  if (label.Y + label.H >= canvas.offsetHeight) {
    const deltaY = label.Y + label.H - canvas.offsetHeight;
    label.Y = label.Y - deltaY;
  }

  fixRectSizes(label, { W: label.W, H: label.H });
}

export function translateRect(rect: Label, newX: number, newY: number, step: IStep) {
  const { dx, dy, canvas } = rect.controller;
  if (newX - dx <= 0) {
    rect.X = 0;
  } else if ((newX - dx + rect.W) >= (canvas.width)) {
    rect.X = (canvas.width) - rect.W;
  } else {
    rect.X = round(newX - dx, step);
  }
  if (newY - dy <= 0) {
    rect.Y = 0;
  } else if ((newY - dy + rect.H) >= (canvas.height)) {
    rect.Y = (canvas.height) - rect.H;
  } else {
    rect.Y = round(newY - dy, step);
  }

  fixRectSizes(rect, { W: rect.W, H: rect.H });
}

export function fillLabel(ctx: CanvasRenderingContext2D, label: Label) {
  const { image , type, x, y, w, h, angle } = label;
  ctx.save();

  const renderActions: IActions = {
    image: () => {
      if (image) {
        ctx.drawImage(image, x, y, w, h);
      }
    },
    text: () => {
      ctx.save();
      ctx.fillStyle = TEXT_COLOR;
      wrapText(ctx, label.text, x, y, w, h, label.fontSize);
      ctx.restore();
    },
    barcode: () => {
      if (label.barCode) {
        ctx.fillStyle = 'WHITE';
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(label.barCode, x, y, w, h);
      }
    },
    qrcode: () => {
      if (label.QRCode) {
        ctx.fillStyle = 'WHITE';
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(label.QRCode, x, y, w, h);
      }
    }
  }

  renderActions[label.type]();
  ctx.restore();
}

export function inRect(clientX: number, clientY: number, rect: IRect) {
  const { x, y, w, h } = rect;
  return (
    clientX > x &&
    clientX <= (x + w) &&
    clientY > y &&
    clientY <= (y + h)
  );
}

export function strokeLabel(ctx: CanvasRenderingContext2D, label: Label) {
  const { x, y, w, h, angle } = label;
  if (angle % 90 === 0 && label.isSelected) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.lineWidth = .2;
  ctx.strokeRect(x, y, w, h);
  ctx.restore();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number,
                                                                                                    fontSize: number) {
  const lineMargin = fontSize * 0.8;
  y += lineMargin;
  let top = y;
  let line = text;
  let n = 0;
  ctx.font = `${fontSize}px TimesNewRoman`;
  while (line.length) {
    const textWidth = ctx.measureText(line.substr(0, n)).width;
    if (textWidth >= w) {
      const oldTop = top;
      const strToFill = line.substr(0, n - 1);
      line = line.slice(n - 1);
      n = 0;
      top += lineMargin;
      if ((top - y) < h) {
        ctx.fillText(strToFill, x, oldTop);
      } else {
        line = '';
      }
    } else {
      n++;
      if (n > line.length) {
        if ((top - y + lineMargin) < h) {
          ctx.fillText(line, x, top);
        }
        line = '';
      }
    }
  }
};