// src/types.ts
import { ReactNode } from "react";
import { MenuProps } from "antd";
import { CONTAINER_TYPES } from "./utils/constants";
// import { Rule } from 'antd/lib/form';

export interface MenuDataItem extends MenuProps {
  key: string;
  title: string;
  icon: ReactNode;
  path: string;
  subItems?: any[];
}
export type State = {
  _id: string;
  name: string;
};

export type City = {
  _id: string;
  name: string;
};
export interface Location {
  city: string;
  state: string;
  pincode: string;
  address: string;
}

export interface Nursery {
  _id?: string;
  key: string;
  image: string;
  name: string;
  location: Location;
  contactPerson: string;
  contactNumber: string;
  email: string;
}
// Custom validator function for image upload
const validateImageFile = (rule: any, value: any, callback: any) => {
  // Check if value is not null and it's a File object
  if (value && value instanceof File) {
    // Check file format (example: allow only JPEG or PNG)
    const acceptedFormats = ["image/jpeg", "image/png"];
    if (!acceptedFormats.includes(value.type)) {
      callback("Please upload a JPEG or PNG image");
      return;
    }

    // Check file size (example: limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (value.size > maxSize) {
      callback("Image size must be less than 5MB");
      return;
    }
  }

  callback(); // Validation passed
};
export const nurseryValidationRules: any = {
  name: [
    {
      required: true,
      message: "Please enter the nursery name",
    },
  ],
  country: [
    {
      required: true,
      message: "Please select the country",
    },
  ],
  state: [
    {
      required: true,
      message: "Please select the state",
    },
  ],
  city: [
    {
      required: true,
      message: "Please enter the city",
    },
  ],
  pincode: [
    {
      required: true,
      message: "Please enter the pincode",
    },
    {
      pattern: /^[0-9]{6}$/, // Example pattern for a 6-digit pincode
      message: "Please enter a valid 6-digit pincode",
    },
  ],
  contactPerson: [
    {
      required: true,
      message: "Please enter the contact person",
    },
  ],
  contactNumber: [
    {
      required: true,
      message: "Please enter the contact number",
    },
    {
      pattern: /^[0-9]{10}$/, // Example pattern for a 10-digit contactNumber number
      message: "Please enter a valid 10-digit contact number",
    },
  ],
  email: [
    {
      required: true,
      message: "Please enter the email",
    },
    {
      type: "email",
      message: "Please enter a valid email",
    },
  ],
  password: [
    {
      required: true,
      message: "Please enter password",
    },
    {
      min: 6,
      message: "Password must be at least 6 characters long",
    },
  ],
  fullAddress: [
    {
      required: true,
      message: "Please enter nursery address",
    },
  ],
};

export type ProductCategory = "plant" | "Pot/Planter" | "Plant" | "Pot";
interface Color {
  color: string;
  quantity: number;
  _id: string;
}

interface PotType {
  typeTitle: string;
  availableColors: Color[];
  price: number;
  _id: string;
}

interface Detail {
  potTypes: PotType[];
  size: string;
  planterTypes: any[];
  discount: number;
  colors: any[];
  weight: number;
  quantity: number;
  description: string;
  is_offer: string;
  original_price: number;
  offer_price: number;
  admin_selling_price: number;
  is_admin_offer: any;
  admin_offer_percentage: number;
}

interface AvailableSize {
  detail: Detail;
  plantSizeId: any;
  _id: string;
}

export type AdminPlantTye = {
  _id: string;
  nursery: any;
  plantName: string;
  productTypeId: {
    status: string;
    _id: string;
    title: string;
  };
  productType: {
    title: string;
    status: string;
    _id: string;
  };
  description: string;
  maintenanceType: string;
  waterSchedule: string[];
  lightEfficient: string[];
  plantTypeIds: Array<{
    _id: string;
    title: string;
    status: string;
    slug: string;
    description?: string;
    __v: number;
  }>;
  about: string;
  instructions: string[];
  availableSizes: AvailableSize[];
  containerType: "pot" | "bag" | "planter";
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  plantBenefits: {
    title: string;
    description: string;
  }[];
  plantCareTips: {
    title: string;
    description: string;
  }[];
  images: Array<{
    url: string;
    _id: string;
    potType: string;
    color: string;
    containerType: string;
  }>;
  careTipsIds: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  zodiacSigns: string[];
  plantBenefitIds: Array<{
    _id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
  totalBuyers: number;
  __v: number;
  containerMaterial: string;
  metaTitle: string;
  metaDescription: string;
  metaH1: string;
  metaKeywords: string;
};
export type MaaliType = {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  state: State;
  city: City;
  pincode: string;
  fullAddress: string;
  email: string;
  mobileNumber: string;
  workPincodes: string[];
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  docInfo: {
    aadharImage?: {
      image: string;
      number: string;
    };
    panImage?: {
      image: string;
      number: string;
    };
    drivingLicense?: {
      image: string;
      number: string;
    };
    voterIdCardImage?: {
      image: string;
      number: string;
    };
  };
};
export type ContainerType =
  (typeof CONTAINER_TYPES)[keyof typeof CONTAINER_TYPES];

export type orderStatusTypes = {
  pending: 'Processing',
  completed: 'Delivered',
  cancelled: 'Cancel In Progress',
  returned: 'Returned Initiated',
  refunded: 'Refunded',
  intransit: 'Out For Delivery',
}