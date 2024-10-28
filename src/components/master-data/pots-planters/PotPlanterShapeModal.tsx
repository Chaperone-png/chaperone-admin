import React from 'react';
import { plantApi } from '../../../services/apis/plantApi';
import ItemTypeModal from '../common/ItemTypeModal';
import { potPlanterApi } from '../../../services/apis/potPlanterApi';

const PotPlanterShapeModal = (props: any) => {
    const plantLabels = {
        modalTitle: 'Pot/Planter Shape',
        titleLabel: 'Shape',
        descriptionLabel: 'Shape Description',
        statusLabel: 'Status',
        addSubcategoryButton: 'Add Subcategory',
        submitButton: props.plantType ? 'Update' : 'Add',
    };

    const apiMethods = {
        createItemType: potPlanterApi.createPotPlanterShape,
        updateItemType: potPlanterApi.updatePotPlanterShape,
    };

    return <ItemTypeModal {...props} labels={plantLabels} api={apiMethods} itemType={props.plantType} hideSubcategory />;
};

export default PotPlanterShapeModal;
