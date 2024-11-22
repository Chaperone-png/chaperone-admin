import { DeleteOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useLoader } from '../../context/LoaderContext';
import { PlantAndPlanterPotApi } from '../../services/apis/Plant&PlanterPotApi';

interface Image {
  url: string;
  _id: string;
  potType: string;
  color: string;
  containerType: string;
}

interface Props {
  images: Image[];
  containerType: 'bag' | 'pot' | 'planter';
  productType: any;
  id: string;
  setSavedImages: (images: Image[]) => void;
}

const UploadedImages = (props: Props) => {
  const { images, containerType, productType, id, setSavedImages } = props;
  const [mappedImages, setMappedImages] = useState<any[]>([]);

  const { startLoader, stopLoader } = useLoader();

  useEffect(() => {
    if (containerType === 'planter' || containerType === 'pot') {
      const filteredImages = images.filter(
        (image) => image.containerType === containerType
      );
      const changedImages = groupImagesByPotTypeAndColor(filteredImages);
      setMappedImages(changedImages);
    }
  }, [containerType, images]);

  const groupImagesByPotTypeAndColor = (imagesArray: Image[]) => {
    const groupedImages = imagesArray.reduce((acc: any, curr) => {
      if (curr.potType && curr.color) {
        const key: any = `${curr.potType}-${curr.color}`;
        if (!acc[key]) {
          acc[key] = { potType: curr.potType, color: curr.color, images: [] };
        }
        acc[key].images.push(curr.url);
      }
      return acc;
    }, {});

    return Object.values(groupedImages);
  };


  const RemoveImage = async (imageId: string) => {
    try {
      startLoader();
      const payload = {
        imageId,
        productType
      }
      const response = await PlantAndPlanterPotApi.deleteImage(id, payload);

      if (response?.data?.success) {
        setSavedImages(response.data.images)
        toast.success("Image removed successfully");
      }
      else {
        toast.error("Error removing image");
      }
    }
    catch (err: any) {
      toast.error("Error removing image");
    }
    finally {
      stopLoader();
    }
  };

  return (
    <div>
      <p>Uploaded Images</p>
      <Row gutter={[16, 16]}>
        {images.map((image) => (
          <Col key={image._id} lg={8} md={12} style={{ padding: '10px' }}>
            {image.color ? <h4>Color: {image.color}</h4> : ''}
            <div style={{ position: 'relative', width: '300px' }}>
              {/* Image with Delete icon overlay */}
              <img src={image.url} alt="Uploaded" style={{ width: '100%' }} />
              <DeleteOutlined
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  fontSize: '18px',
                  color: 'red',
                  cursor: 'pointer',
                  zIndex: 1,  // Ensures the icon is above the image
                  backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: Adds a background to make icon stand out
                  borderRadius: '50%', // Makes the icon circular
                  padding: '4px',
                }}
                onClick={() => RemoveImage(image._id)}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UploadedImages;
