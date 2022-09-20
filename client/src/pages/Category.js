import { DatePicker, Form, message, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditCategory from "../components/AddEditCategory";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/categories.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;
function Category() {
  const [showAddEditCategoryModal, setShowAddEditCategoryModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [frequency, setFrequency] = useState("7");  
  const [selectedRange, setSelectedRange] = useState([]);
  const getCategories = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));

      setLoading(true);
      const response = await axios.post(
        "/api/categories/get-all-categories",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
        }
      );
      setCategoriesData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const deleteCategory = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/categories/delete-category", {
        categoryId: record._id,
      });
      message.success("Category deleted successfully");
      getCategories();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getCategories();
  }, [frequency, selectedRange]);

  const columns = [
    {
      title: "Date Created",
      dataIndex: "createdAt",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div>
            <EditOutlined
              onClick={() => {
                setSelectedItemForEdit(record);
                setShowAddEditCategoryModal(true);
              }}
            />
            <DeleteOutlined className="mx-3" onClick={()=>deleteCategory(record)}/>
          </div>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="title-container d-flex justify-content-center align-items-center">
        <h4>List of Category</h4>
      </div>
      <div className="filter d-flex justify-content-between align-items-center">
        <div className="d-flex">
          <div className="d-flex flex-column">
            <h6>Select Frequency</h6>
            <Select value={frequency} onChange={(value) => setFrequency(value)}>
              <Select.Option value="7">Last 1 Week</Select.Option>
              <Select.Option value="30">Last 1 Month</Select.Option>
              <Select.Option value="365">Last 1 Year</Select.Option>
              <Select.Option value="custom">Custom</Select.Option>
            </Select>

            {frequency === "custom" && (
              <div className="mt-2">
                <RangePicker
                  value={selectedRange}
                  onChange={(values) => setSelectedRange(values)}
                />
              </div>
            )}
          </div>          
        </div>

        <div className="d-flex">          
          <button
            className="primary"
            onClick={() => setShowAddEditCategoryModal(true)}
          >
            ADD CATEGORY
          </button>
        </div>
      </div>

      <div className="table-analtics">
          <div className="table">
            <Table columns={columns} dataSource={categoriesData} />
          </div>        
      </div>

      {showAddEditCategoryModal && (
        <AddEditCategory
          showAddEditCategoryModal={showAddEditCategoryModal}
          setShowAddEditCategoryModal={setShowAddEditCategoryModal}
          selectedItemForEdit={selectedItemForEdit}
          getCategories={getCategories}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Category;
