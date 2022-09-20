import "./App.css";
import "antd/dist/antd.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Test from "./pages/Test";
import Product from "./pages/Product";
import Category from "./pages/Category";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/test" element={<ProtectedRoute><Test /></ProtectedRoute>} />
          <Route path="/product" element={<ProtectedRoute><Product /></ProtectedRoute>} />
          <Route path="/category" element={<ProtectedRoute><Category /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}


export function ProtectedRoute(props){

  if(localStorage.getItem('inventory-user'))
  {
    return props.children
  }else{
   return <Navigate to='/login'/>
  }

}

export default App;
