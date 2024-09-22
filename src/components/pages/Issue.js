import React, { useContext, useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TextField, InputAdornment } from '@mui/material';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

export default function Issue() {
  const [showAlert, setShowAlert] = useState(false);
  const [issue, setIssue] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  const [validated, setValidated] = useState(false);

  const [currentIssue, setCurrentIssue] = useState({
    id: '',
    user_id: '',
    product_id: '',
    branch_id: '',
    status: '',
    description: '',
    quantity: '',
    issue_date: ''
  }); 
  console.log(currentIssue)
  let { permissions } = useContext(AuthContext);

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getIssue();
      setIssue(result);
      setFilteredCategories(result);
    } catch (error) {
      console.error('Error fetching Issue:', error);
      setIssue([]);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filteredData = issue.filter(item =>
      item.id?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.user_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.product_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.quantity?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.issue_date?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.branch_name?.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(filteredData);
  }, [filterText, issue]);

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const branchResult = await stockManagementApis.getBranch();
        console.log('branchResult', branchResult[0]);
        setBranches(branchResult);
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };
    fetchBranchData();
  }, []);

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const productResult = await stockManagementApis.getProduct();
        setProducts(productResult);
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };
    fetchProductsData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersResult = await stockManagementApis.getAllUsers();
        setUsers(usersResult);
      } catch (error) {
        console.error('Error fetching options data:', error);
      }
    };
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        let updatedProduct;

        if (currentIssue.id) {
          await stockManagementApis.updateIssue(currentIssue.id, currentIssue);
          const product = products.find(prod => prod.id === currentIssue.product_id);
          const previousIssue = issue.find(iss => iss.id === currentIssue.id);

          const quantityDifference = currentIssue.quantity - previousIssue.quantity;
          updatedProduct = {
            ...product,
            total_issue_quantity: product.total_issue_quantity + quantityDifference
          };

          await stockManagementApis.updateProduct(product.id, updatedProduct);
          toast.success('Issue updated successfully!');
        } else {
          await stockManagementApis.addIssue(currentIssue);
          const product = products.find(prod => prod.id === currentIssue.product_id);

          updatedProduct = {
            ...product,
            total_issue_quantity: product.total_issue_quantity + currentIssue.quantity,
            total_buy_quantity: product.total_buy_quantity - currentIssue.quantity
          };
          await stockManagementApis.updateProductById(product.id, updatedProduct);
          toast.success('Issue added successfully!');
        }

        setShowModal(false);
        handleGetData();
      } catch (error) {
        console.error('Error submitting issue:', error);
        toast.error('Error submitting issue.');
      }
    }

    setValidated(true);
  };

  const handleShowModal = (issue = null) => {
    setValidated(false);
    if (issue) {
      setCurrentIssue({
        id: issue.id,
        user_id: issue.user_id,
        product_id: issue.product_id,
        branch_id: issue.branch_id,
        status: issue.status,
        description: issue.description,
        quantity: issue.quantity,
        issue_date: issue.issue_date
      });
    } else {
      // Reset to default values for adding new issue
      setCurrentIssue({
        id: '',
        user_id: '',
        product_id: '',
        branch_id: '',
        status: '',
        description: '',
        quantity: '',
        issue_date: ''
      });
    }
    setShowModal(true);
  };

  // const deleteHandle = async (id) => {
  //   try {
  //     await stockManagementApis.deleteIssue(id);
  //     toast.success('Issue deleted successfully!');
  //   } catch (error) {
  //     console.error('Error deleting issue:', error);
  //     toast.error('Error deleting issue.');
  //   }
  // };

  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');

    if (isConfirmed) {
      setIssue(prevIssues => prevIssues.filter(isu => isu.id !== id));
    } else {
      setShowAlert(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentIssue(prevIssue => ({
      ...prevIssue,
      [name]: value
    }));
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
      name: <b>User</b>, selector: row => row.user_name, sortable: true,
      cell: (row) => (
        <NavLink
          style={{ textDecoration: 'none', color: '#007bff' }}
          to={`/issueDetailPage/${row.id}`}>
          {row.user_name}
        </NavLink>
      )
    },
    { name: <b>Product</b>, selector: row => row.product_name, sortable: true, },
    { name: <b>Branch</b>, selector: row => row.branch_name, sortable: true, },
    { name: <b>Status</b>, selector: row => row.status === 'active' ? 'active' : 'inactive', sortable: true, },
    {
      name: <b>Actions</b>,
      cell: row => {
        const hasEditPermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.edit));
        const hasDeletePermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.del));

        return (
          <>
            {hasEditPermission && (
              <Button className="mx-2 btn-sm border-0" onClick={() => handleShowModal(row)}>
                <i className='fa-regular fa-edit' aria-hidden="true"></i>
              </Button>
            )}
            {hasDeletePermission && (
              <Button className="bg-danger btn-sm border-0" onClick={() => deleteHandle(row.id)}>
                <i className='fa fa-trash' aria-hidden="true"></i>
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
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Provision</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }}>
        <Container fluid className="p-3">
          <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Provision List</p>
          <hr />
          <Row>
            <Col>
              <div className="d-flex justify-content-between">
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  style={{ height: "25px" }}
                  onChange={e => setFilterText(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <i className="fa fa-search" />
                      </InputAdornment>
                    )
                  }}
                />
                {hasAddPermission && (
                  <Button className="btn-sm" style={{ height: "25px", marginTop: "" }} onClick={() => handleShowModal()}>
                    <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Provision
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <div className="table-responsive">
                <DataTable
                  columns={columns}
                  data={filteredCategories}
                  pagination
                  fixedHeader
                  fixedHeaderScrollHeight="400px"
                  highlightOnHover
                  customStyles={customStyles}
                  dense
                />
              </div>
            </Col>
          </Row>
        </Container>
      </Card>
      <Container>
        <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{currentIssue.id ? 'Update Provision' : 'Add Provision'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col lg={6}>
                  <Form.Group>
                    <Form.Label>User</Form.Label>
                    <Form.Control as="select" name="user_id" value={currentIssue.user_id} onChange={handleInputChange} required>
                      <option value="">Select User</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>{user.user_name}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select a user.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group >
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Quantity"
                      name="quantity"
                      min="0"
                      value={currentIssue.quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0 || e.target.value === '') {
                          handleInputChange(e);
                        } else {
                          e.target.disabled = true;
                          setTimeout(() => {
                            e.target.disabled = false;
                            e.target.value = currentIssue.quantity;
                          }, 500);
                        }
                      }}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter the quantity.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

              </Row>
              <Row>
                <Col lg={6}>
                  <Form.Group className='mt-3'>
                    <Form.Label>Product</Form.Label>
                    <Form.Control as="select" name="product_id" value={currentIssue.product_id} onChange={handleInputChange} required>
                      <option value="">Select Product</option>
                      {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select a product.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className='mt-3'>
                    <Form.Label>Issue Date</Form.Label>
                    <Form.Control type="date" name="issue_date" 
                      value={currentIssue.issue_date}
                      onChange={handleInputChange} required />
                    <Form.Control.Feedback type="invalid">
                      Please select an issue date.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={6}>
                  <Form.Group className='mt-3'>
                    <Form.Label>Branch</Form.Label>
                    <Form.Control as="select" name="branch_id"  
                      value={currentIssue.branch_id} 
                      onChange={handleInputChange} required>
                      <option value="">Select Branch</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select a branch.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col lg={6}>
                  <Form.Group className='mt-3'>
                    <Form.Label>Status</Form.Label>
                    <Form.Control as="select" name="status" value={currentIssue.status} onChange={handleInputChange} required>
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      Please select a status.
                    </Form.Control.Feedback>
                  </Form.Group>

                </Col>
              </Row>
              <Row>
                <Col lg={12}>
                  <Form.Group className='mt-3'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control as="textarea" placeholder='Enter a description' rows={3} name="description" value={currentIssue.description} onChange={handleInputChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                {currentIssue.id ? 'Update' : 'Add'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
      <ToastContainer />
    </Main>
  );
}
