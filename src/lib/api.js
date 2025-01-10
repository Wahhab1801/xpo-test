import axios from "axios";

const API_CONFIG = {
  baseURL: "https://admin.thetoyfair.eu/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

const createApiClient = (config) => {
  const client = axios.create(config);

  // Request interceptor
  client.interceptors.request.use(
    (config) => config,
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle specific error cases
      if (error.response?.status === 401) {
        // Handle unauthorized access
        // Example: redirect to login
      }
      return Promise.reject(error);
    }
  );

  return client;
};

const api = createApiClient(API_CONFIG);

class BrandsService {
  static async getBrands() {
    try {
      const response = await api.get("/brands");
      return response?.data?.data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      throw new Error("Failed to fetch brands");
    }
  }

  static async searchBrands(params) {
    try {
      if (!params) {
        throw new Error("Search parameters are required");
      }

      const response = await api.get("/brands/search", { params });
      return response?.data?.brands || [];
    } catch (error) {
      console.error("Error searching brands:", error);
      throw new Error("Failed to search brands");
    }
  }

  static async addBrand(brandData) {
    try {
      if (!brandData) {
        throw new Error("Brand data is required");
      }

      const response = await api.post("/brands/add", brandData);
      return response.data;
    } catch (error) {
      console.error("Error adding brand:", error);
      throw new Error("Failed to add brand");
    }
  }

  static async editBrand(brandId, brandData) {
    try {
      if (!brandId || !brandData) {
        throw new Error("Brand ID and data are required");
      }

      const response = await api.post(`/brands/edit/${brandId}`, brandData);
      return response.data;
    } catch (error) {
      console.error("Error editing brand:", error);
      throw new Error("Failed to edit brand");
    }
  }
}

class ExhibitorsService {
  static async getExhibitors() {
    try {
      const response = await api.get("/brands/exhibitor/display");
      return response.data;
    } catch (error) {
      console.error("Error fetching exhibitors:", error);
      throw new Error("Failed to fetch exhibitors");
    }
  }

  static async addExhibitor(exhibitorData) {
    try {
      if (!exhibitorData) {
        throw new Error("Exhibitor data is required");
      }

      const response = await api.post("/brands/exhibitor/add", exhibitorData);
      return response.data;
    } catch (error) {
      console.error("Error adding exhibitor:", error);
      throw new Error("Failed to add exhibitor");
    }
  }
}

export { BrandsService, ExhibitorsService };
