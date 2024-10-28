import React from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import ItemTypeModal from '../common/ItemTypeModal';

const PlantTypeModal = (props: any) => {
  const plantLabels = {
    modalTitle: 'Plant Type',
    titleLabel: 'Plant Type Title',
    descriptionLabel: 'Plant Type Description',
    statusLabel: 'Status',
    subcategoryNameLabel: 'Subcategory Name',
    subcategoryDescriptionLabel: 'Subcategory Description',
    addSubcategoryButton: 'Add Subcategory',
    submitButton: props.plantType ? 'Update' : 'Add',
  };

  const apiMethods = {
    createItemType: plantApi.createPlantType,
    updateItemType: plantApi.updatePlantType,
  };

  return <ItemTypeModal showBenefits showFaqs {...props} labels={plantLabels} api={apiMethods} itemType={props.plantType} />;
};

export default PlantTypeModal;
