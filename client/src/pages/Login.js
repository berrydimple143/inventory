import { Form, message } from "antd";
import Input from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../resources/authentication.css";
import axios from "axios";
import Spinner from "../components/Spinner";

function Login() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", values);
      localStorage.setItem(
        "inventory-user",
        JSON.stringify({ ...response.data, password: "" })
      );
      setLoading(false);
      message.success("Login successful.");
      navigate("/");
    } catch (error) {
      setLoading(false);
      message.error("Login failed.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("inventory-user")) {
      navigate("/");
    }
  }, []);

  return (
    <div className="register">
      {loading && <Spinner />}      
      <div className="row justify-content-center align-items-center w-100 h-100">   
        <div className="col-md-12">
          <h2 className="text-center">Inventory Management System</h2>
        </div>
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>Login</h1>    

            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <em>Please login with your credentials.</em>
              <button className="secondary" type="submit">
                LOGIN
              </button>
            </div>
          </Form>
        </div>
        <div className="col-md-5">
          <div className="lottie">          
            <lottie-player
              src="https://assets4.lottiefiles.com/packages/lf20_w52qjn69.json"
              background="transparent"
              speed="1"
              loop
              autoplay
            ></lottie-player>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
