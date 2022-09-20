import React, { useState } from "react";
import { Form, Input, message, Modal, Select, InputNumber } from "antd";
import Spinner from "./Spinner";
import axios from "axios";

function AddEditClient({
  setShowAddEditClientModal,
  showAddEditClientModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getClients,
  clickedButton,
}) {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.post("/api/clients/edit-client", {
           payload : {
            ...values,
            userid: user._id,
           },
          clientId: selectedItemForEdit._id,
        });
        getClients();
        message.success("Client updated successfully");
      } else {
        await axios.post("/api/clients/add-client", {
          ...values,
          userid: user._id,
        });
        getClients();
        message.success("Client added successfully");
      }
      setShowAddEditClientModal(false);
      setSelectedItemForEdit(null);
      setLoading(false);
    } catch (error) {
      message.error("There was an input validation error.");
      setLoading(false);
    }
  };
  return (
    <Modal
      title={selectedItemForEdit ? "Edit Client" : "Add Client"}
      visible={showAddEditClientModal}
      onCancel={() => setShowAddEditClientModal(false)}
      footer={false}
    >
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="client-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
      >
        <Form.Item label="First Name" name="firstname" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Last Name" name="lastname" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input type="email" />
        </Form.Item>
        { clickedButton !== "edit" && (
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input type="password" />
          </Form.Item>
        )}
        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditClient;
