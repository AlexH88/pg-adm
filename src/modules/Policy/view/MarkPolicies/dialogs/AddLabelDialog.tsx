import * as React from 'react';
import './style.styl';
import {Button, RadioGroup} from 'shared/view/elements';
import {bind} from 'decko';
import {block} from 'bem-cn';
import Dropdown from 'react-toolbox/lib/dropdown';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import * as circularTheme from './circularTheme.styl';

interface IOwnProps {
    onAddNewLabel(val: ILabel): void;
    allTextLabels: any[];
    showSpinner: boolean;
}

interface ILabel {
    dx: number;
    dy: number;
    w: number;
    h: number;
    angle: number;
    font_size: number | null;
    type: any; //'image' | 'text' | 'barcode';
    text?: { id: number; label: string; data: string } | null;
    image_data?: string | null;
    opacity: number; 
    barcode_style: any; // 0 | 1;    
    barcode_format: any; // IBarcodeFormat;  
    encrypted: boolean;
}

interface IState {
    labelToAdd: ILabel | any;
    errorMessage: any;      
}

const b = block('add-label-dialog');

const barcodeNumberCodes: any = {
    0: {
        'Code39' : 1,
        'EAN-13' : 2,
        'Code128': 3,
        'PostNet': 4,
        'Interleaved': 5,
    },
    1: {
        'Numeric': 1,
        'Alphanumeric': 2,
        'ISO-8859-1': 3,
        'UTF-8 with BOM': 4,
        'UTF-8 without BOM': 5,
    }
};

// type IBarcodeFormat = 'Code39' | 'EAN-13' | 'Code128' | 'PostNet' | 'Interleaved' | 'Auto'
// | 'Numeric' | 'Alphanumeric' | 'ISO-8859-1' | 'UTF-8 with BOM' | 'UTF-8 without BOM';

class AddLabelDialog extends React.Component<IOwnProps, IState> {

    state = {
        labelToAdd: {
            X: 0,
            Y: 0,
            W: 100,
            H: 100,
            x: 0,
            y: 0,
            // w: 10,
            // h: 10,
            angle: 0,
            type: 'barcode',
            text: null,
            font_size: 16,
            image_data: null,
            opacity: 0.8,
            barcode_style: '0', // legacy
            barcode_format: '39',
            encrypted: false,
        },
        errorMessage: null,        
    }

    render() {
        const { labelToAdd } = this.state;
        const { allTextLabels, showSpinner } = this.props;

        return (
            <div className={b()}>
                {
                    showSpinner ?
                    <ProgressBar theme={circularTheme} type="circular" mode="indeterminate" />
                    :
                    <div>
                        <div>
                        <RadioGroup
                            name="labelType"
                            value={labelToAdd.type}
                            onChange={(value: any) => { 
                            const { labelToAdd } = this.state;
                                this.setState({
                                    ...this.state,
                                    labelToAdd: {
                                        ...labelToAdd,
                                        type: value
                                    },
                                    errorMessage: null
                                });
                            }}
                            values={[
                                { value: 'barcode', label: 'Штрихкод' },
                                { value: 'image', label: 'Изображение' },
                                { value: 'text', label: 'Текст' },
                            ]}
                        />
                    </div>
                    <div>
                        {
                            labelToAdd.type !== 'image' ?
                            <Dropdown
                                style={{outline: 'none'}}
                                required
                                label="Выбрать текст"
                                value={labelToAdd.text ? (labelToAdd.text as any) : null}
                                onChange={(value: any) => { 
                                    const { labelToAdd } = this.state;
                                    this.setState({
                                        ...this.state,
                                        labelToAdd: {
                                            ...labelToAdd,
                                            text: value
                                        }
                                    })
                                }}
                                source={allTextLabels.map(item => ({ id: item.id, label: item.name, value: item.name }) )}
                            />
                            :
                            <div>
                                <FileInput onFileChange={this.onSetFile} />
                                {this.state.labelToAdd.image_data ? (this.state.labelToAdd.image_data as any).name : null}    
                                <br />                            
                                <br />                            
                            </div>
                        }
                        <div style={{display: 'table', width: '100%', marginBottom: '10px'}}>
                        {/* {
                            labelToAdd.type === 'barcode' ?
                            <div style={{display: 'table-cell', verticalAlign: 'top'}}>
                                <div style={{padding: '5px'}}>Тип штрихкода</div>
                                <RadioGroup
                                    name="barcodeStyle"
                                    value={String(labelToAdd.barcode_style)}
                                    onChange={(value: any) => { 
                                    const { labelToAdd } = this.state;
                                    const newFormat: any = value === '0' ? 'Code39' : 'Numeric'; 
                                        this.setState({
                                            ...this.state,
                                            labelToAdd: {
                                                ...labelToAdd,
                                                barcode_style: value,
                                                barcode_format: newFormat,
                                            }
                                        });
                                    }}
                                    values={[
                                        { value: '0', label: 'Штрихкод' },
                                        { value: '1', label: 'QRCode' },
                                    ]}
                                />
                            </div>
                            :
                            null
                        } */}
                        {
                            labelToAdd.type === 'barcode' ? //  && labelToAdd.barcode_style === '0'
                            <div style={{display: 'table-cell', verticalAlign: 'top'}}>
                                <div style={{padding: '5px'}}>Формат штрихкода</div>                                
                                <RadioGroup
                                    name="barcodeFormat"
                                    value={labelToAdd.barcode_format}
                                    onChange={(value: any) => { 
                                    const { labelToAdd } = this.state;
                                        this.setState({
                                            ...this.state,
                                            labelToAdd: {
                                                ...labelToAdd,
                                                barcode_format: value
                                            }
                                        });
                                    }}
                                    values={[
                                        { value: '39', label: 'Code39' },
                                        { value: 'EAN', label: 'EAN-13' },
                                        { value: '128', label: 'Code128' },
                                        { value: 'PostNet', label: 'PostNet' },
                                        { value: 'QRCode', label: 'QRCode' },
                                    ]}
                                />
                            </div>
                            :
                            // : labelToAdd.type === 'barcode' &&  labelToAdd.barcode_style === '1' ?
                            // <div style={{display: 'table-cell', verticalAlign: 'top'}}>
                            //     <div style={{padding: '5px'}}>Формат QR-кода</div>  
                            //     <RadioGroup
                            //         name="QRCodeFormat"
                            //         value={labelToAdd.barcode_format}
                            //         onChange={(value: any) => { 
                            //         const { labelToAdd } = this.state;
                            //             this.setState({
                            //                 ...this.state,
                            //                 labelToAdd: {
                            //                     ...labelToAdd,
                            //                     barcode_format: value
                            //                 }
                            //             });
                            //         }}
                            //         values={[
                            //             { value: 'Numeric', label: 'Numeric' },
                            //             { value: 'Alphanumeric', label: 'Alphanumeric' },
                            //             { value: 'ISO-8859-1', label: 'ISO-8859-1' },
                            //             { value: 'UTF-8 with BOM', label: 'UTF-8 with BOM' },
                            //             { value: 'UTF-8 without BOM', label: 'UTF-8 without BOM' },
                            //         ]}
                            //     />
                            // </div>
                            // :
                            null
                        }
                        </div>
                    </div>
                </div>
                }
                <div style={{color: 'red', padding: '5px 10px 15px 15px', height: '30px'}}>
                    {this.state.errorMessage}
                </div>
                <div className={b('btn-box')} >
                    <Button
                        disabled={showSpinner}
                        isPrimary
                        onClick={this.onAddNewLabel}
                        label="Добавить"
                    />
                </div>
          </div>
        )
    }

