import { Button, Col, Row, Select } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AdminPlantTye } from '../../types';

interface Step1ContentProps {
    plants: AdminPlantTye[];
    handlePlantSelect: (value: string | undefined) => void;
    handleAddPlant: any;
}

const AddPlantStep1: React.FC<Step1ContentProps> = ({
    plants,
    handlePlantSelect,
    handleAddPlant,
}) => {
    const { selectedPlantTemplate } = useSelector((state: RootState) => state.nurseryPlant);
    return (
        <div className="step-content" id='add-plant-step-1'>
            <div className="related-content">
                <p>Please select an existing plant from the dropdown below or add a new plant using the button.</p>
            </div>
            <Select
                style={{ marginBottom: 20 }}
                placeholder="Select Plant"
                onChange={handlePlantSelect}
                value={selectedPlantTemplate?._id}
            >
                {plants.map(plant => (
                    <Select.Option key={plant._id} value={plant._id}>
                        {plant.plantName}
                    </Select.Option>
                ))}
            </Select>
        </div>

    );
};

export default AddPlantStep1;
