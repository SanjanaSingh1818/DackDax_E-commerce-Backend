// lib/api.ts

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

// Generic request helper
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const { headers, ...rest } = options
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    cache: "no-store", // disable Next.js caching for dynamic data
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API request failed");
  }

  return res.json();
}

// ================= AUTH =================
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    request<any>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  register: (data: any) =>
    request<any>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: (token: string) =>
    request<any>("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ================= PRODUCTS =================

export const productAPI = {

  /* GET ALL PRODUCTS */
  getAll: (params?: Record<string, any>) => {

    const query = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          query.append(key, String(value));
        }
      });
    }

    const endpoint =
      `/api/products${query.toString() ? `?${query.toString()}` : ""}`;

    console.log("Fetching:", `${API_BASE}${endpoint}`);

    return request<any>(endpoint);
  },


  /* GET PRODUCT BY ID */
  getById: (id: string) =>
    request<any>(`/api/products/${id}`),


  /* GET FILTER OPTIONS */
  getFilters: () =>
    request<any>("/api/products/filters"),


  /* CREATE PRODUCT */
  create: (data: any, token?: string) =>
    request<any>("/api/products", {
      method: "POST",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      body: JSON.stringify(data),
    }),


  /* UPDATE PRODUCT */
  update: (id: string, data: any, token?: string) =>
    request<any>(`/api/products/${id}`, {
      method: "PUT",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
      body: JSON.stringify(data),
    }),


  /* DELETE PRODUCT */
  delete: (id: string, token?: string) =>
    request<any>(`/api/products/${id}`, {
      method: "DELETE",
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    }),

};



// ================= CART =================
export const cartAPI = {

  /* GET CART */
  get: (token: string) =>
    request<any>("/api/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),


  /* ADD TO CART */
  add: (
    data: {
      productId: string
      quantity: number
    },
    token: string
  ) =>
    request<any>("/api/cart/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),


  /* UPDATE CART */
  update: (
    productId: string,
    quantity: number,
    token: string
  ) =>
    request<any>("/api/cart/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    }),


  /* REMOVE FROM CART */
  remove: (
    productId: string,
    token: string
  ) =>
    request<any>(`/api/cart/remove/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),

}


// ================= ORDERS =================
export const orderAPI = {
  create: (data: any, token: string) =>
    request<any>("/api/orders", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  myOrders: (token: string) =>
    request<any>("/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAll: (token: string) =>
    request<any>("/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// ================= CAR =================
export const carAPI = {
  search: (params: string) => request<any>(`/api/car/search?${params}`),
};

// ================= PAYMENT =================
export const paymentAPI = {
  createIntent: (data: any, token: string) =>
    request<any>("/api/payment/create-intent", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
};

export default request;
