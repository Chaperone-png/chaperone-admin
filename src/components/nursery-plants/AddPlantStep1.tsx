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
      <div className="step-content" id="add-plant-step-1">
        <div className="related-content">
          <p>
            Please select an existing plant from the dropdown below or add a new
            plant using the button.
          </p>
        </div>
        <Select
          showSearch
          style={{ marginBottom: 20 }}
          placeholder="Search and select plant"
          optionFilterProp="children"
          onChange={handlePlantSelect}
          value={selectedPlantTemplate?._id}
          filterOption={(
            input: string,
            option?: { label: string; value: string; children: string }
          ) => {
            return (
              option?.children
                ?.toString()
                .toLowerCase()
                .includes(input.toLowerCase()) ?? false
            );
          }}
          allowClear
          className="w-full"
        >
          {plants.map((plant) => (
            <Select.Option key={plant._id} value={plant._id}>
              {plant.plantName}
            </Select.Option>
          ))}
        </Select>
      </div>
    );
};

export default AddPlantStep1;
