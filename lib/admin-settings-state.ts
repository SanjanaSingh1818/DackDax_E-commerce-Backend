export type AdminSettingsState = {
  profile: {
    name: string;
    email: string;
  };
  store: {
    storeName: string;
    storeEmail: string;
    storePhone: string;
    storeAddress: string;
  };
  pricing: {
    defaultMargin: number;
    vat: number;
  };
  shipping: {
    freeShippingThreshold: number;
    deliveryDays: number;
    shippingCost: number;
  };
};

export const adminSettingsState: AdminSettingsState = {
  profile: {
    name: "",
    email: "",
  },
  store: {
    storeName: "",
    storeEmail: "",
    storePhone: "",
    storeAddress: "",
  },
  pricing: {
    defaultMargin: 0,
    vat: 0,
  },
  shipping: {
    freeShippingThreshold: 0,
    deliveryDays: 0,
    shippingCost: 0,
  },
};
