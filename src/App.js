import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import User from './components/pages/User';
import HomePage from './components/pages/HomePage';
import Branch from './components/pages/Branch';
import Role from './components/permissions/Role';
import ProductCategory from './components/pages/ProductCategory';
import Product from './components/pages/Product';
import Vendor from './components/pages/Vendor';
import Issue from './components/pages/Issue';
import AddOrder from './components/pages/AddOrder';
import Order from './components/pages/Order';
import OrderLineItem from './components/pages/OrderLineItem';
import AddOrderLineItem from './components/pages/AddOrderLineItem';
import Login from './components/login/Login';
import Profile from './components/pages/Profile';
import Permissions from './components/permissions/Permissions';
import ProductDetailPage from './components/detailsPages/ProductDetailPage';
import OrderDetailPage from './components/detailsPages/OrderDetailPage';
import UserDetailPage from './components/detailsPages/UserDetailPage';
import VendorDetailPage from './components/detailsPages/VendorDetailPage';
import IssuedDetailPage from './components/detailsPages/IssuedDetailPage';
import Module from './components/permissions/Module';
import Error from './components/pages/Error';
import ProtectedRoute from './components/login/ProtectedRoute';
import './App.css';



const App = () => {
  return (
    <AppContent />
  );
};

const AppContent = () => {
 // const roleData = JSON.parse(localStorage.getItem('permissionData')) || [];
  // let {permissions} = useContext(AuthContext);
  // const hasPermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin');

  // const ProtectedRoute = ({ element }) => {
  //   return hasPermission ? element : <Route path='*' element={<Error/>} />;
  // };
  //const ProtectedRoute = ({ element }) => {
    //  if (permission) {
    //     return (
    //       <Route path="*" element={hasPermission ? element : <Navigate to="/login" replace />}>
    //         {/* Your protected component can go here if desired */}
    //       </Route>
    //     );
    //   }
   // };

  return (
    <div className='container-fluid p-0 m-0'>
      <Router>
        <div style={{ backgroundColor: '#ecf0f4' }}>
          <Routes>
            <Route path="/404" element={<Error/>} />
            <Route path="*" element={<Error/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/Home" element={<HomePage />} />
            {/* <Route path="/AddUser" element={<AddUser />} /> */}

            <Route
              path="/AddUser"  
                element={<ProtectedRoute element={<User/>}
                permissionKey= "user" can="add"
              />}/>

            {/* <Route path="/User" element={<User />} /> */}

            <Route
              path="/User"  
                element={<ProtectedRoute element={<User/>}
                permissionKey= "user" can="read"
              />}/>

            {/* <Route path="/user/update/:id" element={<AddUser />} /> */}

            <Route
              path="/user/update/:id"  
                element={<ProtectedRoute element={<User/>}
                permissionKey= "user" can="edit"
              />}/>


            <Route path="/branch" element={<Branch />} />
            <Route path="/role" element={<Role />} />
            <Route path="/product" element={<Product />} />
            <Route path="/productCategory" element={<ProductCategory />} />
            <Route path="/vendor" element={<Vendor />} />
            <Route path="/issue" element={<Issue />} />
            <Route path="/order" element={<Order />} />
            <Route path="/addOrder" element={<AddOrder />} />
            <Route path="/order/update/:id" element={<AddOrder />} />
            <Route path="/orderLineItem" element={<OrderLineItem />} />
            <Route path="/addOrderLineItem" element={<AddOrderLineItem />} />
            <Route path="/orderLineItem/update/:id" element={<AddOrderLineItem />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/permission"  
                element={<ProtectedRoute element={<Permissions/>}
                permissionKey= "Permission" can="read"
              />}/>
            <Route path="/productDetailPage/:id" element={<ProductDetailPage />} />
            <Route path="/orderDetailPage/:id" element={<OrderDetailPage />} />
            <Route path="/userDetailPage/:id" element={<UserDetailPage />} />
            <Route path="/vendorDetailPage/:id" element={<VendorDetailPage />} />
            <Route path="/issueDetailPage/:id" element={<IssuedDetailPage />} />
            <Route path="/modules" element={<Module />} />
            <Route path="/module/update/:id" element={<Module />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;


















  // <Route path="/role/update/:id" element={<AddRole />} /> */}
  //           {/* <Route path="/AddProductCategory" element={<AddProductCategory />} /> */}
  //           {/* <Route path="/productCategory/update/:id" element={<AddProductCategory />} /> */}
  //           {/* <Route path="/AddProduct" element={<AddProduct />} /> */}
  //           {/* <Route path="/product/update/:id" element={<AddProduct />} /> */}
  //           {/* <Route path="/AddVendor" element={<AddVendor />} /> */}
  //           {/* <Route path="/vendor/update/:id" element={<AddVendor />} /> */}
  //           {/* <Route path="/addIssue" element={<AddIssue />} /> */}
  //         <Route path="/issue/update/:id" element={<AddIssue />} /> 
  //      <Route path="/permission" element={<ProtectedRoute element={<Permissions />} />}/> */}





// <Route path="*" element={<Navigate to="/login" replace={true} />} /> 
// import React, { useContext, useEffect } from 'react';
///<Login setLoginIn={setLoginIn} />
// import Sidebar from './components/layout/Sidebar';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import User from './components/UiPages/User';
// import HomePage from './components/UiPages/HomePage';
// import Branch from './components/UiPages/Branch';
// import AddBranch from './components/UiPages/AddBranch';
// import AddUser from './components/UiPages/AddUser';
// import Role from './components/UiPages/Role';
// import AddRole from './components/UiPages/AddRole';
// import AddProductCategory from './components/UiPages/AddProductCategory';
// import ProductCategory from './components/UiPages/ProductCategory';
// import Product from './components/UiPages/Product';
// import AddProduct from './components/UiPages/AddProduct';
// import Vendor from './components/UiPages/Vendor';
// import AddVendor from './components/UiPages/AddVendor';
// import Issue from './components/UiPages/Issue';
// import AddIssue from './components/UiPages/AddIssue';
// import AddOrder from './components/UiPages/AddOrder';
// import Order from './components/UiPages/Order';
// import OrderLineItem from './components/UiPages/OrderLineItem';
// import AddOrderLineItem from './components/UiPages/AddOrderLineItem';
// import Login from './components/login/Login';
// import Header from './components/APIs/Header';
// import { LoginProvider, LoginContext } from './components/login/ContextProvider';
// import Profile from './components/UiPages/Profile';
// import Permissions from './components/UiPages/Permissions';
// import ProductDetailPage from './components/detailsPages/ProductDetailPage';
// import UserDetailPage from './components/detailsPages/UserDetailPage';
// import PrivateRoute from './components/login/PrivateRoutes';

// const App = () => {
//   return (
//     <LoginProvider>
//       <AppContent />
//     </LoginProvider>
//   );
// };

// const AppContent = () => {
//   const { loginStatus } = useContext(LoginContext);
//   const [isLoginIn, setLoginIn] = React.useState(localStorage.getItem('loginStatus'));

//   useEffect(() => {
//     setLoginIn(loginStatus);
//   }, [loginStatus]);

//   return (
//     <div className='container-fluid p-0 m-0'>
//       <Router>
//         {loginStatus ? (
//           <div style={{ display: 'flex' }}>
//             <Sidebar />
//             <div style={{ flex: 1, backgroundColor: '#ecf0f4' }}>
//               <Header isLoginIn={isLoginIn} setLoginIn={setLoginIn} />
//               <div style={{ padding: '20px' }}>
//                 <Routes>
//                   <Route path="/login" element={<Login setLoginIn={setLoginIn} isLoginIn={isLoginIn} />} />
//                   <Route path="/" element={<Navigate to="/Home" />} />
//                   <PrivateRoute path="/Home" element={<HomePage />} />
//                   <PrivateRoute path="/AddUser" element={<AddUser />} />
//                   <PrivateRoute path="/User" element={<User />} />
//                   <PrivateRoute path="/update/:id" element={<AddUser />} />
//                   <PrivateRoute path="/AddBranch" element={<AddBranch />} />
//                   <PrivateRoute path="/branch" element={<Branch />} />
//                   <PrivateRoute path="/branch/update/:id" element={<AddBranch />} />
//                   <PrivateRoute path="/role" element={<Role />} />
//                   <PrivateRoute path="/AddRole" element={<AddRole />} />
//                   <PrivateRoute path="/role/update/:id" element={<AddRole />} />
//                   <PrivateRoute path="/AddProductCategory" element={<AddProductCategory />} />
//                   <PrivateRoute path="/productCategory" element={<ProductCategory />} />
//                   <PrivateRoute path="/productCategory/update/:id" element={<AddProductCategory />} />
//                   <PrivateRoute path="/product" element={<Product />} />
//                   <PrivateRoute path="/AddProduct" element={<AddProduct />} />
//                   <PrivateRoute path="/product/update/:id" element={<AddProduct />} />
//                   <PrivateRoute path="/vendor" element={<Vendor />} />
//                   <PrivateRoute path="/AddVendor" element={<AddVendor />} />
//                   <PrivateRoute path="/vendor/update/:id" element={<AddVendor />} />
//                   <PrivateRoute path="/issue" element={<Issue />} />
//                   <PrivateRoute path="/addIssue" element={<AddIssue />} />
//                   <PrivateRoute path="/issue/update/:id" element={<AddIssue />} />
//                   <PrivateRoute path="/order" element={<Order />} />
//                   <PrivateRoute path="/addOrder" element={<AddOrder />} />
//                   <PrivateRoute path="/order/update/:id" element={<AddOrder />} />
//                   <PrivateRoute path="/orderLineItem" element={<OrderLineItem />} />
//                   <PrivateRoute path="/addOrderLineItem" element={<AddOrderLineItem />} />
//                   <PrivateRoute path="/orderLineItem/update/:id" element={<AddOrderLineItem />} />
//                   <PrivateRoute path="/profile" element={<Profile />} />
//                   <PrivateRoute path="/permission" element={<Permissions />} />
//                   <PrivateRoute path="/productDetailPage/:id" element={<ProductDetailPage />} />
//                   <PrivateRoute path="/userDetailPage/:id" element={<UserDetailPage />} />
//                 </Routes>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <Routes>
//             <Route path="/login" element={<Login setLoginIn={setLoginIn} />} />
//             <Route path="*" element={<Navigate to="/login" />} />
//           </Routes>
//         )}
//       </Router>
//     </div>
//   );
// };

// export default App;
