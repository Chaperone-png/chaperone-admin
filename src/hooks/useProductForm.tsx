import { useState } from 'react';
import { message } from 'antd';
import { plantApi } from '../services/apis/plantApi';
import { nurseryPlantApi } from '../services/apis/nurseryPlantApi';

const useProductForm = (onSuccess:any, plantDetails:any, nursery:any) => {
  const [isLoading, setIsLoading] = useState(false);

  const createProduct = async (payload:any) => {
    setIsLoading(true);
    try {
      let response;
      if (plantDetails) {
        if (!nursery) {
          response = await plantApi.updatePlant(plantDetails._id, payload);
          message.success('Plant updated in your inventory');
        } else {
          if (nursery.isAdd) {
            response = await nurseryPlantApi.createNurseryPlant(nursery.id, payload);
            message.success('Plant details saved');
          }
        }
      } else {
        if (!nursery) {
          response = await plantApi.createAdminPlant(payload);
          message.success('Plant added to your inventory');
        }
      }
      onSuccess && onSuccess(response?.data);
    } catch (error:any) {
      console.error('Error creating/updating plant:', error?.response);
      message.error(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

//   const uploadImage = async (file:any) => {
//     const formData = new FormData();
//     formData.append('image', file);
//     const response = await plantApi.uploadImage(formData);
//     return response.data;
//   };

//   const removeImage = async (file:any) => {
//     await plantApi.removeImage(file.uid);
//   };

  return { createProduct,  isLoading };
};

export default useProductForm;
