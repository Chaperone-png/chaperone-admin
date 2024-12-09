import React from "react";
import { Form, Upload, UploadFile, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

interface UploadDocumentsProps {
  aadharImage: UploadFile | null;
  panImage: UploadFile | null;
  dlImage: UploadFile | null;
  voterIdImage: UploadFile | null;
  onUploadChange: (file: UploadFile | null, docType: string) => void;
}

const UploadDocumentsForm: React.FC<UploadDocumentsProps> = ({
  aadharImage,
  panImage,
  dlImage,
  voterIdImage,
  onUploadChange,
}) => {
  const uploadProps = (docType: string) => ({
    onRemove: (file: UploadFile) => onUploadChange(null, docType),
    beforeUpload: (file: UploadFile) => {
      const isValidType = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ].includes(file.type || "");
      if (!isValidType) {
        message.error(
          `${file.name} is not a valid image format. Please upload a JPG, PNG, GIF, or WebP file.`
        );
        return Upload.LIST_IGNORE; // Prevent adding the file to the list
      }
      onUploadChange(file, docType);
      return false; // Prevent automatic upload
    },
    fileList: (() => {
      switch (docType) {
        case "aadhar":
          return aadharImage ? [aadharImage] : [];
        case "pan":
          return panImage ? [panImage] : [];
        case "dl":
          return dlImage ? [dlImage] : [];
        case "voter":
          return voterIdImage ? [voterIdImage] : [];
        default:
          return [];
      }
    })(),
    accept: ".jpg,.jpeg,.png,.gif,.webp", // Restrict file picker to specific formats
  });

  return (
    <Form layout="vertical">
      <Form.Item label="Aadhar Card">
        <Upload.Dragger {...uploadProps("aadhar")}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Only JPG, PNG, GIF, or WebP files are allowed
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label="PAN Card">
        <Upload.Dragger {...uploadProps("pan")}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Only JPG, PNG, GIF, or WebP files are allowed
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label="Driving License">
        <Upload.Dragger {...uploadProps("dl")}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Only JPG, PNG, GIF, or WebP files are allowed
          </p>
        </Upload.Dragger>
      </Form.Item>
      <Form.Item label="Voter ID Card">
        <Upload.Dragger {...uploadProps("voter")}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Only JPG, PNG, GIF, or WebP files are allowed
          </p>
        </Upload.Dragger>
      </Form.Item>
    </Form>
  );
};

export default UploadDocumentsForm;
