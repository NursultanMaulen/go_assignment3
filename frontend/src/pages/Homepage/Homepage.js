import React from "react";
import { Button, Typography, Layout } from "antd";
import ItemList from "../../components/ItemList/ItemList";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Home = ({ tasks, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          backgroundColor: "purple",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title style={{ color: "#fff", margin: "10px" }} level={2}>
          ITEM MANAGER
        </Title>
        <Button type="primary" onClick={handleLoginClick}>
          Login
        </Button>
      </Header>
      <Content style={{ padding: "20px", backgroundColor: "#f0f2f5" }}>
        <div
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ItemList />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <p style={{ margin: 0 }}>
          © 2024 ITEM MANAGER by NURS. All rights reserved.
        </p>
      </Footer>
    </Layout>
  );
};

export default Home;
