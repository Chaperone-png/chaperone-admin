import { Button, message } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { useCallback, useEffect, useState } from 'react';
import { nurseryPlantApi } from '../../services/apis/nurseryPlantApi';
import { AdminPlantTye } from '../../types';
import ImageUploader from './ImageUploader';
import UploadedImages from './UploadedImages';
import { useNavigate } from 'react-router-dom';
import { potPlanterApi } from '../../services/apis/potPlanterApi';
import { useLoader } from '../../context/LoaderContext';

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
    const { startLoader, stopLoader } = useLoader();
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

    interface SaveImagesPayload {
        containerType?: string;
        color?: string;
        awsUrl: string[]; // Use an array to accommodate multiple URLs
    }

    const handleSaveImages = async (potType?: string, color?: string) => {
        const payload: SaveImagesPayload = { awsUrl: [] }; // Initialize payload with awsUrl as an array
        setIsSaving(true);

        try {
            startLoader();

            if (createdPlantData.containerType === 'bag') {
                // Handle save for bag type
                const bagImages = uploadedImages.find(item => item.plant === 'bag');
                if (bagImages) {
                    payload.containerType = createdPlantData.containerType; // Set containerType
                    bagImages.images.forEach(image => {
                        if (Array.isArray(image.awsUrl)) {
                            payload.awsUrl.push(...image.awsUrl); // Spread array into payload
                        } else {
                            payload.awsUrl.push(image.awsUrl); // Push single URL
                        }
                    });
                }
            } else {
                // Handle save for pot or planter type
                const specificImages = uploadedImages.find(item => item.color === color);
                if (specificImages) {
                    payload.color = specificImages.color; // Set color
                    payload.containerType = createdPlantData.containerType; // Set containerType

                    specificImages.images.forEach(image => {
                        if (Array.isArray(image.awsUrl)) {
                            payload.awsUrl.push(...image.awsUrl); // Spread array into payload
                        } else {
                            payload.awsUrl.push(image.awsUrl); // Push single URL
                        }
                    });
                }
            }

            let response;
            if (productType === 'Pot/Planter') {
                response = await potPlanterApi.updateNurseryImages(nurseryId, plantId, payload);
            } else {
                response = await nurseryPlantApi.updateNurseryImages(nurseryId, plantId, payload);
            }

            if (response.data.images) {
                setSavedImages(response.data.images);
            }
            setUploadedImages([]);
            message.success('Plant details saved successfully!');
            navigate('/products');
        } catch (error: any) {
            message.error('Something went wrong!');
            console.log(error, 'ERROR');
        } finally {
            setIsSaving(false);
            stopLoader();
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
            <UploadedImages images={savedImages} productType={createdPlantData?.productType?.title} id={createdPlantData?._id} containerType={createdPlantData?.containerType} setSavedImages={setSavedImages} />
        </div>
    );
};

export default UploadPlantImages;
