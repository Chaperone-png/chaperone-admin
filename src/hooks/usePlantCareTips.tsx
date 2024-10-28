import { useState, useEffect } from 'react';
import { plantApi } from '../services/apis/plantApi';

const usePlantCareTips = () => {
  const [careTips, setCareTips] = useState([]);

  useEffect(() => {
    const fetchCareTips = async () => {
      try {
        const response = await plantApi.getPlantCareTips();
        setCareTips(response.data);
      } catch (error) {
        console.error('Error fetching plant care tips:', error);
      }
    };

    fetchCareTips();
  }, []);

  return { careTips };
};

export default usePlantCareTips;
