import React, { useState } from "react";
import { Form, Input, message, Modal, Select, InputNumber } from "antd";
import Spinner from "./Spinner";
import axios from "axios";

function AddEditCategory({
  setShowAddEditCategoryModal,
  showAddEditCategoryModal,
  selectedItemForEdit,
  setSelectedItemForEdit,
  getCategories,
}) {
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));
      setLoading(true);
      if (selectedItemForEdit) {
        await axios.post("/api/categories/edit-category", {
           payload : {
            ...values,
            userid: user._id,
           },
          categoryId: selectedItemForEdit._id,
        });
        getCategories();
        message.success("Category updated successfully");
      } else {
        await axios.post("/api/categories/add-category", {
          ...values,
          userid: user._id,
        });
        getCategories();
        message.success("Category added successfully");
      }
      setShowAddEditCategoryModal(false);
      setSelectedItemForEdit(null);
      setLoading(false);
    } catch (error) {
      message.error("There was an input validation error.");
      setLoading(false);
    }
  };
  return (
    <Modal
      title={selectedItemForEdit ? "Edit Category" : "Add Category"}
      visible={showAddEditCategoryModal}
      onCancel={() => setShowAddEditCategoryModal(false)}
      footer={false}
    >
      {loading && <Spinner />}
      <Form
        layout="vertical"
        className="category-form"
        onFinish={onFinish}
        initialValues={selectedItemForEdit}
      >
        <Form.Item label="Name *" name="name">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input type="text" />
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

export default AddEditCategory;
