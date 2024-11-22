//ImageUploader file
import React, { useEffect, useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CropModal from './CropModal';
import { RcFile, UploadChangeParam } from 'antd/es/upload/interface';
import { toast } from 'react-toastify';
import { plantApi } from '../../services/apis/plantApi';
import { useLoader } from '../../context/LoaderContext';

interface ImageUploaderProps {
  onImagesUpload: (images: RcFile[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUpload }) => {
  const [croppingImage, setCroppingImage] = useState<RcFile | null>(null);
  const [cropVisible, setCropVisible] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const { startLoader, stopLoader } = useLoader();

  const handleUploadChange = (info: UploadChangeParam) => {
    const { file } = info;
    if (file.status !== 'removed') {
      setCroppingImage(file as RcFile);

      setCropVisible(true);
    }

  };

  const handleCropComplete = async (croppedImage: string, file: RcFile) => {
    const formData = new FormData();
    try {
      startLoader();
      if (file) {
        formData.append('file', file as RcFile);
      }

      const response = await plantApi.uploadImageToS3(formData);
      if (response?.data?.success) {
        toast.success("Image uploaded successfully");
        setFileList((prevFileList) => [...prevFileList, { awsUrl: response.data.url, file }]);
        onImagesUpload([...fileList, { awsUrl: response.data.url, file }]);
        setCropVisible(false);
      } else {
        toast.error("Error uploading image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image");
    }
    finally {
      stopLoader();
    }

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
          onCropComplete={(croppedImage) =>
            handleCropComplete(croppedImage, croppingImage)
          }
        />
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 20 }}>
        {fileList.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file.file)}
            alt={`Cropped ${index}`}
            style={{ width: 100, height: 100, marginRight: 10 }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;
