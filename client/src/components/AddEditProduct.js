import React, { useState } from "react";
import { Form, Input, message, Modal, Select, InputNumber } from "antd";
import Spinner from "./Spinner";
import axios from "axios";

function AddEditProduct({
  setShowAddEditProductModal,
  showAddEditProductModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getProducts,
  categoriesData,
}) {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.post("/api/products/edit-product", {
           payload : {
            ...values,
            userid: user._id,
           },
          productId: selectedItemForEdit._id,
        });
        getProducts();
        message.success("Product updated successfully");
      } else {
        await axios.post("/api/products/add-product", {
          ...values,
          userid: user._id,
        });
        getProducts();
        message.success("Product added successfully");
      }
      setShowAddEditProductModal(false);
      setSelectedItemForEdit(null);
      setLoading(false);
    } catch (error) {
      message.error("There was an input validation error.");
      setLoading(false);
    }
  };
  return (
    <Modal
      title={selectedItemForEdit ? "Edit Product" : "Add Product"}
      visible={showAddEditProductModal}
      onCancel={() => setShowAddEditProductModal(false)}
      footer={false}
    >
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="product-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Buy Price" name="buy_price" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Sell Price" name="sell_price" rules={[{ required: true }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Category" name="category" rules={[{ required: true }]}>
          <Select>
            {" "}
            {categoriesData && categoriesData.map((item, index) => <Select.Option value={item.name} key={index}>{item.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="Stock" name="stock" rules={[{ required: true }]}>        
          <InputNumber min={0} defaultValue={0} />
        </Form.Item>
        <div className="d-flex justify-content-end">
          <button className="primary" type="submit">
            SAVE
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditProduct;