    @bind
    onValidate() {
        const { labelToAdd } = this.state;
        let errorMessage = null;
        if(labelToAdd.type === 'barcode') {
            if(!labelToAdd.barcode_format || !labelToAdd.barcode_style || !labelToAdd.text) {
                errorMessage = 'Не выбран текст метки';                
                this.setState({
                    ...this.state,
                    errorMessage
                })
                return false;
            }
        } 

        if(labelToAdd.type === 'image') {
            if(!labelToAdd.image_data) {
                errorMessage = 'Не выбрано изображение';
                this.setState({
                    ...this.state,
                    errorMessage
                })
                return false;
            }   
        } 

        if(labelToAdd.type === 'text') {
            if(!labelToAdd.text) {
                errorMessage = 'Не выбран текст метки';
                this.setState({
                    ...this.state,
                    errorMessage
                })
                return false;
            }    
        } 

        return true;
    }

    @bind
    onAddNewLabel() {
        const { onAddNewLabel, allTextLabels } = this.props;
        const { labelToAdd } = this.state as any;

        if( !this.onValidate() ) return; 
        labelToAdd.text = allTextLabels.filter(item => item.name === labelToAdd.text)[0];
        // labelToAdd.barcode_format = barcodeNumberCodes[labelToAdd.barcode_style][labelToAdd.barcode_format];
        labelToAdd.barcode_style = Number(labelToAdd.barcode_style);

        if(labelToAdd.type === 'barcode') {
            labelToAdd.opacity = 1;
        }

        if(labelToAdd.type === 'text') {
            labelToAdd.angle = 0;
        }

        console.log(labelToAdd);
        onAddNewLabel(labelToAdd);
    }

    @bind
    onSetFile(event: any) {
        const { labelToAdd } = this.state;
        const file = (event.target as any).files[0];

        if (file.type !== 'image/png') {
            this.setState({
                ...this.state,
                errorMessage: 'Необходимо выбрать файл .png',
            });
        } else {
            this.setState({
                ...this.state,
                labelToAdd: {
                    ...labelToAdd,
                    image_data: file,
                },
                errorMessage: null
            });
        }

    }

}

export { AddLabelDialog };

const b2 = block('file-input');

function FileInput(props: any) {
    return (
        <div className={b2()}>
            <label>
                <div>Выберите файл .png</div>
                <input hidden onChange={props.onFileChange} type="file" />
            </label>
        </div>
    )
}