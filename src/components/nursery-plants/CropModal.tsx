import React, { useState } from 'react';
import { Modal, Slider } from 'antd';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

interface CropModalProps {
  visible: boolean;
  image: string;
  onCancel: () => void;
  onCropComplete: (croppedImage: string) => void;
}

const CropModal: React.FC<CropModalProps> = ({ visible, image, onCancel, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropCompleteCallback = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    if (!croppedAreaPixels) return;

    const imageElement = new Image();
    imageElement.src = image;
    await new Promise((resolve) => {
      imageElement.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
      imageElement,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    onCropComplete(canvas.toDataURL('image/jpeg'));
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={getCroppedImage}
      title="Crop Image"
      okText="Crop"
    >
      <div style={{ position: 'relative', width: '100%', height: 400 }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropCompleteCallback}
        />
      </div>
      <Slider
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={onZoomChange}
        style={{ marginTop: 20 }}
      />
    </Modal>
  );
};

export default CropModal;
