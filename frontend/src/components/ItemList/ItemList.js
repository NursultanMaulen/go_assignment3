import React, { useEffect, useState } from "react";
import { List, Input, Button, Typography, Spin } from "antd";
import { useItemContext } from "../../contexts/ItemContext";

const { Title } = Typography;

const ItemList = () => {
  const { items, loading, fetchItems, addItem, editItem, removeItem } =
    useItemContext();
  const [newItemName, setNewItemName] = useState("");
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemName, setEditingItemName] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = () => {
    if (newItemName.trim()) {
      addItem(newItemName);
      setNewItemName("");
    }
  };

  const handleEditItem = (id, name) => {
    editItem(id, name);
    setEditingItemId(null);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Title level={2}>Item List</Title>
      {loading ? (
        <Spin tip="Loading items..." />
      ) : (
        <List
          bordered
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                editingItemId === item.id ? (
                  <>
                    <Button
                      type="link"
                      onClick={() => handleEditItem(item.id, editingItemName)}
                    >
                      Save
                    </Button>
                    <Button type="link" onClick={() => setEditingItemId(null)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="link"
                      onClick={() => {
                        setEditingItemId(item.id);
                        setEditingItemName(item.name);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={() => removeItem(item.id)}
                    >
                      Delete
                    </Button>
                  </>
                ),
              ]}
            >
              {editingItemId === item.id ? (
                <Input
                  value={editingItemName}
                  onChange={(e) => setEditingItemName(e.target.value)}
                />
              ) : (
                item.name
              )}
            </List.Item>
          )}
        />
      )}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <Input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          onClick={handleAddItem}
          disabled={!newItemName.trim()}
        >
          Add Item
        </Button>
      </div>
    </div>
  );
};

export default ItemList;
