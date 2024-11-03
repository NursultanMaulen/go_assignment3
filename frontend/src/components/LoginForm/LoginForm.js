import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useItemContext } from "../../contexts/ItemContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login } = useItemContext();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { username, password } = values;
    const success = await login(username, password);

    if (success) {
      message.success("Login successful");
      navigate("/");
    } else {
      message.error("Login failed! Incorrect username or password.");
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
