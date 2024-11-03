import React, { createContext, useContext, useState, useEffect } from "react";
import { getItems, createItem, updateItem, deleteItem } from "../api";
import { message } from "antd";
import axios from "axios";

const ItemContext = createContext();

export const ItemProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("jwt"));

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token]);

  const fetchItems = async () => {
    setLoading(true);
    const token = localStorage.getItem("jwt");
    try {
      const response = await getItems(token);
      setItems(response.data);
    } catch (error) {
      console.error(error);
      message.error(
        "Failed to fetch items: " +
          (error.response ? error.response.data.error : "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (name) => {
    try {
      const newItem = { name };
      await createItem(newItem, token);
      fetchItems();
      message.success("Item added successfully");
    } catch (error) {
      message.error("Failed to add item");
    }
  };

  const editItem = async (id, name) => {
    try {
      await updateItem(id, { name }, token);
      fetchItems();
      message.success("Item updated successfully");
    } catch (error) {
      message.error("Failed to update item");
    }
  };

  const removeItem = async (id) => {
    try {
      await deleteItem(id, token);
      fetchItems();
      message.success("Item deleted successfully");
    } catch (error) {
      message.error("Failed to delete item");
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://localhost:8080/login", {
        username,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("jwt", token);
      setToken(token);
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <ItemContext.Provider
      value={{
        items,
        loading,
        fetchItems,
        addItem,
        editItem,
        removeItem,
        login,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

export const useItemContext = () => useContext(ItemContext);
