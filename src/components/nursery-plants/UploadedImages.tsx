import { DeleteOutlined } from '@ant-design/icons';
import { Col, Image, Row } from 'antd';
import React, { useEffect, useState } from 'react'
interface Image {
  url: string;
  _id: string;
  potType: string;
  color: string;
  containerType: string;

}
interface Props {
  images: Image[];
  containerType: 'bag' | 'pot' | 'planter'
}
const UploadedImages = (props: Props) => {
  const { images, containerType } = props;
  const [mappedImages, setMappedImages] = useState<any[]>([]);
  useEffect(() => {
    if (containerType === 'planter' || containerType === 'pot') {
      const filteredImages = images.filter((image) =>
        image.containerType === containerType
      );

      const changedImages = groupImagesByPotTypeAndColor(filteredImages);
      setMappedImages(changedImages)
    }
  }, [containerType, images])
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
  console.log(mappedImages, 'Mapped Images')
  console.log(images, 'Images')
  return (
    <div>
      <p>Uploaded Images</p>
      <Row>
      {images.map((image)=>{
        return <Col style={{padding: '10px'}} lg={8} md={12}>
          {image.color ? <h4>Color: {image.color}</h4> : ''}
          <div><img src={image.url} width={'300px'}/></div>
        </Col>
      })}
      </Row>
      {/* {containerType === 'bag' && images.map((image) => {
        return <><Image
        width={200}
        src={image.url}
      />
          <DeleteOutlined />
        </>
      })}
      {containerType !== 'bag' && <>

        {mappedImages.map((imageDetail) => {
          return <>
            <p>
              Color: {imageDetail.color}
            </p>
            {imageDetail.images.map((image: string) =>
              <>
                <Image
                  width={200}
                  src={image}
                />
                <DeleteOutlined />
              </>
            )}
          </>
        })}
      </>} */}
    </div>
  )
}

export default UploadedImages