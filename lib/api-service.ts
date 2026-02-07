import { API_URL } from "./auth-service";
import { getCookie, clearAuthCookies } from "./cookie-utils";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Product {
  id: number;
  sku: string;
  name: string;
  price: number;
  brand: string;
  category: string;
  description: string | null;
  stock: number;
  images: string[];
  specifications: any; // JSON
  condition: string;
  warranty: string | null;
  weight: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Review {
  id: number;
  orderId: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user?: {
    name: string | null;
    email: string;
  };
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  shippingCost: number;
  shippingService: string | null;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  shippingAddr: any;
  shippingAddress?: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  phone: string;
  trackingNo: string | null;
  trackingNumber?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  payment?: Payment;
  user?: {
    name: string | null;
    email: string;
  };
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  price?: number;
  product?: Product;
}

export interface Payment {
  id: number;
  orderId: number;
  provider: string;
  providerId: string | null;
  snapToken: string | null;
  redirectUrl: string | null;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
  paidAt: string | null;
}

export interface ShippingProvince {
  province_id: string;
  province: string;
}

export interface ShippingCity {
  city_id: string;
  province_id: string;
  city_name: string;
  type: string;
  postal_code: string;
}

export interface ShippingCost {
  service: string;
  description: string;
  cost: Array<{
    value: number;
    etd: string;
    note: string;
  }>;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  salesByMonth?: Array<{ month: string; revenue: number; orders: number }>;
  topProducts?: Array<{ productId: number; productName: string; totalSales: number }>;
}

export interface Customer {
  id: number;
  email: string;
  name: string | null;
  phone?: string;
  image?: string;
  address?: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: number;
  firstName: string;
  lastName: string;
  subject: string;
  phone: string;
  message: string;
  createdAt: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getAuthHeaders(): HeadersInit {
  const token = getCookie("emobo-token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    const errorMessage = error.message || `HTTP ${response.status}: ${response.statusText}`;

    // Handle expired or invalid token automatically
    if (
      errorMessage.toLowerCase().includes("invalid or expired token") || 
      response.status === 401 ||
      errorMessage === "User not found"
    ) {
      if (typeof window !== "undefined") {
        clearAuthCookies();
        window.location.href = "/login";
      }
    }

    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data.data || data;
}

// ============================================
// PRODUCT API
// ============================================

export async function fetchPublicProducts(params?: {
  brand?: string;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
  sortBy?: "price_asc" | "price_desc" | "newest";
}): Promise<{ products: Product[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params?.brand) queryParams.append("brand", params.brand);
  if (params?.category) queryParams.append("category", params.category);
  if (params?.search) queryParams.append("search", params.search);
  if (params?.minPrice) queryParams.append("minPrice", params.minPrice.toString());
  if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.offset) queryParams.append("offset", params.offset.toString());
  if (params?.sortBy) queryParams.append("sortBy", params.sortBy);

  const url = `${API_URL}/products/public${queryParams.toString() ? `?${queryParams}` : ""}`;
  const response = await fetch(url);
  return handleResponse<{ products: Product[]; total: number }>(response);
}

export async function fetchTopSellingProducts(limit: number = 4): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products/top-selling?limit=${limit}`);
  return handleResponse<Product[]>(response);
}

export async function fetchProductById(id: number): Promise<Product> {
  const response = await fetch(`${API_URL}/products/public/${id}`);
  return handleResponse<Product>(response);
}

export async function fetchAllProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/products`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Product[]>(response);
}

export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(response);
}

export async function updateProduct(id: number, data: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Product>(response);
}

export async function deleteProduct(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<void>(response);
}

// ============================================
// REVIEW API
// ============================================

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const response = await fetch(`${API_URL}/reviews/product/${productId}`);
  return handleResponse<Review[]>(response);
}

export async function createReview(data: {
  orderId: number;
  productId: number;
  rating: number;
  comment?: string;
}): Promise<Review> {
  const response = await fetch(`${API_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Review>(response);
}

// ============================================
// ORDER API
// ============================================

export async function createOrder(data: {
  items: Array<{ productId: number; quantity: number }>;
  shippingAddr: any;
  phone: string;
  shippingCost: number;
  shippingService: string;
}): Promise<Order> {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Order>(response);
}

export async function fetchUserOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Order[]>(response);
}

export async function fetchOrderById(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    headers: getAuthHeaders(),
    cache: "no-store",
  });
  return handleResponse<Order>(response);
}

export async function cancelOrder(id: number): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${id}/cancel`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  return handleResponse<Order>(response);
}

// ============================================
// PAYMENT API
// ============================================

export async function createPayment(orderId: number): Promise<Payment> {
  const response = await fetch(`${API_URL}/payments/${orderId}/create`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse<Payment>(response);
}

export async function fetchPaymentStatus(orderId: number): Promise<Payment> {
  const response = await fetch(`${API_URL}/payments/${orderId}/status`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Payment>(response);
}

// ============================================
// SHIPPING API
// ============================================

export async function fetchProvinces(): Promise<ShippingProvince[]> {
  const response = await fetch(`${API_URL}/shipping/provinces`);
  return handleResponse<ShippingProvince[]>(response);
}

export async function fetchCities(provinceId: string): Promise<ShippingCity[]> {
  const response = await fetch(`${API_URL}/shipping/cities?provinceId=${provinceId}`);
  return handleResponse<ShippingCity[]>(response);
}

export async function calculateShippingCost(data: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}): Promise<ShippingCost[]> {
  const response = await fetch(`${API_URL}/shipping/cost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ShippingCost[]>(response);
}

// ============================================
// CUSTOMER API (Admin Only)
// ============================================

export async function fetchAllCustomers(): Promise<Customer[]> {
  const response = await fetch(`${API_URL}/customers`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Customer[]>(response);
}

export async function fetchCustomerById(id: number): Promise<Customer> {
  const response = await fetch(`${API_URL}/customers/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Customer>(response);
}

export async function fetchAllOrders(): Promise<Order[]> {
  const response = await fetch(`${API_URL}/orders/all`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Order[]>(response);
}

export async function updateOrderStatus(orderId: number, status: string): Promise<Order> {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse<Order>(response);
}

export async function fetchUserProfile(): Promise<Customer> {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Customer>(response);
}

export async function updateUserProfile(data: Partial<Customer>): Promise<Customer> {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse<Customer>(response);
}

// ============================================
// REPORTS API (Admin Only)
// ============================================

export async function fetchSalesReport(): Promise<SalesReport> {
  const response = await fetch(`${API_URL}/reports/sales`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<SalesReport>(response);
}

// ============================================
// AUTH API
// ============================================

export async function requestForgotPassword(email: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse<{ message: string }>(response);
}

export async function resetUserPassword(data: { token: string; password: string }): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<{ message: string }>(response);
}

export async function fetchAdminContact(): Promise<{ phone: string }> {
  const response = await fetch(`${API_URL}/users/contact`);
  return handleResponse<{ phone: string }>(response);
}

// ============================================
// NOTIFICATION API
// ============================================

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_URL}/notifications`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Notification[]>(response);
}

export async function markNotificationAsRead(id: number): Promise<Notification> {
  const response = await fetch(`${API_URL}/notifications/${id}/read`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });
  return handleResponse<Notification>(response);
}

export async function deleteNotification(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/notifications/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  await handleResponse<void>(response);
}

// ============================================
// CONTACT API
// ============================================

export async function sendContactMessage(data: Omit<ContactMessage, "id" | "createdAt">): Promise<ContactMessage> {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<ContactMessage>(response);
}
