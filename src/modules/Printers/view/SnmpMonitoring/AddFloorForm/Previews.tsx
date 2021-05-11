
import React, { ReactElement, useEffect, useState, FC } from 'react';
import {useDropzone} from 'react-dropzone';

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};
  
const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

interface IPictureProps {
  onChange?: any;
    // onChange?(e: React.FormEvent<HTMLInputElement>): void;
    // error?: boolean | string;
    // onBlur?(event: React.FormEvent<HTMLFormElement> | string): void;
    // value?: any;
  }
  
  
  
  const Previews: FC<IPictureProps> = (props: IPictureProps): ReactElement<HTMLDivElement> => {
    const [files, setFiles] = useState([]);
    const { onChange } = props;

    const {getRootProps, getInputProps} = useDropzone({
      accept: 'image/*',
      onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
        onChange(acceptedFiles);
      },      
      

    });
    // const { onChange, error, onBlur, value } = props;
    const thumbs = files.map(file => (
      <div 
        style={{display: 'flex',
                justifyContent: 'center',
                borderRadius: 2,
                border: '1px solid #eaeaea',
                width: 400,
                height: 400,
                padding: 4,
                backgroundColor: "#fff",
                boxSizing: 'border-box'
                }} 
        key={file.name}
      >
       <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ));
  
  
    const picture =  <>
        <p style={{paddingTop: 15, color: '#a3a3a8'}}>Переместите сюда изображение или кликните для выбора файла</p>
        <svg
          fill="#d8d8d8"
          version="1.1"
          width="300"
          height="300"
          viewBox="0 0 32 32"
        >
        <path
        d="m 11.941583,4.27752 c -3.457691,0 -6.2621352,2.68896 -6.5509831,6.10113 -3.0958634,0.59019 -5.39061185,3.25637 -5.39061185,6.4641 0,3.65051 2.97576725,6.62821 6.62628205,6.62821 h 6.6166279 v -0.01 c 0,0 0.0019,0 0.0019,0 0.372827,0 0.664173,-0.31791 0.664173,-0.68348 0,-0.36558 -0.291346,-0.68541 -0.664173,-0.68541 -0.0062,0 -0.0112,0.004 -0.01738,0.004 H 6.6282009 c -2.9009335,0 -5.2554603,-2.35324 -5.2554603,-5.25352 0,-2.70425 2.0176822,-4.9428 4.7032702,-5.22264 l 0.023169,-0.004 0.5888741,-0.13708 v -0.57536 c 0,-2.9003 2.3532361,-5.25354 5.2535291,-5.25354 1.988817,0 3.777762,1.10092 4.682032,2.88067 l 0.258719,0.50585 0.544467,-0.15832 c 0.485111,-0.14071 0.976873,-0.21045 1.463497,-0.21045 1.908514,0 3.670028,1.03878 4.59708,2.71268 l 0.247134,0.446 0.50006,-0.10812 c 3.382945,-0.74653 6.394594,1.85303 6.394594,5.12417 0,2.8996 -2.352652,5.25546 -5.253529,5.25546 h -6.603114 c -0.0096,-4.2e-4 -0.01737,-0.006 -0.02703,-0.006 -0.0097,0 -0.01748,0.005 -0.02703,0.006 h -0.0077 v 0.002 c -0.354896,0.0203 -0.629419,0.32431 -0.629419,0.67769 0,0.35336 0.274523,0.65553 0.629419,0.67575 v 0.0174 h 6.662967 c 3.650514,0 6.626282,-2.9777 6.626282,-6.62821 0,-2.00762 -0.792175,-3.7539 -2.174008,-4.9311 -1.337836,-1.13971 -3.230901,-1.7073 -5.425364,-1.56776 -1.501799,-2.11655 -3.291934,-3.04862 -5.512249,-3.04862 -0.45977,0 -0.918616,0.0723 -1.374683,0.1699 C 16.309589,5.52104 14.253087,4.27727 11.941607,4.27727 Z m 5.348135,3.81707 0.0058,0.0116 c -0.0077,0.002 -0.0155,0.002 -0.02317,0.004 -0.0018,-0.003 -0.0059,-0.004 -0.0077,-0.008 z M 5.9099675,10.84975 c -2.61e-5,0.003 -0.00191,0.005 -0.00193,0.008 -0.00355,4.2e-4 -0.0061,0.003 -0.00965,0.004 v -0.01 z m 18.2299985,0.0792 0.0097,0.0193 c -0.0067,9.8e-4 -0.0126,-0.003 -0.01931,-0.002 -0.0028,-0.005 -0.0088,-0.007 -0.01158,-0.0116 z m -8.139978,1.27428 -5.867503,5.86751 0.02124,0.0212 c -0.103812,0.12046 -0.173763,0.27083 -0.173766,0.44021 -4e-6,0.37462 0.308863,0.68541 0.683481,0.68541 0.169638,0 0.321607,-0.0692 0.442138,-0.17377 l 0.0077,0.008 4.193556,-4.19354 v 12.2061 h 0.0097 c 0.01455,0.36512 0.321234,0.65838 0.687341,0.65838 0.366109,0 0.670943,-0.29326 0.685412,-0.65838 h 0.0058 v -0.0251 -12.181 l 4.191625,4.19354 0.0251,-0.0251 c 0.114344,0.0851 0.248024,0.14481 0.399662,0.14481 0.374612,0 0.683475,-0.30887 0.68348,-0.68349 2e-6,-0.15107 -0.06029,-0.28361 -0.144805,-0.39773 l 0.01931,-0.0193 z"
        />
        </svg> 
      </>
  
    useEffect(() => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
  
    return (
      <section style={{
        backgroundColor: "#eeeef4",
        borderRadius: 5,
        border: "4px dashed #d8d8d8",
        width: 550,
        height: "auto",
        cursor: "pointer",
        marginTop: 20,
        marginBottom: 10
      }}>
        <div {...getRootProps({className: 'dropzone'})} style={{outline: "none"}}>
          <input {...getInputProps({onChange: onChange})} />
          {/* onBlur: (e: any) => {onBlur(e.target.value)} */}
            <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: "center",
            flexWrap: 'wrap',
            height: 450,
          }}>
            {files.length === 0 ? picture : thumbs }      
          </div>
        </div>
      </section>
    );
  }


  export default Previews;