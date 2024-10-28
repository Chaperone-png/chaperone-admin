import { useState, useEffect } from 'react';
import { plantApi } from '../services/apis/plantApi';

const usePlantBenefits = () => {
  const [plantBenefits, setPlantBenefits] = useState([]);

  useEffect(() => {
    const fetchPlantBenefits = async () => {
      try {
        const response = await plantApi.getPlantBenefits();
        setPlantBenefits(response.data);
      } catch (error) {
        console.error('Error fetching plant benefits:', error);
      }
    };

    fetchPlantBenefits();
  }, []);

  return { plantBenefits };
};

export default usePlantBenefits;
