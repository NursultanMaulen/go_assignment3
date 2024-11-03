import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:8080/register", {
        username,
        password,
      });
      message.success("Registration successful!");
      setUsername("");
      setPassword("");
    } catch (error) {
      message.error("Registration failed. Try again.");
    }
  };

  return (
    <Form>
      <Form.Item>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </Form.Item>
      <Form.Item>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleRegister}>
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
