export type AdminSettingsData = {
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

type ApiResponse<T> = {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("Saknar inloggningstoken.");
  }

  const headers = new Headers(options?.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  if (!headers.has("Content-Type") && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    cache: "no-store",
    ...(options || {}),
    headers,
  });

  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T> | T;

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload && "error" in payload
        ? String(payload.error || payload.message || "Request failed")
        : "Request failed";
    throw new Error(message);
  }

  if (typeof payload === "object" && payload && "data" in payload) {
    return (payload as ApiResponse<T>).data as T;
  }

  return payload as T;
}

export async function getSettings() {
  return request<AdminSettingsData>("/api/admin/settings");
}

export async function updateProfile(input: { name: string; email: string }) {
  return request<AdminSettingsData["profile"]>("/api/admin/settings/profile", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePassword(input: { currentPassword: string; newPassword: string }) {
  return request<{ changed: boolean }>("/api/admin/settings/change-password", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateStoreSettings(input: AdminSettingsData["store"]) {
  return request<AdminSettingsData["store"]>("/api/admin/settings/store", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updatePricingSettings(input: AdminSettingsData["pricing"]) {
  return request<AdminSettingsData["pricing"]>("/api/admin/settings/pricing", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateShippingSettings(input: AdminSettingsData["shipping"]) {
  return request<AdminSettingsData["shipping"]>("/api/admin/settings/shipping", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
