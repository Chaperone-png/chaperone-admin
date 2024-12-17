import { Category } from "../components/dashboard/DashboardWidgets";

export const availablePlanters = [
  { label: "GroPot", value: "groPot" },
  { label: "Roma Pot", value: "romaPot" },
  { label: "Lagos Pot", value: "lagosPot" },
  { label: "Krish Pot", value: "krishPot" },
  { label: "Jar Pot", value: "jarPot" },
  { label: "Atlantis Pot", value: "atlantisPot" },
  { label: "Ceramic Pot", value: "ceramicPot" },
  { label: "Diamond Pot", value: "diamondPot" },
];

export const productTypes = [
  { label: "Plant", value: "plant" },
  { label: "Pot", value: "pot" },
  // { label: 'Tool', value: 'tool' },
  // { label: 'Fertilizer', value: 'fertilizer' },
];

export const plantCategories = [
  { label: "Indoor Plant", value: "indoor" },
  { label: "Outdoor Plant", value: "outdoor" },
  { label: "Hanging Plant", value: "hanging" },
  { label: "Other", value: "other" },
];

export const sizes = [
  { label: "Small (1-5)", value: "small" },
  { label: "Medium (5-8)", value: "medium" },
  { label: "Large (8-12)", value: "large" },
];

export const isComboOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];
export const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];
export const CONTAINER_TYPES = {
  BAG: "bag",
  POT: "pot",
  PLANTER: "planter",
} as const;

export const orderTabTypes = [
  {
    id: "1",
    title: "All",
    value: "all",
  },
  {
    id: "2",
    title: "Delivered",
    value: "delivered",
  },
  {
    id: "3",
    title: "Pending",
    value: "pending",
  },
  {
    id: "4",
    title: "Cancelled",
    value: "cancelled",
  },
  {
    id: "5",
    title: "Returned",
    value: "returned",
  },
];

export const orderStatusTypesData = {
  Pending: {
    title: "Pending",
    color: "yellow",
    value: "pending",
  },
  Processing: {
    title: "Processing",
    color: "blue",
    value: "processing",
  },
  Shipped: {
    title: "Shipped",
    color: "blue",
    value: "shipped",
  },
  "Out For Delivery": {
    title: "Out For Delivery",
    color: "yellow",
    value: "out for delivery",
  },
  "In Transit": {
    title: "In Transit",
    color: "purple",
    value: "in transit",
  },
  Delivered: {
    title: "Delivered",
    color: "green",
    value: "delivered",
  },
  Completed: {
    title: "Delivered",
    color: "green",
    value: "delivered",
  },
  "Failed Delivery": {
    title: "Failed Delivery",
    color: "orange",
    value: "failed delivery",
  },
  Cancelled: {
    title: "Cancelled",
    color: "red",
    value: "cancelled",
  },
  "Cancel In Progress": {
    title: "Cancel In Progress",
    color: "red",
    value: "cancel in progress",
  },
  Returned: {
    title: "Returned",
    color: "red",
    value: "returned",
  },
  "Returned Initiated": {
    title: "Returned Initiated",
    color: "red",
    value: "returned initiated",
  },
  Refunded: {
    title: "Refunded",
    color: "green",
    value: "refunded",
  },
};

export const MaaliBookingPlanTypesData = [
  {
    id: 0,
    title: "All",
    color: "yellow",
    value: "all",
  },
  {
    id: 1,
    title: "One Time",
    color: "yellow",
    value: "one_time",
  },
  {
    id: 2,
    title: "Weekly",
    color: "blue",
    value: "weekly",
  },
  {
    id: 3,
    title: "Monthly",
    color: "blue",
    value: "monthly",
  },
];

export type OrderStatusKeys = keyof typeof orderStatusTypesData;

export const statusColorConstants: Record<string, string> = {
  Pending: "yellow",
  "Awaiting Payment": "orange",
  Processing: "blue",
  Shipped: "blue",
  "Out For Delivery": "yellow",
  "In Transit": "purple",
  Delivered: "green",
  Completed: "green",
  "Failed Delivery": "orange",
  Cancelled: "red",
  "Cancel In Progress": "red",
  Returned: "red",
  "Returned Initiated": "red",
  Refunded: "green",
};

export const dashboardCategories: Category[] = [
  {
    title: "Plants Statistics",
    widgets: [
      {
        title: "All Orders",
        firstCount: 5,
        secondCount: 10,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "/orders/all",
      },
      {
        title: "Pending Orders",
        firstCount: 3,
        secondCount: 8,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: `/orders/${orderStatusTypesData.Pending.value}`,
      },
      {
        title: "Completed Orders",
        firstCount: 5,
        secondCount: 10,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: `/orders/${orderStatusTypesData.Delivered.value}`,
      },
      {
        title: "Cancelled Orders",
        firstCount: 3,
        secondCount: 8,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: `/orders/${orderStatusTypesData.Cancelled.value}`,
      },
      // Add more widgets related to plants
    ],
    path: "/orders/all",
  },
  {
    title: "Maali Statistics",
    widgets: [
      {
        title: "Subscriptions",
        firstCount: 10,
        secondCount: 20,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "/maali-bookings/all",
      },
      {
        title: "One Time Subscriptions",
        firstCount: 8,
        secondCount: 15,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "/maali-bookings/one_time",
      },
      {
        title: "Weekly Subscriptions",
        firstCount: 8,
        secondCount: 15,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "/maali-bookings/weekly",
      },
      {
        title: "Monthly Subscriptions",
        firstCount: 8,
        secondCount: 15,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "/maali-bookings/monthly",
      },
      // Add more widgets related to Maali
    ],
    path: "/services/maali",
  },
  {
    title: "Plant on rent Statistics",
    widgets: [
      {
        title: "All orders",
        firstCount: 15,
        secondCount: 30,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "",
      },
      {
        title: "Cancelled orders",
        firstCount: 5,
        secondCount: 12,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "danger",
        link: "",
      },
      // Add more widgets related to Plant on rent
    ],
    path: "/services/plant-on-rent",
  },
  {
    title: "Plant day care Statistics",
    widgets: [
      {
        title: "All orders",
        firstCount: 15,
        secondCount: 30,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "success",
        link: "",
      },
      {
        title: "On-going orders",
        firstCount: 5,
        secondCount: 12,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "danger",
        link: "",
      },
      {
        title: "Completed orders",
        firstCount: 5,
        secondCount: 12,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "danger",
        link: "",
      },
      {
        title: "Cancelled orders",
        firstCount: 5,
        secondCount: 12,
        secondCountPrefix: "Rs.",
        secondCountSuffix: "K",
        secondCountType: "danger",
        link: "",
      },

      // Add more widgets related to Plant on rent
    ],
    path: "/services/plant-day-care",
  },
];

export const ReactQuillFonts = [
  "Arial",
  "Courier New",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Comic Sans MS",
  "Roboto",
];

export const ReactQuillModules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: ReactQuillFonts }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ align: [] }],
    ["link", "image"],
  ],
};
