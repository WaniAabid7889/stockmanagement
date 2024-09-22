import React, { useContext, useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { InputAdornment, TextField } from '@mui/material';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Product() {
  const [showAlert, setShowAlert] = useState(false);
  const [product, setProduct] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    description: '',
    category_id: '',
    total_buy_quantity: '',
    total_issue_quantity: '',
    status: ''
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const [category, setCategory] = useState([]);

  const { permissions } = useContext(AuthContext);

  const hasEditPermission = permissions?.some(role =>
    (role.name === 'Admin' || role.name === 'Super Admin') || (role.name !== 'Data Entry' && role.edit)
  );
  const hasDeletePermission = permissions?.some(role =>
    (role.name === 'Admin' || role.name === 'Super Admin') || (role.name !== 'Data Entry' && role.del)
  );

  const ActionColumn = ({ row, deleteHandle }) => {
    return (
      <>
        {hasEditPermission && (
          <Button className='mx-2 btn-sm border-0' onClick={() => handleEditProduct(row)}>
            <i className="fa-regular fa-edit" aria-hidden="true"></i>
          </Button>
        )}
        {hasDeletePermission && (
          <Button className='bg-danger btn-sm border-0' onClick={() => deleteHandle(row.id)}>
            <i className="fa fa-trash" aria-hidden="true" style={{ color: "white" }}></i>
          </Button>
        )}
      </>
    );
  };

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getProduct();
      setProduct(result);
      setFilteredProduct(result);
      console.log('product fetched:', result);
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct([]);
    }
  };

  const handleGetCategories = async () => {
    try {
      const result = await stockManagementApis.getProductCategory();
      setCategory(result);
      console.log('categories fetched:', result);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    handleGetData();
    handleGetCategories();
  }, []);

  useEffect(() => {
    const filteredData = product.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.category_name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.description.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredProduct(filteredData);
  }, [filterText, product]);

  // const deleteHandle = async (id) => {
  //   try {
  //     await stockManagementApis.deleteProduct(id);
  //     console.log('product deleted:', id);
  //     handleGetData();
  //     toast.success('Product deleted successfully');
  //   } catch (error) {
  //     console.error('Error deleting product:', error);
  //     toast.error('Error deleting product');
  //   }
  // };

  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');

    if (isConfirmed) {
      setProduct((prevProd) => prevProd.filter((prd) => prd.id !== id));
    } else {
      setShowAlert(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleModalClose = () => {
    setShowModal(false);
    setValidated(false);
    setNewProduct({
      id: '',
      name: '',
      description: '',
      category_id: '',
      total_buy_quantity: '',
      total_issue_quantity: '',
      status: ''
    });
  };


  const handleEditProduct = (product) => {
    setNewProduct(product);
    setIsUpdate(true);
    setShowModal(true);
  };

  const handleAddProduct = () => {
    setIsUpdate(false);
    setShowModal(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);

    if (e.currentTarget.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      if (isUpdate) {
        const updatedProduct = {
          ...newProduct,
          total_buy_quantity: parseInt(newProduct.total_buy_quantity),
        };
        let resp = await stockManagementApis.updateProduct(newProduct.id, updatedProduct);
        console.log('product updated:', updatedProduct, resp);

        if(resp.success){
          toast.success('Product updated successfully');
        }else{
          toast.error('Product not updated successfully');
        }
      } else {
        const newProductData = {
          ...newProduct,
          total_buy_quantity: parseInt(newProduct.total_buy_quantity) - parseInt(newProduct.total_issue_quantity),
        };
        await stockManagementApis.addProduct(newProductData);
        console.log('product added:', newProductData);
        toast.success('Product added successfully');
      }
      handleModalClose();
      handleGetData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product');
    }
  };

  const columns = [
    {
      name: <b>S.No.</b>, selector: (row, index) => index + 1, sortable: true, width: '50px', style: { borderRight: '2px solid #dee2e6', fontWeight: 'bold', }
    },
    {
      name: <b>Name</b>, selector: row => row.name, sortable: true,
      cell: (row) => (
        <NavLink style={{ textDecoration: 'none', color: '#007bff' }} to={`/productDetailPage/${row.id}`}>
          {row.name}
        </NavLink>
      )
    },
    {
      name: <b>Category</b>, selector: row => row.category_name, sortable: true,
    },
    {
      name: <b>Status</b>, selector: row => row.status === 'active' ? 'active' : 'inactive', sortable: true,
    },
    {
      name: <b>Action</b>,
      cell: row => <ActionColumn row={row} deleteHandle={deleteHandle} />, ignoreRowClick: true, allowOverflow: true, button: true
    }
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
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Product</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }}>
        <Container fluid className='p-3'>
          <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Product List</p>
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
                <div className="d-flex">
                  <Button className="btn-sm" onClick={handleAddProduct}>
                    <i className='fa fa-plus' aria-hidden='true'></i>&nbsp;Add Product
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                columns={columns}
                data={filteredProduct}
                pagination
                highlightOnHover
                striped
                customStyles={customStyles}
              />
            </Col>
          </Row>

          <Modal show={showModal} onHide={handleModalClose} backdrop="static" size="lg">
            <Form noValidate validated={validated} onSubmit={onSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>{isUpdate ? 'Update Product' : 'Add Product'}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Container>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          name="name"
                          value={newProduct.name}
                          onChange={handleInputChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter a name.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category_id" value={newProduct.category_id} onChange={handleInputChange} required>
                          <option value="">Select Category</option>
                          {category.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select a category.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Buy Quantity</Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Buy Quantity"
                          name="total_buy_quantity"
                          min="0"
                          value={newProduct.total_buy_quantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (value >= 0 || e.target.value === '') {
                              handleInputChange(e);
                            } else {
                              e.target.disabled = true;
                              setTimeout(() => {
                                e.target.disabled = false;
                                e.target.value = '';
                              }, 500);
                            }
                          }}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Please enter the buy quantity.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>


                    <Col md={6}>
                      <Form.Group className='mb-3'>
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={newProduct.status} onChange={handleInputChange} required>
                          <option value="">Select Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Please select a status.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>

                      <Form.Group className='mb-3'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={newProduct.description}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Container>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
                <Button variant="primary" type="submit">
                  {isUpdate ? 'Update' : 'Add'}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>
          <ToastContainer />
        </Container>
      </Card>
    </Main>
  );
}

