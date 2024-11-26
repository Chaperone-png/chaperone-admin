import { Steps } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  setCreatedPlantData,
  setCurrentStep,
  setSelectedPlantId,
  setSelectedPlantTemplate,
} from "../../redux/nurseryPlantSlice";
import { RootState } from "../../redux/store";
import { plantApi } from "../../services/apis/plantApi";
import "../../styles/PlantSelection.scss";
import { AdminPlantTye } from "../../types";
import CreatePlantForm from "../master-data/plants/CreatePlantForm";
import AddPlantStep1 from "./AddPlantStep1";
import ContainerDetails from "./ContainerDetails";
import UploadPlantImages from "./UploadPlantImages";
import { toast } from "react-toastify";
import { nurseryPlantApi } from "../../services/apis/nurseryPlantApi";

const AddNurseryPlant = () => {
  const {
    nurseryId,
    currentStep,
    selectedPlantTemplate,
    createdPlantData,
    selectedProductTypeId,
  } = useSelector((state: RootState) => state.nurseryPlant);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plants, setPlants] = useState<AdminPlantTye[]>([]);
  const [isAddPlantManually, setIsAddPlantManually] = useState(false);
  const [plantDetails, setPlantDetails] = useState<AdminPlantTye | null>(null);
  const fetchPlantsByAdmin = useCallback(async () => {
    try {
      const response = await plantApi.getAdminPlants("");
      if (response?.data && Array.isArray(response.data)) {
        setPlants(response.data);
      }
    } catch (error) {
      console.error("Error fetching plant types:", error);
    }
  }, []);
  useEffect(() => {
    if (!createdPlantData) {
      fetchPlantsByAdmin();
      setPlantDetails(selectedPlantTemplate);
    } else {
      setPlantDetails(createdPlantData);
    }
  }, [fetchPlantsByAdmin, createdPlantData, selectedPlantTemplate]);

  const handlePlantSelect = (value: string | undefined) => {
    dispatch(setSelectedPlantId(value));
    dispatch(
      setSelectedPlantTemplate(plants.find((plant) => plant._id === value))
    );
    setIsAddPlantManually(false);
  };

  const handleStepClick = (step: number) => {
    console.log(step, "STEP", createdPlantData);
    if (step === 1) {
      if (createdPlantData) {
        dispatch(setCurrentStep(step));
      } else {
        toast.info("Please complete the basic details");
      }
    } else if (step === 2) {
      if (!createdPlantData) {
        toast.info("Please complete the basic details");
      } else if (!!createdPlantData?.availableSizes?.length) {
        dispatch(setCurrentStep(step));
      } else {
        toast.info("Please complete the plant size details");
      }
    } else if (step < currentStep) {
      dispatch(setCurrentStep(step));
    }
  };

  const handleNext = () => {
    dispatch(setCurrentStep(currentStep + 1));
  };

  const onSuccess = (plantData: any) => {
    setSearchParams({ plantId: plantData._id });
    dispatch(setCreatedPlantData(plantData));
    handleNext();
  };
  const plantId = searchParams.get("plantId");
  return (
    <div className="add-plant-stepper">
      <Steps current={currentStep} className="steps">
        <Steps.Step
          title="Plant Basic Details"
          onClick={() => handleStepClick(0)}
        />
        <Steps.Step
          title="Container Details"
          onClick={() => handleStepClick(1)}
        />
        <Steps.Step title="Plant Images" onClick={() => handleStepClick(2)} />
      </Steps>
      {currentStep === 0 && (
        <>
          {!createdPlantData && (
            <AddPlantStep1
              handlePlantSelect={handlePlantSelect}
              plants={plants}
              handleAddPlant={() => {
                dispatch(setSelectedPlantTemplate(undefined));
                setIsAddPlantManually(true);
              }}
            />
          )}
          {(selectedPlantTemplate ||
            isAddPlantManually ||
            createdPlantData) && (
            <CreatePlantForm
              plantDetails={plantDetails}
              nursery={{
                isAdd: !searchParams.get("plantId"),
                id: nurseryId,
                plantId: searchParams.get("plantId"),
              }}
              productTypeId={selectedProductTypeId}
              onSuccess={onSuccess}
            />
          )}
        </>
      )}
      {currentStep === 1 && (
        <div className="step-content" id="add-plant-step-2">
          {/* Add content for step 2 here */}
          <ContainerDetails
            nurseryId={nurseryId}
            plantId={plantId}
            handleNext={handleNext}
            updateApi={nurseryPlantApi.updateNurseryPlant}
          />
        </div>
      )}
      {currentStep === 2 && (
        <div className="step-content" id="add-plant-step-2">
          {/* Add content for step 2 here */}
          {createdPlantData && (
            <UploadPlantImages
              createdPlantData={createdPlantData}
              nurseryId={nurseryId}
              plantId={plantId}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AddNurseryPlant;
