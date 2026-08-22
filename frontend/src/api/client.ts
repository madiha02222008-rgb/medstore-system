const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("medstore_token");
}

export async function apiRequest(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || "Kuch galat ho gaya");
  }
  return json.data;
}

export const api = {
  login: (email: string, password: string) =>
    apiRequest("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

  getMedicines: () => apiRequest("/medicines"),
  createMedicine: (data: any) => apiRequest("/medicines", { method: "POST", body: JSON.stringify(data) }),
  addBatch: (data: any) => apiRequest("/medicines/batches", { method: "POST", body: JSON.stringify(data) }),
  lowStock: () => apiRequest("/medicines/low-stock"),

  getCustomers: () => apiRequest("/customers"),
  createCustomer: (data: any) => apiRequest("/customers", { method: "POST", body: JSON.stringify(data) }),
  outstanding: () => apiRequest("/customers/outstanding"),

  getSuppliers: () => apiRequest("/suppliers"),
  createSupplier: (data: any) => apiRequest("/suppliers", { method: "POST", body: JSON.stringify(data) }),

  getPurchases: () => apiRequest("/purchases"),
  createPurchase: (data: any) => apiRequest("/purchases", { method: "POST", body: JSON.stringify(data) }),

  getSales: () => apiRequest("/sales"),
  createSale: (data: any) => apiRequest("/sales", { method: "POST", body: JSON.stringify(data) }),
  recordPayment: (saleId: string, amount: number, mode: string) =>
    apiRequest(`/sales/${saleId}/payments`, { method: "POST", body: JSON.stringify({ amount, mode }) }),
};
