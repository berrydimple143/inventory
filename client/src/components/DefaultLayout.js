import React from "react";
import { Menu, Dropdown } from "antd";
import {useNavigate} from 'react-router-dom'

import "../resources/default-layout.css";
function DefaultLayout(props) {
  const user = JSON.parse(localStorage.getItem("inventory-user"));
  const navigate = useNavigate()
  const menu = (
    <Menu
      items={[
        {
          label: (
            <li onClick={()=>{
              localStorage.removeItem('inventory-user')
              navigate("/login");
            }}>Logout</li>
          ),
        }
      ]}
    />
  );
  return (
    <div className="outside-container">
      <div className="layout">
        <div className="header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="logo">Inventory Management System</h1>
          </div>        
          <div>          
              <button 
                onClick={()=>{                  
                    navigate("/product");
                  }
                } 
                className='primary'>Products</button>                
          </div>
          <div>          
              <button 
                  onClick={()=>{                  
                    navigate("/category");
                  }
                }  
                className='primary'>Categories</button>       
          </div>
          <div>          
              <button className='primary'>Clients</button>                
          </div>
          <div>
            <Dropdown overlay={menu} placement="bottomLeft">
              <button className='primary'>Welcome, {user.firstname}!</button>
            </Dropdown>
          </div>
        </div>

        <div className="content">{props.children}</div>
      </div>
    </div>
  );
}

export default DefaultLayout;
