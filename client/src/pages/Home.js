import { DatePicker, Form, message, Select, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditProduct from "../components/AddEditProduct";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/products.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;
function Home() {
  const [showAddEditProductModal, setShowAddEditProductModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [frequency, setFrequency] = useState("7");  
  const [selectedRange, setSelectedRange] = useState([]);
  const getProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));

      setLoading(true);
      const response = await axios.post(
        "/api/products/get-all-products",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
        }
      );
      setProductsData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const deleteProduct = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/products/delete-product", {
        productId: record._id,
      });
      message.success("Product deleted successfully");
      getProducts();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getProducts();
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
      title: "Buy Price",
      dataIndex: "buy_price",
    },
    {
      title: "Sell Price",
      dataIndex: "sell_price",
    },
    {
      title: "Stock",
      dataIndex: "stock",
    },
    {
      title: "Category",
      dataIndex: "category",
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
                setShowAddEditProductModal(true);
              }}
            />
            <DeleteOutlined className="mx-3" onClick={()=>deleteProduct(record)}/>
          </div>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="title-container d-flex justify-content-center align-items-center">
        <h4>List of Product</h4>
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
            onClick={() => setShowAddEditProductModal(true)}
          >
            ADD PRODUCT
          </button>
        </div>
      </div>

      <div className="table-analtics">
          <div className="table">
            <Table columns={columns} dataSource={productsData} />
          </div>        
      </div>

      {showAddEditProductModal && (
        <AddEditProduct
          showAddEditProductModal={showAddEditProductModal}
          setShowAddEditProductModal={setShowAddEditProductModal}
          selectedItemForEdit={selectedItemForEdit}
          getProducts={getProducts}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Home;
