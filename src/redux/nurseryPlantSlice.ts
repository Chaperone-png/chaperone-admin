import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminPlantTye } from "../types";

interface StepState {
  currentStep: number;
  selectedPlantId: string | undefined;
  selectedPlantTemplate: any;
  createdPlantData: AdminPlantTye | null | undefined;
  nurseryId: string | undefined;
  selectedProductTypeId: string | undefined;
}

const initialState: StepState = {
  currentStep: 0,
  selectedPlantId: undefined,
  selectedPlantTemplate: undefined,
  createdPlantData: null,
  nurseryId: undefined,
  selectedProductTypeId: undefined,
};

const stepSlice = createSlice({
  name: "step",
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },
    setSelectedPlantId(state, action: PayloadAction<string | undefined>) {
      state.selectedPlantId = action.payload;
    },
    setSelectedPlantTemplate(state, action: PayloadAction<any>) {
      state.selectedPlantTemplate = action.payload;
    },
    setCreatedPlantData(state, action: PayloadAction<any>) {
      state.createdPlantData = action.payload;
    },
    setNurseryId(state, action: PayloadAction<string | undefined>) {
      state.nurseryId = action.payload;
    },
    setProductCategory(state, action: PayloadAction<string | undefined>) {
      state.selectedProductTypeId = action.payload;
    },
    resetCreateNurseryData(state) {
      state.currentStep = 0;
      state.selectedPlantId = undefined;
      state.selectedPlantTemplate = undefined;
      state.createdPlantData = undefined;
      state.nurseryId = undefined;
      state.selectedProductTypeId = undefined;
    },
  },
});

export const {
  setCurrentStep,
  setSelectedPlantId,
  setSelectedPlantTemplate,
  setCreatedPlantData,
  setNurseryId,
  setProductCategory,
  resetCreateNurseryData,
} = stepSlice.actions;

export default stepSlice.reducer;
