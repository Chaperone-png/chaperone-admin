import { Col, Form, Row } from 'antd';
import 'react-quill/dist/quill.snow.css';

import ReactQuill from 'react-quill';
interface Props {
    about:any;
    setAbout:any;
    label:string;
  name: string;
  required?: boolean;
}
const PlantAbout = ({ about,setAbout, label, name, required}:Props) => {

  return (
    <Row gutter={16}>
    <Col xs={24}>
      <Form.Item
        label={label}
          name={name}
        rules={[
          { required, message: required ? "Please enter the description" : '', }
          , {max:1000, message:'Maximum 1000 characters allowed'}]}
      >
        <ReactQuill

          style={{ height: '200px', marginBottom: '80px' }} // 
          value={about}
          onChange={setAbout}
          modules={{
            toolbar: [
              [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' },
              { 'indent': '-1' }, { 'indent': '+1' }],
            ],
          }}
          formats={[
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 
          ]}
        />
      </Form.Item>
    </Col>
  </Row>
  )
}

export default PlantAbout