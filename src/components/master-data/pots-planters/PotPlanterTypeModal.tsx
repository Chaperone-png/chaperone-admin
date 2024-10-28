import React from 'react';
import { potPlanterApi } from '../../../services/apis/potPlanterApi';
import ItemTypeModal from '../common/ItemTypeModal';

const PotPlanterTypeModal = (props: any) => {
    const potPlanterLabels = {
        modalTitle: 'Pot Planter Type',
        titleLabel: 'Pot Planter Type Title',
        descriptionLabel: 'Pot Planter Type Description',
        statusLabel: 'Status',
        subcategoryNameLabel: 'Subcategory Name',
        subcategoryDescriptionLabel: 'Subcategory Description',
        addSubcategoryButton: 'Add Subcategory',
        submitButton: props.itemType ? 'Update' : 'Add',
    };

    const apiMethods = {
        createItemType: potPlanterApi.createPotPlanterType,
        updateItemType: potPlanterApi.updatePotPlanterType,
    };

    return <ItemTypeModal showBenefits showFaqs hideSubcategory {...props} labels={potPlanterLabels} api={apiMethods} isCategory itemType={props.plantType} />;
};

export default PotPlanterTypeModal;
