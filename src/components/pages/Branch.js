import React, { useContext, useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TextField, InputAdornment } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';

export default function Branch() {
  const [showAlert, setShowAlert] = useState(false);
  const [branch, setBranch] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [show, setShow] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    city: '',
    state: '',
    status: '',
  });
  const [validated, setValidated] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentBranchId, setCurrentBranchId] = useState(null);
  const { permissions } = useContext(AuthContext);
  const handleClose = () => {
    setShow(false);
    setNewBranch({
      name: '',
      location: '',
      city: '',
      state: '',
      status: '',
    });
    setValidated(false);
    setIsUpdate(false);
    setCurrentBranchId(null);
  };
  const handleShow = () => setShow(true);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBranch((prevState) => ({ ...prevState, 
      [name]: value === 'status' ? value === 'Active' : value,
    }));
  };


  console.log(isUpdate)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    } else {
      try {
        console.log('update data : ', isUpdate);
        if (isUpdate) {
          await stockManagementApis.updateBranch(currentBranchId, newBranch);
          toast.success('Branch updated successfully');
        } else {
          await stockManagementApis.addBranch(newBranch);
          toast.success('Branch added successfully');
        }
        handleGetData();
        handleClose();
      } catch (error) {
        console.error('Error adding/updating branch:', error);
        toast.error('Error adding/updating branch');
      }
    }
    setValidated(true);
  };

  const handleEdit = (branch) => {
    setNewBranch(branch);
    setIsUpdate(true);
    setCurrentBranchId(branch.id);
    handleShow();
  };

  const ActionColumn = ({ row, deleteHandle }) => {
    const hasEditPermission = permissions?.some(
      (role) => role.name === 'Admin' || role.name === 'Super Admin' || (role.name === 'Data Entry' && role.edit)
    );
    const hasDeletePermission = permissions?.some(
      (role) => role.name === 'Admin' || role.name === 'Super Admin' || (role.name === 'Data Entry' && role.del)
    );

    return (
      <>
        {hasEditPermission && (
          <Button className="mx-2 btn-sm border-0" onClick={() => handleEdit(row)}>
            <i className="fa-regular fa-edit" aria-hidden="true"></i>
          </Button>
        )}
        {hasDeletePermission && (
          <Button className="bg-danger btn-sm border-0" onClick={() => deleteHandle(row.id)}>
            <i className="fa fa-trash" aria-hidden="true" style={{ color: 'white' }}></i>
          </Button>
        )}
      </>
    );
  };

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getBranch();
      setBranch(result);
      setFilteredCategories(result);
      console.log('branch fetched:', result);
    } catch (error) {
      console.error('Error fetching branch:', error);
      setBranch([]);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    console.log('Branch: ', branch);
    const filteredData = branch.filter(
      item =>
        item.name.toLowerCase().includes(filterText.toLowerCase()) ||
        item.location.toLowerCase().includes(filterText.toLowerCase()) ||
        item.city.toLowerCase().includes(filterText.toLowerCase()) ||
        item.state.toLowerCase().includes(filterText.toLowerCase()) ||
        item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    console.log(filteredData);
    setFilteredCategories(filteredData);
  }, [filterText, branch]);

  
  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');
    
    if (isConfirmed) {
      setBranch((prevBranch) => prevBranch.filter((brc) => brc.id !== id));
    } else {
      setShowAlert(true);
    }
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
    { name: <b>Name</b>, selector: (row) => row.name, sortable: true, className: 'data-table-cell' },
    { name: <b>Location</b>, selector: (row) => row.location, sortable: true, className: 'data-table-cell' },
    { name: <b>City</b>, selector: (row) => row.city, sortable: true, className: 'data-table-cell' },
    { name: <b>State</b>, selector: (row) => row.state, sortable: true, className: 'data-table-cell' },
    { name: <b>Status</b>, selector: (row) => (row.status === 'active' ? 'active' : 'inactive'), sortable: true, className: 'data-table-cell' },
    {
      name: <b>Action</b>,
      cell: (row) => <ActionColumn row={row} deleteHandle={deleteHandle} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      className: 'data-table-cell',
    },
  ];

  const customStyles = {
    table: {
      style: {
        textAlign: 'left',
      },
    },
    headCells: {
      style: {
        backgroundColor: '#343a40',
        color: 'white',
      },
    },
    headRow: {
      style: {
        minHeight: '30px',
      },
    },
    rows: {
      style: {
        minHeight: '34px',
      },
    },
  };

  const hasAddPermission = permissions?.some(
    (role) => role.name === 'Admin' || role.name === 'Super Admin' || (role.name === 'Data Entry' && role.add)
  );

  return (
    <Main>
       {showAlert && (
        <div className=" alert alert-warning alert-dismissible fade show" role="alert">
          <strong>Record was not deleted.</strong>
          <button type="button" className="close float-end" onClick={() => setShowAlert(false)} aria-label="Close"><span aria-hidden="true">&times;</span></button>
        </div>
       )}
      <Container fluid>
        <ToastContainer />
        <Breadcrumb>
          <Link to="/Home" style={{ textDecoration: 'none', color: 'black' }}>
            Home <i className="fa fa-angle-right"></i>
          </Link>
          <Breadcrumb.Item active style={{ fontWeight: 'bold' }}>
            &nbsp;Branch List
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'  }}>
          <Card.Header style={{ backgroundColor: "white", height: "40px" }}>
            <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Branch List</p>
          </Card.Header>
          <Card.Body>
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
                  {hasAddPermission && (
                    <Button className="btn-sm" onClick={handleShow}>
                      <i className="fa fa-plus" aria-hidden="true"></i>&nbsp;Add Branch
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <DataTable
                  columns={columns}
                  data={filteredCategories}
                  pagination
                  customStyles={customStyles}
                  noDataComponent="No Records Found"
                />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{isUpdate ? 'Update Branch' : 'Add Branch'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={newBranch.name}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Location"
                        name="location"
                        value={newBranch.location}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a location.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        name="city"
                        value={newBranch.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a city.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="State"
                        name="state"
                        value={newBranch.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a state.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={16}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select name="status" value={newBranch.status} onChange={handleInputChange} required>
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
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                {isUpdate ? 'Update' : 'Add'} 
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
      <ToastContainer />
    </Main>
  );
}
