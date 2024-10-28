import { useState, useEffect } from 'react';
import { plantApi } from '../services/apis/plantApi';

const useCategories = () => {
  const [plantTypes, setPlantTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlantTypes = async () => {
      try {
        const response = await plantApi.getPlantTypes();
        setPlantTypes(response.data);
      } catch (error) {
        console.error('Error fetching plant types:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlantTypes();
  }, []);

  return { plantTypes, isLoading };
};

export default useCategories;
