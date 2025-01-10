import axios from "axios";

const api = axios.create({
  baseURL: "https://admin.thetoyfair.eu/api",
});

export const getBrands = async () => {
  const response = await api.get("/brands");
  console.log("getBrands", response?.data);
  return response?.data?.data || [];
};

export const searchBrands = async (params) => {
  console.log("searchBrands", params);
  const response = await api.get("/brands/search", { params });
  console.log("searchBrands", response?.data);
  return response.data.brands;
};

export const addBrand = async (brandData) => {
  const response = await api.post("/brands/add", brandData);
  return response.data;
};

export const editBrand = async (brandId, brandData) => {
  const response = await api.post(`/brands/edit/${brandId}`, brandData);
  return response.data;
};

export const getExhibitors = async () => {
  const response = await api.get("/brands/exhibitor/display");
  return response.data;
};

export const addExhibitor = async (exhibitorData) => {
  const response = await api.post("/brands/exhibitor/add", exhibitorData);
  return response.data;
};
