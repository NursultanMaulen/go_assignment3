import React, { useState } from "react";
import { Tabs } from "antd";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegisterForm/RegisterForm";

const { TabPane } = Tabs;

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Login" key="login">
          <LoginForm />
        </TabPane>
        <TabPane tab="Register" key="register">
          <RegisterForm />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default AuthPage;
