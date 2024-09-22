import axios from '../../utils/Helper';
const stockManagementApis = {

  //user aips
  getUser: async () => {
    const response = await fetch('http://localhost:3001/auth');
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetch('http://localhost:3001/auth/getAllUsers');
    return response.json();

  },

  getloginUser: async (email, password) => {
    const response = await fetch(`http://localhost:3001/auth/${email}/${password}`);
    return response.json();
  },

  getAllUser: async (token) => {
    try {
      const response = await axios.get('/auth');
      return response.data;
    } catch (error) {
      console.error('Error fetching protected data:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    const response = await fetch(`http://localhost:3001/auth/${id}`);
    return response.json();
  },

  createUser: async (user) => {
    const response = await fetch('http://localhost:3001/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return response.json();
    
  },

  updateUser: async (id, user) => {
    const response = await fetch(`http://localhost:3001/auth/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    return await response.json();
  },

  deleteUserById: async (userId) => {
    const response = await fetch(`http://localhost:3001/auth/delete/${userId}`, {
      method: 'DELETE'
    });
    return response.status;
  },



  // branch apis
  getBranch: async () => {
    const response = await fetch('http://localhost:3001/branch');
    return await response.json();
  },
  getBranchById: async (id) => {
    const response = await fetch('http://localhost:3001/branch/' + id);
    return await response.json();
  },
  addBranch: async (branch) => {
    console.log("branch=>", branch);
    const response = await fetch('http://localhost:3001/branch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(branch)
    });
    return await response.json();
  },

  updateBranch: async (id, branch) => {
    const response = await fetch(`http://localhost:3001/branch/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(branch)
    });
    return await response.json();
  },

  deleteBranch: async (branchId) => {
    console.log(branchId);
    const response = await fetch(`http://localhost:3001/branch/delete/${branchId}`, {
      method: 'DELETE'
    });
    return response.status;
  },

  //role apis
  getRoles: async () => {
    const response = await fetch('http://localhost:3001/role', { method: 'GET' });
    return await response.json();
  },

  getRoleById: async (id) => {
    const response = await fetch('http://localhost:3001/role/' + id, { method: 'GET' });
    return await response.json();
  },

  getRoleByName: async (name) => {
    const response = await fetch('http://localhost:3001/role/' + name, { method: 'GET' });
    return await response.json();
  },

  putRole: async (id, role) => {
    const response = await fetch(`http://localhost:3001/role/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    });
    return await response.json();
  },

  deleteRole: async (roleId) => {
    const response = await fetch(`http://localhost:3001/role/delete/${roleId}`, {
      method: 'DELETE'
    });
    return response.status;
  },

  postRole: async (role) => {
    const response = await fetch('http://localhost:3001/role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(role)
    });
    return await response.json();
  },

  //product category   
  getProductCategory: async () => {
    const response = await fetch('http://localhost:3001/productCategory');
    return await response.json();
  },
  getProductCategoryById: async (id) => {
    const response = await fetch('http://localhost:3001/productCategory/' + id);
    return await response.json();
  },
  addProductCategory: async (productCategory) => {
    console.log("productCategory=>", productCategory);
    const response = await fetch('http://localhost:3001/productCategory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productCategory)
    });
    const data = await response.json();
    console.log(data);
  },
  updateProductCategory: async (id, productCategory) => {
    console.log("id=>", id);
    console.log("productCategory=>", productCategory);
    const response = await fetch(`http://localhost:3001/productCategory/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productCategory)
    });
    return await response.json();
  },
  deleteProductCategory: async (productCategoryId) => {
    console.log('deleteProductCategory called', productCategoryId);
    const response = await fetch(`http://localhost:3001/productCategory/delete/${productCategoryId}`, {
      method: 'DELETE'
    });
    return response.status;
  },


  //product apis
  getProduct: async () => {
    const response = await fetch('http://localhost:3001/product');
    return await response.json();
  },

  getProductById: async (id) => {
    const response = await fetch('http://localhost:3001/product/' + id);
    return await response.json();
  },

  addProduct: async (product) => {
    console.log("product=>", product);
    const response = await fetch('http://localhost:3001/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    const data = await response.json();
    console.log(data);
  },

  updateStock: async (id,product) => {
    console.log("id=>", id);
    console.log("product=>", product);
    const response = await fetch(`http://localhost:3001/product/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    return await response.json();
  },

  updateProduct: async (id, product) => {
    console.log("id=>", id);
    console.log("product=>", product);
    const response = await fetch(`http://localhost:3001/product/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    return await response.json();
  },

  updateProductById: async (id, product) => {
    console.log("id=>", id);
    console.log("product=>", product);
    const response = await fetch(`http://localhost:3001/product/updateProduct/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
    return response.json();
  },

  deleteProduct: async (productId) => {
    const response = await fetch(`http://localhost:3001/product/delete/${productId}`, {
      method: 'DELETE'
    });
    return response.status;
  },


  //vendor apis
  getVendor: async () => {
    const response = await fetch('http://localhost:3001/vendor');
    // console.log(response);
    return await response.json();
  },

  getVendorById: async (id) => {
    console.log('id=>', id);
    const response = await fetch('http://localhost:3001/vendor/' + id);
    return await response.json();
  },

  addVendor: async (vendor) => {
    const response = await fetch('http://localhost:3001/vendor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vendor)
    });
    const data = await response.json();
    console.log(data);
  },

  updateVendor: async (id, vendor) => {
    const response = await fetch(`http://localhost:3001/vendor/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(vendor)
    });
    return await response.json();
  },

  deleteVendor: async (vendorId) => {
    const response = await fetch(`http://localhost:3001/vendor/delete/${vendorId}`, {
      method: 'DELETE'
    });
    return response.status;
  },


  //issue apis
  getIssue: async () => {
    const response = await fetch('http://localhost:3001/issue');
    return await response.json();
  },

  getIssueById: async (id) => {
    const response = await fetch('http://localhost:3001/issue/' + id);
    return await response.json();
  },

  addIssue: async (issue) => {
    const response = await fetch('http://localhost:3001/issue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    });
    return await response.json();  
  },

  updateIssueQuantity : async (id, issue) => {
      console.log('updateIssueQuantity', id, issue);
      const response = await fetch(`http://localhost:3001/issue/updateQuantity/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    });
    return await response.json();
  },

  updateIssue : async (id, issue) => {
    console.log('updateIssue', id, issue);
    const response = await fetch(`http://localhost:3001/issue/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issue)
    });
      const responseData = await response.json(); 
      console.log('response', responseData);
      return responseData;
  },

  deleteIssue : async (id) => {
    const response = await fetch(`http://localhost:3001/issue/delete/${id}`, {
      method: 'DELETE'
    });
    return response.status;
  },


  //order apis
  getOrder: async () => {
    const response = await fetch('http://localhost:3001/order');
    return await response.json();
  },

  getOrderById: async (id) => {
    // console.log('getOrderById', id);
    const response = await fetch(`http://localhost:3001/order/${id}`);
    return await response.json();
  },

  getOrderByUserId: async (userId) => {
    // console.log('userId=>', userId);
    const response = await fetch('http://localhost:3001/order/user/' + userId);
    return await response.json();
  },

  AddOrder: async (order) => {
    console.log("response data=>", order);
    const response = await fetch('http://localhost:3001/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return await response.json();
  },

  updateOrder: async (id, order) => {
    const response = await fetch(`http://localhost:3001/order/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });
    return await response.json();
  },

  deleteOrder: async (orderId) => {
    const response = await fetch(`http://localhost:3001/order/delete/${orderId}`, {
      method: 'DELETE'
    });
    return response.status;
  },


  //order_line_item apis
  getOrderLineItem: async () => {
    const response = await fetch('http://localhost:3001/orderlineitem');
    return await response.json();
  },

  getOrderLineItemById: async (id) => {
    const response = await fetch('http://localhost:3001/orderlineitem/' + id);
    return await response.json();
  },

  AddOrderLineItem: async (item) => {
    const response = await fetch('http://localhost:3001/orderlineItem',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    });
    console.log(response.json());
    return await response.json();

   },

   updateOrderLineItemQuantity: async (id, orderLineItem) => {
      const response = await fetch(`http://localhost:3001/orderlineitem/updateQuantity/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type' : 'application/json'
        },
        body : JSON.stringify(orderLineItem)
    });
      return await response.json();
   },

  updateOrderLineItem: async (id, orderLineItem) => {
    console.log("lineitemdata =>",id, orderLineItem);
    const response = await fetch(`http://localhost:3001/orderlineitem/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderLineItem)
    });
    return await response.json();
  },

  deleteOrderLineItem: async (orderLineItemId) => {
    const response = await fetch(`http://localhost:3001/orderlineitem/delete/${orderLineItemId}`, {
      method: 'DELETE'
    });
    return response.status;
  },

  //permissions apis

  getPermission: async () => {
    const response = await fetch('http://localhost:3001/permission');

    return await response.json();
  },

  getPermissionById: async (id) => {
    const response = await fetch('http://localhost:3001/permission/' + id);
    return await response.json();
  },

  updatePermission: async (id, permission) => {

    const response = await fetch(`http://localhost:3001/permission/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(permission)
    });
    return await response.json();
  },

  getPermissionByRoleId: async (id) => {
    console.log("roleId=>", id);
    const response = await fetch(`http://localhost:3001/permission/roles/${id}`);

    return await response.json();
  },

  getPermissionByRoleIdAndModuleId: async ({ roleId, moduleId }) => {
    console.log("roleId=> moduleId", roleId, moduleId);
    const response = await fetch(`http://localhost:3001/permission/roleId/${roleId}/moduleId/${moduleId}`);
    return await response.json();
  },

  createPermission: async (permission) => {
    console.log("response data=>", permission);
    const response = await fetch('http://localhost:3001/permission/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(permission)
    });
    const data = await response.json();
    console.log(data);
  },

  getPermissionByUserId: async (email, password) => {
    const response = await fetch(`http://localhost:3001/permission/${email}/${password}`);
    return await response.json();
  },


  //module apis

  getModule: async () => {
    const response = await fetch('http://localhost:3001/module');
    return await response.json();
  },

  getModuleById: async (id) => {
    const response = await fetch('http://localhost:3001/module/' + id);
    return await response.json();
  },

  updateModule: async (id, module) => {
    const response = await fetch(`http://localhost:3001/module/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(module)
    });
    return await response.json();
  },

  postModule: async (module) => {
    console.log("response data=>", module);
    const response = await fetch('http://localhost:3001/module', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(module)
    });
    const data = await response.json();
    console.log(data);
  },

  // return apis 

  getReturnAll : async()=>{
    const response = await fetch('http://localhost:3001/return/all');
    return await response.json();
  },

  getReturn: async () => {
    const response = await fetch('http://localhost:3001/return');
    return await response.json();
  },

  getReturnByOrderId: async (id) => {
    const response = await fetch(`http://localhost:3001/return/orderId/${id}`);
    return await response.json();
  },

  getReturnById: async (id) => {
    const response = await fetch('http://localhost:3001/return/' + id);
    return await response.json();
  },

  updateReturn: async (id,data) => {
    console.log("updateReturnData", data);
    const response = await fetch(`http://localhost:3001/return/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(data)
    });
    return await response.json();
  },

  addReturn : async(data)=>{
    console.log("Return Data ---> ", data);
    const response = await fetch('http://localhost:3001/return', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body : JSON.stringify(data)
    });
    return await response.json();
  }
};
export default stockManagementApis;