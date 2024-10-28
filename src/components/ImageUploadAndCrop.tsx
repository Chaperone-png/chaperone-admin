// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Upload, Modal, Button } from "antd";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploadAndCropProps {
  onChange: (imageUrl: string) => void;
}

const ImageUploadAndCrop: React.FC<ImageUploadAndCropProps> = ({ onChange }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [crop, setCrop] = useState<Crop>({ x: 0, y: 0, width: 50, height: 50 });

  useEffect(() => {
    if (previewImage) {
      setCrop((prevCrop) => ({
        ...prevCrop,
        aspect: prevCrop.aspect || 1,
      }));
    }
  }, [previewImage]);

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  const handleCropChange = (newCrop: Crop) => {
    setCrop(newCrop);
  };

  const handleCropComplete = (crop: Crop, pixelCrop: Crop) => {
    if (!previewImage || !pixelCrop) return;
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = previewImage;
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        onChange(imageUrl);
        setPreviewVisible(false); // Close modal after cropping
      }
    });
  };

  const uploadButton = (
    <div>
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <>
      <Upload
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={({ fileList }) => setFileList(fileList)}
        beforeUpload={() => false}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
  open={previewVisible}
  title="Crop Image"
  onCancel={handleCancel}
  footer={[
    <Button key="back" onClick={handleCancel}>
      Cancel
    </Button>,
  ]}
  destroyOnClose
>
  {previewImage && (
    <ReactCrop
      src={previewImage}
      crop={crop}
      onChange={handleCropChange}
      onComplete={handleCropComplete}
      style={{ maxWidth: "100%", maxHeight: "80vh" }} // Adjust dimensions as needed
    />
  )}
</Modal>
    </>
  );
};

const getBase64 = (file: File): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default ImageUploadAndCrop;
