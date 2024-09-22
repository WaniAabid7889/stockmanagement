import React, { useContext, useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Modal, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TextField, InputAdornment } from '@mui/material';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function ProductCategory() {
  const [showAlert, setShowAlert] = useState(false);
  const [productCategory, setProductCategory] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', status: '' });
  const { permissions } = useContext(AuthContext);

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getProductCategory();
      setProductCategory(result);
      setFilteredCategories(result);
      console.log('product category fetched:', result);
    } catch (error) {
      console.error('Error fetching product category:', error);
      setProductCategory([]);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filteredData = productCategory.filter(item =>
      item.name.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredCategories(filteredData);
  }, [filterText, productCategory]);

  // const deleteHandle = async (id) => {
  //   try {
  //     await stockManagementApis.deleteProductCategory(id);
  //     console.log('product category deleted:', id);
  //     handleGetData();
  //     toast.success('Product category deleted successfully');
  //   } catch (error) {
  //     console.error('Error deleting product category:', error);
  //     toast.error('Error deleting product category');
  //   }
  // };

  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');

    if (isConfirmed) {
      setProductCategory((prevProd) => prevProd.filter((prd) => prd.id !== id));
    } else {
      setShowAlert(true);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentCategory(null);
    setNewCategory({ name: '', status: '' });
  };

  const handleModalShow = (mode, category = null) => {
    setModalMode(mode);
    if (mode === 'edit' && category) {
      setCurrentCategory(category);
      setNewCategory({ name: category.name, status: category.status });
    } else {
      setNewCategory({ name: '', status: '' });
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    try {
      if (modalMode === 'edit' && currentCategory) {
          console.log('updated category',currentCategory);
        await stockManagementApis.updateProductCategory(currentCategory.id, newCategory);
        console.log('Category updated:', newCategory);
        toast.success('Product category updated successfully');
      } else {
        await stockManagementApis.addProductCategory(newCategory);
        console.log('New category added:', newCategory);
        toast.success('Product category added successfully');
      }
      handleGetData();
      handleModalClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Error saving category');
    }
  };

  const columns = [
    {
      name: <b>S.No.</b>, selector: (row, index) => index + 1, sortable: true, width: '50px', style: { borderRight: '2px solid #dee2e6', fontWeight: 'bold', }
    },
    {
      name: <b>Name</b>, selector: row => row.name, sortable: true,
    },
    {
      name: <b>Category Status</b>, selector: row => row.status === 'active' ? 'active' : 'inactive', sortable: true,
    },
    {
      name: <b>Action</b>,
      cell: row => {
        const hasEditPermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.edit));
        const hasDeletePermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin' || (role.name !== 'Data Entry' && role.delete));
        return (
          <> { hasEditPermission && (
              <Button className='mx-2 btn-sm border-0' onClick={() => handleModalShow('edit', row)}>
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
      },
      ignoreRowClick: true, allowOverflow: true, button: true, center: true,
    }
  ];

  const customStyles = {
    table: { style: { textAlign: 'left' } },
    headCells: { style: { backgroundColor: '#343a40', color: 'white', } },
    headRow: { style: { minHeight: '30px', }},
    rows: { style: { minHeight: '34px',} },};


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
      <ToastContainer />
      <div>
        <Breadcrumb>
          <Link style={{ textDecoration: "none", color: "black" }} to="/Home"> Home <i className="fa fa-angle-right"></i></Link>
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Product Category List</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'}}>
        <Container fluid className='p-3'>
          <p style={{ fontWeight: 'bold', fontSize: "16px" }}>Product Category List</p>
          <hr />
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-1">
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
                <div className='d-flex'>
                  {hasAddPermission && (
                    <Button className='btn-sm' onClick={() => handleModalShow('add')}>
                      <i className='fa fa-plus' aria-hidden='true'></i>&nbsp;Add Category
                    </Button>
                  )}
                </div>
              </div>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <DataTable
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

      <Modal show={showModal} onHide={handleModalClose} backdrop="static">
        <Form onSubmit={handleSaveCategory}>
          <Modal.Header closeButton>
            <Modal.Title>{modalMode === 'edit' ? 'Update Product Category' : 'Add Product Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className='container'>
              <Row>
                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Category Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter category name"
                      name="name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please enter a name.
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className='mb-3'>
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="status" value={newCategory.status} onChange={handleInputChange} required>
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
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === 'edit' ? 'Update' : 'Add'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Main>
  );
}
