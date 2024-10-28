import { Button, message } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useCallback, useEffect, useState } from 'react';
import { nurseryPlantApi } from '../../services/apis/nurseryPlantApi';
import { AdminPlantTye } from '../../types';
import ImageUploader from './ImageUploader';
import UploadedImages from './UploadedImages';
import { useNavigate } from 'react-router-dom';
import { potPlanterApi } from '../../services/apis/potPlanterApi';

interface Props {
    createdPlantData: AdminPlantTye;
    nurseryId: any;
    plantId: any;
    productType?: 'Pot/Planter' | 'Plant'
}

interface UploadedImage {
    plant: string;
    color: string;
    images: any[];
}

const UploadPlantImages = (props: Props) => {
    const [colors, setColors] = useState<any[]>([]);
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [isSaving, setIsSaving] = useState(false)
    const { createdPlantData, nurseryId, plantId, productType } = props;
    const navigate = useNavigate();
    const [savedImages, setSavedImages] = useState<{
        url: string;
        _id: string;
        potType: string;
        color: string;
        containerType: string;
    }[]>([])
    useEffect(() => {
        if (createdPlantData.containerType === 'pot' || createdPlantData.containerType === 'planter' || productType === 'Pot/Planter') {
            const allColors = createdPlantData.availableSizes.flatMap(size => size.detail.colors);
            // Step 2: Remove duplicates using a Set
            const uniqueColors = Array.from(new Set(allColors));
            setColors(uniqueColors)
        } else {
            setColors([]);
        }
    }, [createdPlantData]);
    useEffect(() => {
        console.log(createdPlantData, 'createdPlantData')
        if (createdPlantData.images) {
            setSavedImages(createdPlantData.images)
        }
    }, [createdPlantData])
    const handleImageUpload = useCallback((images: any[], plant: string, color: string) => {
        setUploadedImages(prevState => {
            const existingIndex = prevState.findIndex(item => item.color === color);
            if (existingIndex !== -1) {
                const updatedState = [...prevState];
                updatedState[existingIndex].images = images;
                return updatedState;
            } else {
                return [...prevState, { plant, color, images }];
            }
        });
    }, []);

    const handleSaveImages = async (potType?: string, color?: string) => {
        const formData = new FormData();
        console.log(uploadedImages, 'uploadedImagesuploadedImages')
        setIsSaving(true)
        if (createdPlantData.containerType === 'bag') {
            // Handle save for bag type
            const bagImages = uploadedImages.find(item => item.plant === 'bag');
            if (bagImages) {
                formData.append('containerType', createdPlantData.containerType);
                bagImages.images.forEach(image => {
                    formData.append('images', image);
                });
            }
        } else {
            // Handle save for pot or planter type
            const specificImages = uploadedImages.find(item => item.color === color);
            if (specificImages) {
                formData.append('color', specificImages.color);
                formData.append('containerType', createdPlantData.containerType);

                specificImages.images.forEach(image => {
                    formData.append('images', image);
                });
            }
        }

        try {
            let response;
            if (productType === 'Pot/Planter') {
                response = await potPlanterApi.updateNurseryImages(nurseryId, plantId, formData);

            } else {
                response = await nurseryPlantApi.updateNurseryImages(nurseryId, plantId, formData);

            }
            console.log(response, 'RESPONSE');
            if (response.data.images) {
                setSavedImages(response.data.images)
            }
            setUploadedImages([]);
            message.success('Plant details saved successfully!')
            navigate('/products')
        } catch (error: any) {
            message.error('Something went wrong!')
            console.log(error, 'ERROR');
        } finally {
            setIsSaving(false)
        }
    };

    return (
        <div>
            {createdPlantData?.containerType === 'bag' &&
                <>
                    <ImageUploader onImagesUpload={images => handleImageUpload(images, 'bag', '')}
                    />
                    <Button type='primary' onClick={() => handleSaveImages()}>{isSaving ? 'Saving Images' : 'Save'}</Button>
                </>
            }
            {(createdPlantData?.containerType === 'pot' || createdPlantData.containerType === 'planter' || productType === 'Pot/Planter') &&
                <>
                    {colors.map((item, index) => (
                        <div key={index}>
                            Color: {item.colorName}
                            <ImageUploader
                                onImagesUpload={images => handleImageUpload(images, item.plant, item.colorName)}
                            />
                            <Button type='primary' onClick={() => handleSaveImages(item.plant, item.colorName)}>{isSaving ? 'Saving Images' : 'Save'}</Button>
                        </div>
                    ))}
                </>
            }
            <UploadedImages images={savedImages} containerType={createdPlantData?.containerType} />
        </div>
    );
};

export default UploadPlantImages;
