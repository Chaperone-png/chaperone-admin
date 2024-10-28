import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CropModal from './CropModal';
import { RcFile, UploadChangeParam } from 'antd/es/upload/interface';

interface ImageUploaderProps {
  onImagesUpload: (images: RcFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload, }) => {
  const [croppingImage, setCroppingImage] = useState<RcFile | null>(null);
  const [cropVisible, setCropVisible] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  const handleUploadChange = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status !== 'removed') {
      setCroppingImage(file as RcFile);
      setCropVisible(true);
    }
  };

  const handleCropComplete = (croppedImage: string, file: RcFile) => {
    const newFileList = [...fileList, file];
    setFileList(newFileList);
    onImagesUpload(newFileList);
    setCropVisible(false);
  };

  const handleCropCancel = () => {
    setCroppingImage(null);
    setCropVisible(false);
  };

  return (
    <div>
      <Upload
        multiple
        fileList={fileList}
        onChange={handleUploadChange}
        beforeUpload={() => false}
        accept="image/*"
        onRemove={(file) => {
          const newFileList = fileList.filter((f) => f.uid !== file.uid);
          setFileList(newFileList);
          onImagesUpload(newFileList);
          setCroppingImage(null);
        }}
      >
        <Button icon={<UploadOutlined />}>Select Images</Button>
      </Upload>

      {croppingImage && cropVisible && (
        <CropModal
          visible={cropVisible}
          image={croppingImage ? URL.createObjectURL(croppingImage) : ''}
          onCancel={handleCropCancel}
          onCropComplete={(croppedImage) => handleCropComplete(croppedImage, croppingImage)}
        />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {fileList.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`Cropped ${index}`}
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
