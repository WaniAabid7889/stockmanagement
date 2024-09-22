import React, { useContext, useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form, ToastContainer } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TextField, InputAdornment } from '@mui/material';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';
import { toast } from 'react-toastify';
import moment from 'moment';

export default function Order() {
  const [showAlert, setShowAlert] = useState(false);
  const [order, setOrder] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [branches, setBranches] = useState([]);
  const [user, setUser] = useState([]);
  const [vendor, setVendor] = useState([]);
  const { permissions } = useContext(AuthContext);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const vendorData = await stockManagementApis.getVendor();
        setVendor(vendorData)
      } catch (error) {
        console.error('Error fetching Vendor:', error);
      }
    };
    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchData = await stockManagementApis.getBranch();
        setBranches(branchData);
      } catch (error) {
        console.error('Error fetching Branch:', error);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await stockManagementApis.getAllUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching User:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getOrder();
      setOrder(result);
      setFilteredCategories(result);
   
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrder([]);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filteredData = order.filter(item =>
      item.id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.order_number.toLowerCase().includes(filterText.toLowerCase()) ||
      item.invoice_number.toLowerCase().includes(filterText.toLowerCase()) ||
      item.order_date.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase()) ||
      item.total_amount.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user_id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.branch_id.toLowerCase().includes(filterText.toLowerCase()) ||
      item.vendor_id.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(filteredData);
  }, [filterText, order]);

  
  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');
    
    if (isConfirmed) {
      setOrder((prevOrders) => prevOrders.filter((ord) => ord.id !== id));
    } else {
      setShowAlert(true);
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };


  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      let resp = await stockManagementApis.updateOrder(selectedOrder.id, selectedOrder);
      console.log('resp',resp);
      if(resp.success){
        toast.success('Order updated successfully!');
      }else{
        toast.error('Order not updated successfully!');
      }
      handleGetData();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder({ ...selectedOrder, [name]: value });
  };

  const columns = [
    {
      name: <b>S.No.</b>,
      selector: (row, index) => index + 1,
      sortable: true,
      width: '50px',
      style: {
        borderRight: '2px solid #dee2e6',
        fontWeight: 'bold',
      }
    },
    {
      name: <b>Order Number</b>, selector: row => row.id, sortable: true,
      cell: (row, index) => (
        <NavLink
          style={{ textDecoration: 'none', color: '#007bff' }}
          to={`/orderDetailPage/${row.id}`}>
          {`Or- ${row.order_number}`}
        </NavLink>
      )
    },
    { name: <b>User</b>, selector: row => row.user_name, sortable: true },
    { name: <b>Branch</b>, selector: row => row.branch_name, sortable: true },
    { name: <b>Vendor</b>, selector: row => row.vendor_name, sortable: true},
    { name: <b>Total Amount</b>, selector: row => row.total_amount, sortable: true },
    { name: <b>Status</b>, selector: row => row.status  === 'active' ? 'active' : 'inactive', sortable: true },
    {
      name: <b>Actions</b>,
      cell: row => {
        const hasEditPermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.edit));
        const hasDeletePermission = permissions?.some(role => role.name === 'admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.del));

        return (
          <>
            {hasEditPermission && (
              <Button className="mx-2 btn-sm border-0" onClick={() => handleEditClick(row)}>
                <i className='fa-regular fa-edit' aria-hidden="true" ></i>
              </Button>
            )}
            {hasDeletePermission && (
              <Button className="bg-danger btn-sm border-0">
                <i className='fa fa-trash' aria-hidden="true" onClick={() => deleteHandle(row.id)}></i>
              </Button>
            )}
          </>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const customStyles = {
    table: {
      style: {
        textAlign: 'left'
      }
    },
    headCells: {
      style: {
        backgroundColor: '#343a40',
        color: 'white',
      }
    },
    headRow: {
      style: {
        minHeight: '30px',
      }
    },
    rows: {
      style: {
        minHeight: '34px',
      }
    },
  };

  const hasAddPermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin');

  return (
    <Main>
      <ToastContainer />
      {showAlert && (
        <div className=" alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Record was not deleted.</strong>
          <button type="button" className="close float-end" onClick={() => setShowAlert(false)} aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
      )
      }
      <div>
        <Breadcrumb>
          <Link style={{ textDecoration: "none", color: "black" }} to="/Home"> Home <i className="fa fa-angle-right"></i></Link>
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Order List</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }} >
        <Container fluid className='p-3'>
          <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Order List</p>
          <hr />
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <TextField
                  id="search"
                  type="text"
                  placeholder="Search..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fa fa-search"></i>
                      </InputAdornment>
                    ),
                  }}
                />

                <div>
                  {hasAddPermission && (
                    <Button className="btn-sm">
                      <NavLink to="/AddOrder" style={{ textDecoration: 'none', color: 'white' }}>
                        <i className='fa fa-plus' aria-hidden='true'></i>&nbsp;Add Order
                      </NavLink>
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                variant="dark"
                columns={columns}
                data={filteredCategories}
                pagination
                highlightOnHover
                striped
                customStyles={customStyles}
              />
            </Col>
          </Row>
        </Container>
      </Card>

      <Container>
        <Modal show={showModal} onHide={handleCloseModal} backdrop="static" size="lg">
          <Row>
            <Col lg={12}>
              <Modal.Header closeButton>
                <Modal.Title>Update Order</Modal.Title>
              </Modal.Header>
            </Col>
          </Row>
          <Modal.Body>
            {selectedOrder && (
              <Form onSubmit={handleUpdateOrder}>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="userName">
                      <Form.Label>User</Form.Label>
                      <Form.Select name="user_id" value={selectedOrder.user_id} onChange={handleInputChange} required>
                        <option value="">Select User</option>
                        {user.map((usr) => (
                          <option key={usr.id} value={usr.id}>{usr.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a user.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="orderNumber">
                      <Form.Label>Invoice Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="invoice Number"
                        value={selectedOrder.invoice_number}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className='mb-3'>
                      <Form.Label>Branch</Form.Label>
                      <Form.Select name="branch_id" value={selectedOrder.branch_id} onChange={handleInputChange} required>
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>{branch.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a branch.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="orderNumber">
                      <Form.Label>Order Number</Form.Label>
                      <Form.Control
                        type="text"
                        name="order_number"
                        value={selectedOrder.order_number}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="userName">
                      <Form.Label>Vendor</Form.Label>
                      <Form.Select name="vendor_id" value={selectedOrder.vendor_id} onChange={handleInputChange} required>
                        <option value="">Select Vendor</option>
                        {vendor.map((vnd) => (
                          <option key={vnd.id} value={vnd.id}>{vnd.name}</option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        Please select a vendor.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="Date">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="text"
                        name="Date"
                        value={moment(selectedOrder.order_date).format('DD-MM-YYYY')}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="status">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={selectedOrder.status}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col lg={6}>
                    <Form.Group className="mb-3" controlId="totalAmount">
                      <Form.Label>Total Amount</Form.Label>
                      <Form.Control
                        type="text"
                        name="total_amount"
                        value={selectedOrder.total_amount}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" className="float-end" type="submit">
                  Update
                </Button>
              </Form>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </Main >
  );
}
