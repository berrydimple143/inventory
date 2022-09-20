import { DatePicker, Form, message, Select, Table, Popconfirm } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import AddEditClient from "../components/AddEditClient";
import DefaultLayout from "../components/DefaultLayout";
import Spinner from "../components/Spinner";
import "../resources/clients.css";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
const { RangePicker } = DatePicker;
function Client() {
  const [showAddEditClientModal, setShowAddEditClientModal] = useState(false);
  const [selectedItemForEdit, setSelectedItemForEdit] = useState(null);  
  const [loading, setLoading] = useState(false);
  const [clientsData, setClientsData] = useState([]);
  const [frequency, setFrequency] = useState("7");  
  const [selectedRange, setSelectedRange] = useState([]);  
  const [clickedButton, setClickedButton] = useState('');
  const [deleteItem, setDeleteItem] = useState(null);

  const confirm = (e) => {
    deleteClient(deleteItem);    
  };

  const cancel = (e) => {
    setDeleteItem(null);
  };

  const getClients = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("inventory-user"));

      setLoading(true);
      const response = await axios.post(
        "/api/clients/get-all-clients",
        {
          userid: user._id,
          frequency,
          ...(frequency === "custom" && { selectedRange }),
        }
      );
      setClientsData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  const deleteClient = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/clients/delete-client", {
        clientId: record._id,
      });
      message.success("Client deleted successfully");
      getClients();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };
  useEffect(() => {
    getClients();
  }, [frequency, selectedRange]);

  const columns = [
    {
      title: "Date Added",
      dataIndex: "createdAt",
      render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
    },
    {
      title: "First Name",
      dataIndex: "firstname",
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
    },
    {
      title: "Email",
      dataIndex: "email",
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
                setShowAddEditClientModal(true);
                setClickedButton('edit');
              }}
            />
            <Popconfirm
              title="Are you sure to delete this client?"
              onConfirm={confirm}
              onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <DeleteOutlined className="mx-3" onClick={()=>setDeleteItem(record)} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <DefaultLayout>
      {loading && <Spinner />}
      <div className="title-container d-flex justify-content-center align-items-center">
        <h4>List of Client</h4>
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
            onClick={() => setShowAddEditClientModal(true)}
          >
            ADD CLIENT
          </button>
        </div>
      </div>

      <div className="table-analtics">
          <div className="table">
            <Table columns={columns} dataSource={clientsData} />
          </div>        
      </div>

      {showAddEditClientModal && (
        <AddEditClient
          showAddEditClientModal={showAddEditClientModal}
          setShowAddEditClientModal={setShowAddEditClientModal}
          selectedItemForEdit={selectedItemForEdit}
          getClients={getClients}
          clickedButton={clickedButton}
          setSelectedItemForEdit={setSelectedItemForEdit}
        />
      )}
    </DefaultLayout>
  );
}

export default Client;
