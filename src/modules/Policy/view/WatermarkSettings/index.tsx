import React, {CSSProperties, FC, ReactElement, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import {ChromePicker} from 'react-color';
import {Layer, Stage} from 'react-konva';
import * as Yup from 'yup';
// import { ApplicationState } from '../../../../../../../store';
// import { Spinner } from '../../../../../../../features/Spinners/views/spinner';
import {Button} from './Button';
import FormHintPopup from './hint-popup/form-hint-popup';
// import { t } from '../../../../../../../i18n';
import Checkbox from './Checkbox';
import {Input} from './Input';
import {Icon} from '../../../../shared/view/elements';
import * as styles from './styles.styl';
import {getWatermarksSettings, setWatermarksSettings} from '../../redux/actions/communication';
// import { setUnsavedState } from '../../redux';
// import { Watermark } from '../../../../redux';
import UserFileFolderTable from './Table';
// import { Icon, IconType } from '../../../../../../../components/elements/Icon';
import ArrowBackIcon from './arrow-back';
// import { User } from '../../../../../../guest/types';
import SingleWatermark from './WatermarkCanvas';
// import { watermarkSettingsFormInitialValues } from '../../../../utils';
// import { dialogs } from '../../../../../../../features/Modal';
// import { TableBodyConfig } from '../../../../../../../features/FileManager/types';
import * as Barcode from './svg/barcode.svg';
import * as QRCode from './svg/qrcode.svg';
import * as Textcode from './svg/textcode.svg';

const watermarkSettingsFormInitialValues = {
  id: null,
  type: 'STRING',
  color: '#000',
  name: 'New name',
  customText: 'New watermark',
  hashTag: false,
  fontSize: 18,
  horizontalPosition: 50,
  horizontalRepeat: false,
  horizontalRepeatInterval: 20,
  opacity: 1,
  rotationAngle: 0,
  verticalPosition: 50,
  verticalRepeat: false,
  verticalRepeatInterval: 20,
  width: null,
  height: null,
};

const watermarkValidationSchema = Yup.object().shape({
  name: Yup.string().max(256, 'Не может быть более 256'),
  customText: Yup.string().max(256, 'Не может быть более 256'),
  hashTag: Yup.boolean().nullable(),
  color: Yup.string().required('Обязательное значение'),
  fontSize: Yup.number().min(1, 'Не может быть менее 1').max(100, 'Не может быть более 100').nullable()/*.required('Обязательное значение')*/,
  horizontalPosition: Yup.number().min(0, 'Не может быть менее 0').max(100, 'Не может быть более 100').required('Обязательное значение'),
  verticalPosition: Yup.number().min(0, 'Не может быть менее 0').max(100, 'Не может быть более 100').required('Обязательное значение'),
  rotationAngle: Yup.number().min(0, 'Не может быть менее 0').max(359, 'Не может быть более 359').nullable()/*.required('Обязательное значение')*/,
  opacity: Yup.number().min(0, 'Не может быть более 100').max(1, 'Не может быть менее 0').required('Обязательное значение'),
  verticalRepeatInterval: Yup.number().min(10, 'Не может быть менее 10').max(100, 'Не может быть более 100').nullable(),
  horizontalRepeatInterval: Yup.number().min(10, 'Не может быть менее 10').max(100, 'Не может быть более 100').nullable(),
  verticalRepeat: Yup.boolean().nullable(),
  horizontalRepeat: Yup.boolean().nullable(),
  height: Yup.number().min(0, 'Не может быть менее 0').max(100, 'Не может быть более 100').nullable(),
  width: Yup.number().min(0, 'Не может быть менее 0').max(100, 'Не может быть более 100').nullable(),
  type: Yup.string().oneOf(['STRING', 'QR', 'BARCODE']),
});

interface FieldProps {
  name: string;
  label: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  value: any;
  error?: any;
  type?: string;
  min?: number;
  max?: number;
  step?: number;
  readOnly?: boolean;
  onClick?: (e: any) => void;
  style?: any;
}

export interface StageDimensions {
  width: number;
  height: number;
}

const CheckboxWithLabel: FC<FieldProps> = (props): ReactElement<HTMLDivElement> => {
  const { name, label, value, disabled, onChange } = props;
  return (
    <div style={{ padding: '2px 0' }}>
      <label htmlFor={name} className={styles['form-group-custom__input-row']}>
        <div>
          <span style={{ marginRight: '10px' }}>{label}</span>
        </div>
        <Checkbox
          value={value}
          id={name}
          onChange={onChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

const InputWithLabel: FC<FieldProps> = (props): ReactElement<HTMLDivElement> => {
  const {
    name,
    label,
    value,
    disabled,
    onChange,
    type,
    step,
    min,
    max,
    readOnly,
    onClick,
    error,
    style: propsStyle
  } = props;
  const style: CSSProperties = {
    width: '100%',
    ...propsStyle,
  };
  return (
    <div>
      <label htmlFor={name} className={styles['form-group-custom__input-row']}>
        <div>
          <span style={{ marginRight: '10px' }}>{label}</span>
        </div>
        <div style={{ position: 'relative' }}>
          <FormHintPopup position="right" message={error} />
          <Input
            value={value}
            id={name}
            step={step}
            min={min}
            max={max}
            onChange={onChange}
            disabled={disabled}
            type={type}
            readOnly={readOnly}
            onClick={onClick}
            style={style}
          />
        </div>
      </label>
    </div>
  );
};

const WatermarkSettingsForm: FC<any> = (props: any): ReactElement<HTMLFormElement> => {
  const dispatch = useDispatch();
  const watermarksSettings = useSelector((state: any): /*Watermark[]*/ any => state.policy.watermarkSettings, shallowEqual);
  //const user = useSelector((state: any) => state.currentUser.user, shallowEqual);
  const [spinner, setSpinner] = useState<boolean>(false);
  const [colorPicker, setColorPicker] = React.useState(false);

  const [watermarks, setWatermarks] = React.useState([]);
  const [fallbackWatermark, setFallbackWatermark] = React.useState(null);
  const [selectedId, selectShape] = React.useState(null);

  const [editorText, setEditorText] = React.useState('');
  const [editorActive, setEditor] = React.useState(false);
  const [editorStyle, setEditorStyle] = React.useState({});


  const stageRef = React.useRef();
  const inputRef = React.useRef();

  const watermarkRefs = React.useRef({});

  const dataRef = React.useRef(100);

  const {
    editedWatermarkPolicy,
    onClose
  } = props;

  useEffect((): void => {
    const fetchedWatermarks = typeof watermarksSettings !== 'undefined' ? watermarksSettings.map((w: any) => ({ ...w })) : [];

    setWatermarks(fetchedWatermarks);
  }, [watermarksSettings]);


  useEffect((): void => {
    dataRef.current = watermarks.length;

    let updatedMarksCount = 0;
    const updWatermarks = watermarks.map((m: any) => {
      const mark = m;

      const newWidth = Math.ceil(watermarkRefs.current[m.id].width() / stageDimensions.width * 100);
      const newHeight = Math.ceil(watermarkRefs.current[m.id].height() / stageDimensions.height * 100);
      if (
        m.width !== newWidth
        || m.height !== newHeight
      ) {
        updatedMarksCount += 1;
        return {
          ...m,
          width: newWidth,
          height: newHeight,
        };
      }
      return mark;
    })
    
    if (updatedMarksCount > 0) {
      setWatermarks(updWatermarks);
    }
    
  }, [watermarks]);

  const showSpinner = (): void => {
    setSpinner(true);
  };

  const hideSpinner = (): void => {
    setSpinner(false);
  };

  useEffect((): (() => void) => {
    const getCoreData = async (): Promise<void> => {
      showSpinner();
      await dispatch(getWatermarksSettings(editedWatermarkPolicy));
      hideSpinner();
    };

    getCoreData();
    return () => {
      //dispatch(setUnsavedState(false));
    };
  }, []);

  const onSubmit = async (/*e: any*/): Promise<void> => {
    showSpinner();
    selectShape(null);
    //setFallbackWatermark(null);
    const cleanedUpWatermarks = watermarks.map((wm: any) => {
      const {
        id,
        type,
        color,
        name,
        customText,
        hashTag,
        fontSize,
        horizontalPosition,
        horizontalRepeat,
        opacity,
        rotationAngle,
        verticalPosition,
        verticalRepeat,
        verticalRepeatInterval,
        horizontalRepeatInterval,
        width,
        height
      } = wm;
      if (type === 'STRING') {
        return {
          id,
          type,
          color,
          name,
          customText,
          hashTag,
          fontSize,
          horizontalPosition,
          horizontalRepeat,
          horizontalRepeatInterval,
          verticalPosition,
          verticalRepeat,
          verticalRepeatInterval,
          opacity,
          rotationAngle,
        }
      } else if (type === 'QR') {
        return {
          id,
          type,
          color,
          name,
          customText,
          hashTag,
          horizontalPosition,
          opacity,
          //rotationAngle,
          verticalPosition,
          width
        }
      } else if (type === 'BARCODE') {
        return {
          id,
          type,
          color,
          name,
          customText,
          hashTag,
          horizontalPosition,
          opacity,
          //rotationAngle,
          verticalPosition,
          width,
          height
        }
      }
    })
    dispatch(setWatermarksSettings(editedWatermarkPolicy, cleanedUpWatermarks));
    onClose();
    hideSpinner();
  };

  const handleInputConfirm = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.keyCode === 13) {
      setWatermarks((prev) => {
        const updMarks = prev.map((m: any) => {
          if (m.id === selectedId) {
            return { ...m, customText: editorText };
          }
          return m;
        })
        return updMarks;
      });

      setEditor(false);
    }
  }

  const formik = useFormik({
    initialValues: watermarkSettingsFormInitialValues,
    enableReinitialize: false,
    validationSchema: watermarkValidationSchema,
    onSubmit
  });

  useEffect((): void => {
    //dispatch(setUnsavedState(formik.dirty));
  }, [formik.dirty]);

  const handleStartEdit = (e: Event, id: number): void => {
    const watermark = watermarkRefs.current[id];

    // @ts-ignore
    const stageBox = stageRef.current.getBoundingClientRect();
    const watermarkPosition = watermark.absolutePosition();

    setEditor(true);
    setEditorStyle({
      position: 'absolute',
      top: `${stageBox.top + watermarkPosition.y - (watermark.height() / 2)}px`,
      left: `${stageBox.left + watermarkPosition.x - (watermark.width() / 2)}px`,
      width: `${watermark.width() - watermark.padding() * 2}px`,
      height: `${watermark.height() - watermark.padding() * 2 + 5}px`,
      fontSize: `${watermark.fontSize()}px`,
      border: 'none',
      padding: '0px',
      margin: '0px',
      overflow: 'hidden',
      background: 'none',
      outline: 'none',
      resize: 'none',
      lineHeight: watermark.lineHeight(),
      fontFamily: watermark.fontFamily(),
      transformOrigin: 'left top',
      textAlign: watermark.align(),
      color: watermark.fill(),
      transform: `rotateZ(${watermark.rotation()}deg)`
    });

    setEditorText(watermark.text());
    // @ts-ignore
    inputRef.current.focus();
  }

  const handleDeleteWatermark = (id: number): void => {
    watermarkRefs.current = {};
    setWatermarks((currentWatermarks: any) => currentWatermarks.filter((p) => p.id !== id));

    const updRefs = watermarkRefs.current;
    delete updRefs[id];
    watermarkRefs.current = updRefs;

    //showSpinner();
    //const updWatermarks = watermarksSettings.filter((w: any) => w.id !== id);
    //dispatch(setWatermarksSettings(editedWatermarkPolicy, updWatermarks));
    //hideSpinner();
  }

  const handleAddWatermark = (e: React.SyntheticEvent): void => {
    const lastId = Math.max(0, ...watermarks.map((p) => p.id));
    const newMark = {
      ...watermarkSettingsFormInitialValues,
      id: lastId + 1,
    };
    setWatermarks((currentWatermarks) => {
      return currentWatermarks.concat(newMark);
    });
    selectShape(lastId + 1);
    formik.resetForm({ values: newMark , errors: {}, touched: {} });
  }

  const setWatermarkRef = (element: HTMLElement, id: number): void => {
    if (element) {
      watermarkRefs.current[id] = element;
    }
  };

  const toggleColorPicker = (): void => {
    setColorPicker((prev) => !prev);
  }

  const stageDimensions: StageDimensions = { width: 0, height: 0 };

  if (typeof stageRef.current !== 'undefined') {
    // @ts-ignore
    const stageBox = stageRef.current.getBoundingClientRect();
    stageDimensions.width = stageBox.width;
    stageDimensions.height = stageBox.height;
  }

  const updateMark = (value: any, parameter: any): void => {
    let paramType;


    const updWatermarks = watermarks.map((w: any) => {
      if (w.id !== selectedId) {
        return w;
      }

      paramType = typeof w[parameter];

      const newValue = paramType === 'number' ? Number(value) : value;
      return {
        ...w,
        [parameter]: newValue,
      };
    });
    formik.setFieldValue(parameter, paramType === 'number' ? Number(value) : value, true);
    setWatermarks(updWatermarks);
  }

  const updateRotationAngle = (value: string, parameter: string): void => {
    const parsedAngle = parseInt(value, 10);
    let newValue = parsedAngle;
    if (parsedAngle < 0) {
      newValue = 360 + parsedAngle; // for only positive values
    }
    updateMark(newValue % 360, parameter);
  };

  const updateOpacity = (value: string, parameter: string): void => {
    const parsedOpacity = parseInt(value, 10);
    let newValue = value.length > 0 ? (1 - parsedOpacity / 100) : '';
    updateMark(newValue, parameter);
  };

  const applyFallback = () => {
    const updWatermarks = [...watermarks.filter(w => w.id !== selectedId)];
    if (fallbackWatermark) {
      setWatermarks([...updWatermarks, fallbackWatermark]);
      setFallbackWatermark(null);
    } else {
      setWatermarks([...updWatermarks]);
    }
  }

const getWidthForOS = () => {
   if (navigator.appVersion.indexOf('Windows')>=0 || navigator.appVersion.indexOf('Sun')==0 || navigator.appVersion.indexOf('Edg')==0) return { width: '213px' };
   if (navigator.appVersion.indexOf('Linux')>=0) return { width: '219px' };
}

  const tableConfig: /*TableBodyConfig<"customText">*/any = {
    emptyInfo: () => null,
    showHeaderCheckbox: () => false,
    showItemCheckbox: (item: any) => false,
    showControls: (item: any) => true,
    canDrag: (item: any) => false,
    canDrop: (item: any) => false,
    fields: [
      {
        name: 'customText',
        header: 'Водяные знаки',
        style: { flex: '1 1 auto' },
        render: (item: any) => {
          if (typeof item.customText === 'string' && item.customText.trim().length > 0) {
            let codeIcon;
            if(item.type == 'STRING') {
              codeIcon = Textcode
            } else if(item.type == 'BARCODE') {
              codeIcon = Barcode
            } else {
              codeIcon = QRCode
            }

            return (
              <span style={{display: 'flex'}}>
                <img style={{marginRight: '10px'}} src={codeIcon} />
                {item.name}
              </span>
            );
          }
          return (
            <span style={{ color: 'darkgrey' }}>
              {`[watermark ${item.id}]`}
            </span>
          );
        }
      },
      {
        name: 'actions',
        header: '',
        render: (item: any) => {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <Icon
                icon="trash" 
                onClick={() => handleDeleteWatermark(item.id)}
              />
            </div>
          )
        },
        style: { flex: '0 0 32px', justifyContent: 'flex-end' }
      },
    ],
  }

  const validationSettings = () => !((formik.values.name.length > 0 && formik.values.customText.length > 1))

  const typeLabels = { QR: 'QR код', BARCODE: 'Штрихкод', STRING: 'Текст' };

  console.log('formik', formik)

  return (
    <>
      <div style={{ display: 'flex', width: '832px', paddingTop: '32px' }}>
        <div
          style={{
            flex: '1 0 400px',
            height: '616px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ width: '399px', height: '564px', border: '1px solid black', margin: '52px auto 0 auto' }}>
            <div ref={stageRef} style={{ width: '397px', height: '562px', background: '#fff' }}>
              {editorActive && (
                <input
                  ref={inputRef}
                  value={editorText}
                  style={editorStyle}
                  onKeyDown={handleInputConfirm}
                  onChange={(e) => setEditorText(e.target.value)}
                />
              )}
              <Stage
                width={397}
                height={562}
                onMouseDown={async (e) => {
                  const clickedOnEmpty = e.target === e.target.getStage();
                  if (clickedOnEmpty && selectedId) {
                    //const shouldRevert = formik.dirty ? /*await dialogs.run(t('modules.admin.policies.utils.allChangeWillBeLost'))*/confirm('yay or nay?') : true;
                    //if (shouldRevert) {
                      if (Object.keys(formik.errors).length > 0) {
                        const shouldRevert = formik.dirty ? confirm('Некорректные параметры метки не будут сохранены.') : true;
                        
                        if (shouldRevert) {
                          applyFallback();
                        } else {
                          return;
                        }
                      }
                      selectShape(null);
                      setColorPicker(false);
                      setEditor(false);
                      formik.resetForm();
                    //}
                  }
                }}
              >
                <Layer>
                  {/*<Konva.Image image={imageObj} />*/}
                  {watermarks.map((rect: any, i: any) => {
                    return (
                      <SingleWatermark
                        id={rect.id}
                        watermarkRefs={watermarkRefs}
                        isSelected={rect.id === selectedId}
                        setRef={setWatermarkRef}
                        key={i}
                        shapeProps={rect}
                        stageDimensions={stageDimensions}
                        onSelect={async () => {
                          //const shouldRevert = selectedId && formik.dirty ? /*await dialogs.run(t('modules.admin.policies.utils.allChangeWillBeLost'))*/confirm('yay or nay?') : true;
                          //if (shouldRevert) {
                            if (Object.keys(formik.errors).length > 0) {
                              const shouldRevert = formik.dirty ? confirm('Некорректные параметры метки не будут сохранены.') : true;
                              
                              if (shouldRevert) {
                                applyFallback();
                              } else {
                                return;
                              }
                            }
                            const initialState = watermarks.find(w => w.id === rect.id);
                            selectShape(rect.id);
                            setColorPicker(false);
                            formik.resetForm({ values: initialState , errors: {}, touched: {} });
                            setFallbackWatermark(initialState);
                          //}
                        }}
                        onChange={(updatedMark) => {
                          const updWatermarks = [...watermarks];
                          let newValue = updatedMark.rotationAngle;
                          if (updatedMark.rotationAngle < 0) {
                            newValue = 360 + updatedMark.rotationAngle;
                          }
                          updatedMark.rotationAngle = newValue % 360;
                          updWatermarks[i] = updatedMark;
                          formik.setValues(updatedMark);
                          setWatermarks(updWatermarks);
                        }}
                        handleStartEdit={handleStartEdit}
                        editorActive={editorActive}
                        //user={user}
                      />
                    );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>

        <div
          style={{
            flex: '1 0 400px',
            height: '616px',
            paddingLeft: '16px'
          }}
        >
          {selectedId ? (
            <>
              <ArrowBackIcon
                onClick={async () => {
                  //if (shouldRevert) {
                    //applyFallback();
                    if (Object.keys(formik.errors).length > 0) {
                      const shouldRevert = formik.dirty ? confirm('Некорректные параметры метки не будут сохранены.') : true;
                      
                      if (shouldRevert) {
                        applyFallback();
                      } else {
                        return;
                      }
                    }
                    selectShape(null);
                    setColorPicker(false);
                    setEditor(false);
                    formik.resetForm();
                  //}
                }}
                w={32}
                h={32}
                style={{
                  fill: '#30a3e6',
                  cursor: 'pointer',
                  marginBottom: '13px'
                }}
              />
              <form
                /*
                onSubmit={(e) => {
                  e.preventDefault();
                  formik.handleSubmit();
                  formik.resetForm();
                }}
                */
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                  <div>
                    <label htmlFor={name} className={styles['form-group-custom__input-row']}>
                      <div>
                        <span style={{ marginRight: '10px' }}>Тип метки</span>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <FormHintPopup position="right" message={formik.errors.type} />
                        <select
                          name="type"
                          className={styles.selector}
                          //disabled={spinner}
                          style={getWidthForOS()}
                          value={formik.values.type}
                          onChange={(e) => {
                            if (e.target.value === 'QR'/*&& formik.values.type === 'STRING'*/) {
                              const updWatermarks = watermarks.map((w: any) => {
                                if (w.id !== selectedId) {
                                  return w;
                                }
                                return {
                                  ...w,
                                  width: /*stageDimensions.width / 2*/50,
                                  height: /*stageDimensions.width / 2*/50,
                                  rotationAngle: 0,
                                  type: e.target.value
                                };
                              });
                              formik.setFieldValue('width', 50, true);
                              formik.setFieldValue('height', 50, true);
                              formik.setFieldValue('rotationAngle', 0, true);
                              formik.setFieldValue('type', e.target.value, true);
                              setWatermarks(updWatermarks);
                            } else if (e.target.value === 'BARCODE') {
                              const updWatermarks = watermarks.map((w: any) => {
                                if (w.id !== selectedId) {
                                  return w;
                                }
                                return {
                                  ...w,
                                  width: /*stageDimensions.width / 2*/50,
                                  height: /*stageDimensions.width / 2*/10,
                                  rotationAngle: 0,
                                  type: e.target.value
                                };
                              });
                              formik.setFieldValue('width', 50, true);
                              formik.setFieldValue('height', 10, true);
                              formik.setFieldValue('rotationAngle', 0, true);
                              formik.setFieldValue('type', e.target.value, true);
                              setWatermarks(updWatermarks);
                            } else if (e.target.value ==='STRING') {
                              const updWatermarks = watermarks.map((w: any) => {
                                if (w.id !== selectedId) {
                                  return w;
                                }
                                return {
                                  ...w,
                                  width: null,
                                  height: null,
                                  type: e.target.value
                                };
                              });
                              formik.setFieldValue('width', null, true);
                              formik.setFieldValue('height', null, true);
                              formik.setFieldValue('type', e.target.value, true);
                              setWatermarks(updWatermarks);
                            } else {
                              updateMark(e.target.value, 'type');
                            }
                          }}
                        >
                          {['STRING', 'QR', 'BARCODE'].map((v) => <option key={v} value={v}>{typeLabels[v]}</option>)}
                        </select>
                      </div>
                    </label>
                  </div>

                  <InputWithLabel
                    name="name"
                    label="Имя"
                    max={256}
                    onChange={(e) => updateMark(e, 'name')}
                    value={formik.values.name}
                    error={formik.errors.name}
                  />

                  {formik.values.hashTag ?
                    null :
                    <InputWithLabel
                      name="customText"
                      label="Сообщение"
                      max={256}
                      onChange={(e) => updateMark(e, 'customText')}
                      value={formik.values.customText}
                      error={formik.errors.customText}
                    />
                  }

                  <CheckboxWithLabel
                    name="hashTag"
                    label="Хэш метка"
                    onChange={(e) => {
                        updateMark(e, 'hashTag')
                        if(formik.values.hashTag){
                          formik.values.customText = ''
                        } else {
                          formik.values.customText = 'New watermark'
                        }
                      }
                    }
                    value={formik.values.hashTag}
                  />
                  <InputWithLabel
                    type="number"
                    name="horizontalPosition"
                    label="Горизонтальная позиция"
                    step={1}
                    min={0}
                    max={100}
                    onChange={(e) => updateMark(e, 'horizontalPosition')}
                    value={formik.values.horizontalPosition}
                    error={formik.errors.horizontalPosition}
                  />
                  <InputWithLabel
                    type="number"
                    name="verticalPosition"
                    label="Вертикальная позиция"
                    step={1}
                    min={0}
                    max={100}
                    onChange={(e) => updateMark(e, 'verticalPosition')}
                    value={formik.values.verticalPosition}
                    error={formik.errors.verticalPosition}
                  />
                  {formik.values.type === 'STRING' && (
                    <InputWithLabel
                      type="number"
                      name="rotationAngle"
                      label="Угол вращения"
                      step={1}
                      min={0}
                      max={359}
                      onChange={(e) => updateRotationAngle(e, 'rotationAngle')}
                      value={formik.values.rotationAngle}
                      error={formik.errors.rotationAngle}
                    />
                  )}
                  <InputWithLabel
                    type="number"
                    name="opacity"
                    label="Прозрачность"
                    step={1}
                    min={0}
                    max={100}
                    onChange={(e) => updateOpacity(e, 'opacity')}
                    value={formik.values.opacity === 0 ? '' : (100 - formik.values.opacity * 100).toFixed(0)}
                    error={formik.errors.opacity}
                  />
                  <div style={{ position: 'relative' }}>
                    <InputWithLabel
                      name="color"
                      label="Цвет"
                      style={{
                        color: formik.values.color,
                        width: '100px'
                      }}
                      readOnly
                      onClick={() => { toggleColorPicker() }}
                      value={formik.values.color}
                      error={formik.errors.color}
                    />
                    {colorPicker && (
                      <div className={styles.popup}>
                        <ChromePicker
                          disableAlpha
                          color={formik.values.color}
                          onChangeComplete={(color) => updateMark(color.hex, 'color')}
                        />
                      </div>
                    )}
                  </div>

                  <hr style={{ width: '100%' }} />

                  {(formik.values.type === 'QR' || formik.values.type === 'BARCODE') && (
                    <InputWithLabel
                      type="number"
                      name="width"
                      label="Ширина"
                      step={1}
                      min={0}
                      max={100}
                      onChange={(e) => {
                        const updWatermarks = watermarks.map((w: any) => {
                          if (w.id !== selectedId) {
                            return w;
                          }

                          const updatedMark = {
                            ...w,
                            width: Number(e),
                          };

                          if (formik.values.type === 'QR') {
                            updatedMark.height = Number(e)
                          }

                          return updatedMark;
                        });
                        formik.setFieldValue('width', Number(e), true);
                        setWatermarks(updWatermarks);
                      }}
                      value={formik.values.width}
                      error={formik.errors.width}
                    />
                  )}

                  {formik.values.type === 'BARCODE' && (
                    <InputWithLabel
                      type="number"
                      name="height"
                      label="Высота"
                      step={1}
                      min={0}
                      max={100}
                      onChange={(e) => updateMark(e, 'height')}
                      value={formik.values.height}
                      error={formik.errors.height}
                    />
                  )}

                  {formik.values.type === 'STRING' && (
                    <>
                      <InputWithLabel
                        type="number"
                        name="fontSize"
                        label="Размер шрифта"
                        min={1}
                        max={100}
                        step={1}
                        onChange={(e) => updateMark(e, 'fontSize')}
                        value={formik.values.fontSize}
                        error={formik.errors.fontSize}
                      />

                      <CheckboxWithLabel
                        name="horizontalRepeat"
                        label="Горизонтальный повтор"
                        onChange={(e) => updateMark(e, 'horizontalRepeat')}
                        value={formik.values.horizontalRepeat}
                      />
                      <CheckboxWithLabel
                        name="verticalRepeat"
                        label="Вертикальный повтор"
                        onChange={(e) => updateMark(e, 'verticalRepeat')}
                        value={formik.values.verticalRepeat}
                      />
                      <InputWithLabel
                        type="number"
                        name="verticalRepeatInterval"
                        label="Интервал повтора по вертикали(мм)"
                        step={1}
                        min={10}
                        max={100}
                        onChange={(e) => updateMark(e, 'verticalRepeatInterval')}
                        value={formik.values.verticalRepeatInterval}
                        error={formik.errors.verticalRepeatInterval}
                        disabled={formik.values.verticalRepeat === false}
                      />                     
                    </>
                  )}

                  <hr style={{ width: '100%' }} />

                  {/*
                  <CheckboxWithLabel
                    name="withDateOnWatermark"
                    label="withDateOnWatermark"
                    onChange={(e) => updateMark(e, 'withDateOnWatermark')}
                    value={formik.values.withDateOnWatermark}
                  />
                  <CheckboxWithLabel
                    name="withNameOnWatermark"
                    label="withNameOnWatermark"
                    onChange={(e) => updateMark(e, 'withNameOnWatermark')}
                    value={formik.values.withNameOnWatermark}
                  />
                  <CheckboxWithLabel
                    name="withEmailOnWatermark"
                    label="withEmailOnWatermark"
                    onChange={(e) => updateMark(e, 'withEmailOnWatermark')}
                    value={formik.values.withEmailOnWatermark}
                  />
                  <CheckboxWithLabel
                    name="withIpOnWatermark"
                    label="withIpOnWatermark"
                    onChange={(e) => updateMark(e, 'withIpOnWatermark')}
                    value={formik.values.withIpOnWatermark}
                  />
                  <CheckboxWithLabel
                    name="withLinkOnWatermark"
                    label="withLinkOnWatermark"
                    onChange={(e) => updateMark(e, 'withLinkOnWatermark')}
                    value={formik.values.withLinkOnWatermark}
                  />
                  */}
                </div>
                {/*
                <div
                  style={{
                    marginTop: '10px',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}
                >
                  <Button
                    type="submit"
                    color="primary"
                    label="submitButtonLabel"
                    disabled={!formik.dirty || !formik.isValid}
                  />
                </div>
                */}
              </form>
            </>
          ) : (
              <>
                <Button
                  onClick={handleAddWatermark}
                  color="secondary"
                  label="Добавить водяной знак"
                  override={{ marginBottom: '16px' }}
                />
                <UserFileFolderTable
                  config={tableConfig}
                  onRowClick={(item) => {
                    const initialState = watermarks.find(w => w.id === item.id);
                    selectShape(item.id);
                    formik.resetForm({ values: initialState , errors: {}, touched: {} });
                    setFallbackWatermark(initialState);
                  }}
                  //  FIXME add support other types by UserFileFolderTable
                  data={watermarks}
                />
              </>
            )}
          {/*<Spinner show={spinner} />*/}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '20px'
        }}
      >
        <Button
          label="Отмена"
          color="secondary"
          onClick={onClose}
        />
        <Button
          label="Сохранить"
          disabled={validationSettings()}
          color="primary"
          onClick={onSubmit}
        />
      </div>
    </>
  );
};

export default WatermarkSettingsForm;