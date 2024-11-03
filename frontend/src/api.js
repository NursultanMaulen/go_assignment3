import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const getItems = async (token) => {
  return await axios.get(`${API_URL}/items`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const createItem = async (item, token) => {
  return await axios.post(`${API_URL}/items`, item, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const updateItem = async (id, updatedItem, token) => {
  return await axios.put(`${API_URL}/items/${id}`, updatedItem, {
    headers: {
      Authorization: `${token}`,
    },
  });
};

export const deleteItem = async (id, token) => {
  return await axios.delete(`${API_URL}/items/${id}`, {
    headers: {
      Authorization: `${token}`,
    },
  });
};
