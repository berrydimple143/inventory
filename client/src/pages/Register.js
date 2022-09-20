import { Form, message } from "antd";
import Input from "antd/lib/input/Input";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../resources/authentication.css";
import axios from "axios";
import Spinner from "../components/Spinner";

function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(true);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      await axios.post("/api/users/register", values);
      message.success("Registration successful.");
      setLoading(false);
    } catch (error) {
      message.error("Something went wrong");
      setLoading(false);
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
        <div className="col-md-4">
          <Form layout="vertical" onFinish={onFinish}>
            <h1>REGISTER</h1>
           
            <Form.Item label="First Name" name="firstname">
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="lastname">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input type="password" />
            </Form.Item>

            <div className="d-flex justify-content-between align-items-center">
              <Link to="/login">Already registered? Click here to login</Link>
              <button className="secondary" type="submit">
                REGISTER
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
