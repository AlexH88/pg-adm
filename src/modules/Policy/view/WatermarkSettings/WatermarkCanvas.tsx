import React, {FC} from 'react';
import {Group, Image, Text, Transformer} from 'react-konva';

import {barcode, qrcode, svg2url} from 'pure-svg-code';
import {StageDimensions} from '.';

interface Props {
  id: number;
  setRef(element: HTMLElement, id: number): void;
  watermarkRefs: any;
  key: number;
  shapeProps: any;
  stageDimensions: StageDimensions;
  isSelected: boolean;
  onSelect(): void;
  onChange(watermark: any): void;
  handleStartEdit(e: Event, id: number): void;
  editorActive: boolean;
  //user: any;
}

export const getXOffset = (value, textNode) => {
  if (value) {
    return value / 2;
  }
  if (typeof textNode !== 'undefined') {
    return textNode.width() / 2;
  }
  return 0;
};

export const getYOffset = (value, textNode) => {
  if (value) {
    return value / 2;
  }
  if (typeof textNode !== 'undefined') {
    return textNode.height() / 2;
  }
  return 0;
};

const SingleWatermark: FC<Props> = (props) => {
  const {
    shapeProps,
    isSelected,
    onSelect,
    onChange,
    editorActive,
    handleStartEdit,
    setRef,
    watermarkRefs,
    stageDimensions,
  } = props;

  const {
    id,
    customText: text,
    fontSize,
    color,
    rotationAngle: rotation,
    horizontalPosition,
    verticalPosition,
    opacity,
    width = null,
    height = null,
    verticalRepeat,
    verticalRepeatInterval = 10,
    horizontalRepeat,
    type = 'STRING'
  } = shapeProps;

  const trRef = React.useRef(null);
  const targetRef = React.useRef(null);
  const spaceRef = React.useRef(null);

  const textNode = watermarkRefs ? watermarkRefs.current[id] : {};

  const currentX = (horizontalPosition / 100) * stageDimensions.width;
  const currentY = (verticalPosition / 100) * stageDimensions.height;

  const currentWidth = width ? (width / 100) * stageDimensions.width : width;
  const currentHeight = height ? (height / 100) * stageDimensions.height : height;

  const offsetX = getXOffset(currentWidth, textNode);
  const offsetY = type === 'QR' ? getXOffset(currentWidth, textNode) : getYOffset(currentHeight, textNode);

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.setNode(targetRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  let spacerWidth = 0;

  if (spaceRef.current !== null) {
    spacerWidth = spaceRef.current.width();
  }

  const doppelQuantity = verticalRepeatInterval && Math.ceil(100 / verticalRepeatInterval);
  const doppelMarks = Array.apply(null, Array(doppelQuantity));

  const formattedText = text;

  let barcodeText = formattedText.length > 0 ? barcode(formattedText, "code128", {
    width: stageDimensions.width / 2,
    barHeight: stageDimensions.height / 10,
    color
  }) : '';

  let qrcodeText =  formattedText.length > 0 ? qrcode({
    content: formattedText,
    padding: 0,
    width: stageDimensions.width / 2,
    height: stageDimensions.width / 2,
    color,
    ecl: "M"
  }) : '';

  let imageSrc = null;

  if (type === 'QR' && qrcodeText.length > 0) {
    imageSrc = svg2url(qrcodeText);
  } else if (type === 'BARCODE' && barcodeText.length > 0) {
    imageSrc = svg2url(barcodeText);
  }

  const imageObj = document.createElement('img');
  imageObj.src = imageSrc;

  let enabledAnchors = ['bottom-right'];
  if (type === 'BARCODE') {
    enabledAnchors = enabledAnchors.concat(['middle-right', 'bottom-center']);
  }

  const conversionRatio = 129;

  return (
    <Group visible={!(editorActive && isSelected)}>
      {/*<Text ref={spaceRef} text={'     '} fontSize={fontSize / 2} visible={false} />*/}
      <Group
        ref={targetRef}
        onClick={onSelect}
        offsetX={offsetX}
        offsetY={offsetY}
        x={currentX}
        y={currentY}
        opacity={opacity}
        rotation={rotation}
        draggable={isSelected}
        // onDblClick={(e) => handleStartEdit(e, id)}
        dragBoundFunc={(pos) => {
          let x: number;
          let y: number;
          if (pos.x < 0) { x = 0 }
          else if (pos.x > stageDimensions.width) { x = stageDimensions.width }
          else { x = pos.x }

          if (pos.y < 0) { y = 0 }
          else if (pos.y > stageDimensions.height) { y = stageDimensions.height }
          else { y = pos.y }

          return { x, y };
        }}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            horizontalPosition: Math.round((e.target.x() / stageDimensions.width) * 100),
            verticalPosition: Math.round((e.target.y() / stageDimensions.height) * 100)
          });
        }}
        onTransformEnd={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();

          e.target.scaleX(1);
          e.target.scaleY(1);

          const fontsizeUpdate = type === 'STRING' ? {fontSize: Math.floor(textNode.fontSize() * Math.abs(scaleY) * 2)} : {};

          onChange({
            ...shapeProps,
            //width: textNode.width() * scaleX,
            //height: textNode.height() * scaleY,
            width: Math.ceil((textNode.width() * scaleX / stageDimensions.width) * 100),
            height: Math.ceil((textNode.height() * scaleY / stageDimensions.height) * 100),
            rotationAngle: Math.round(e.target.rotation()),
            ...fontsizeUpdate
          });
        }}
      >
        {type === 'STRING' && (
          <Text
            ref={(refObj) => setRef(refObj as any, id)}
            text={formattedText}
            fontSize={fontSize / 2}
            fill={color}
          />
        )}
        {type === 'QR' && (
          <Image
            ref={(refObj) => setRef(refObj as any, id)}
            width={currentWidth}
            height={currentWidth}
            image={imageObj}
          />
        )}
        {type === 'BARCODE' && (
          <Image
            ref={(refObj) => setRef(refObj as any, id)}
            width={currentWidth}
            height={currentHeight}
            image={imageObj}
          />
        )}
      </Group>

      {type === 'STRING' && horizontalRepeat && (
        <Group
          rotation={rotation}
          x={currentX}
          y={currentY}
          offsetX={offsetX}
          offsetY={offsetY}
        >
          {doppelMarks.map((d, i) => (
            <Text
              key={i}
              text={formattedText}
              fontSize={fontSize / 2}
              onClick={onSelect}
              fill={color}
              x={- (currentWidth + 2 * spacerWidth) * (i + 1)}
              opacity={opacity}
            />
          ))}
          {doppelMarks.map((d, i) => (
            <Text
              key={i}
              text={formattedText}
              fontSize={fontSize / 2}
              onClick={onSelect}
              fill={color}
              x={(currentWidth + 2 * spacerWidth) * (i + 1)}
              opacity={opacity}
            />
          ))}
        </Group>
      )}
      {type === 'STRING' && verticalRepeat && (
        <Group
          rotation={rotation}
          x={currentX}
          y={currentY}
          offsetX={offsetX}
          offsetY={offsetY}
        >
          {doppelMarks.map((d, i) => (
            <Group y={- ((verticalRepeatInterval + fontSize/verticalRepeatInterval) * (i + 1) / conversionRatio) * stageDimensions.height} key={i}>
              <Text
                key={i}
                text={formattedText}
                fontSize={fontSize / 2}
                onClick={onSelect}
                fill={color}
                opacity={opacity}
              />
              {horizontalRepeat && (
                <Group>
                  {doppelMarks.map((d, i) => (
                    <Text
                      key={i}
                      text={formattedText}
                      fontSize={fontSize / 2}
                      onClick={onSelect}
                      fill={color}
                      x={- (currentWidth + 2 * spacerWidth) * (i + 1)}
                      opacity={opacity}
                    />
                  ))}
                  {doppelMarks.map((d, i) => (
                    <Text
                      key={i}
                      text={formattedText}
                      fontSize={fontSize / 2}
                      onClick={onSelect}
                      fill={color}
                      x={(currentWidth + 2 * spacerWidth) * (i + 1)}
                      opacity={opacity}
                    />
                  ))}
                </Group>
              )}
            </Group>
          ))}
          {doppelMarks.map((d, i) => (
            <Group y={((verticalRepeatInterval + fontSize/verticalRepeatInterval) * (i + 1) / conversionRatio) * stageDimensions.height} key={i}>
              <Text
                key={i}
                text={formattedText}
                fontSize={fontSize / 2}
                onClick={onSelect}
                fill={color}
                opacity={opacity}
              />
              {horizontalRepeat && (
                <Group>
                  {doppelMarks.map((d, i) => (
                    <Text
                      key={i}
                      text={formattedText}
                      fontSize={fontSize / 2}
                      onClick={onSelect}
                      fill={color}
                      x={- (currentWidth + 2 * spacerWidth) * (i + 1)}
                      opacity={opacity}
                    />
                  ))}
                  {doppelMarks.map((d, i) => (
                    <Text
                      key={i}
                      text={formattedText}
                      fontSize={fontSize / 2}
                      onClick={onSelect}
                      fill={color}
                      x={(currentWidth + 2 * spacerWidth) * (i + 1)}
                      opacity={opacity}
                    />
                  ))}
                </Group>
              )}
            </Group>
          ))}
        </Group>
      )}
      {isSelected && (
        <Transformer
          enabledAnchors={enabledAnchors}
          rotateEnabled={type === 'STRING'}
          rotateAnchorOffset={15}
          centeredScaling
          anchorCornerRadius={5}
          anchorFill={'orange'}
          boundBoxFunc={(oldBox, newBox) => {
            if (
              (newBox.height < 0.5 || newBox.width < 0 )
              || (type === 'STRING' && newBox.height > 50.5)
              || (['QR', 'BARCODE'].includes(type) && ((newBox.height > stageDimensions.width) || (newBox.width > stageDimensions.width)))
            ) {
              return oldBox;
            }
            return newBox;
          }}
          ref={trRef}
        />
      )}
    </Group>
  );
};

export default SingleWatermark;