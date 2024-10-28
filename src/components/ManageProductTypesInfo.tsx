import { useEffect, useState } from "react";
import { productApi } from "../services/apis/productApi";

const ManageProductTypesInfo = () => {
  const [productTypes, setProductTypes]= useState([])
  useEffect(() => {
    fetchProductTypes();
  }, []);

  const fetchProductTypes = async () => {
    try {
      const response = await productApi.getProductTypes();
      setProductTypes(response.data);
    } catch (error) {
      console.error('Error fetching plant types:', error);
    }
  };


  return (
    <>
    
    </>
  );
};

export default ManageProductTypesInfo;
