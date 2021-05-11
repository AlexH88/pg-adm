 import React from 'react';
 import { Editor } from '@tinymce/tinymce-react';

interface IOwnProps {
  field: any;
}

 class HtmlEditor extends React.PureComponent<IOwnProps , {}>  {

   handleEditorChange = (content, editor) => {
//     console.log('Content was updated:', content);
  	 const { field } = this.props;
  	 field.onChange(content);
   }

   render() {
   	const { field } = this.props

     return (
       <Editor
         initialValue={field.value}
         init={{
           height: 500,
           menubar: true,
           language: 'ru',
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code wordcount'
           ],
           toolbar:
             'undo redo | formatselect | bold italic backcolor | \
             alignleft aligncenter alignright alignjustify | \
             bullist numlist outdent indent | removeformat | code',
//           table_toolbar: "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
             table_toolbar: "tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol"
         }}
         onEditorChange={this.handleEditorChange}
       />
     );
   }

 }


 export default HtmlEditor;