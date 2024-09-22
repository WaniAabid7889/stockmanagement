import React, { useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form } from 'react-bootstrap'; // Import Form from react-bootstrap
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { TextField, InputAdornment } from '@mui/material';
import Main from '../layout/Main';
import { toast, ToastContainer } from 'react-toastify';

export default function Role() {
  const [showAlert, setShowAlert] = useState(false);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [newRole, setNewRole] = useState({ name: '', status: '' });
  
  const [selectedRole, setSelectedRole] = useState(null);

  const handleModalClose = () => {
    setShowModal(false);
    setIsUpdate(false);
    setNewRole({ name: '', status: '' });
  };

  const handleModalShow = () => {
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole({ ...newRole, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdate) {
        const result = await stockManagementApis.updateBranch(selectedRole.id, newRole);
        console.log('Role updated:', result);
        toast.success('role is updated successfully')
      } else {
        const result = await stockManagementApis.postRole(newRole);
        console.log('Role added:', result);
        toast.success('role is created successfully')
      }
        handleModalClose();
        handleGetData();
    } catch (error) {
        console.error(`Error ${isUpdate ? 'updating' : 'adding'} role:`, error);
        toast.error('toast is not updated'); 
      }
  };

  const handleUpdateClick = (row) => {
    setSelectedRole(row);
    console.log(row)
    setNewRole({ name: row.name, status: row.status ? 'active' : 'inactive' });
    setIsUpdate(true);
    handleModalShow();
};

  const handleGetData = async () => {
    try {
      const result = await stockManagementApis.getRoles();
      setRoles(result);
      setFilteredRoles(result);
      console.log('Roles fetched:', result);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  useEffect(() => {
    const filteredData = roles.filter(item =>
      item.name?.toLowerCase().includes(filterText.toLowerCase()) ||
      item.status.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredRoles(filteredData);
  }, [filterText, roles]);

  // const deleteHandle = async (id) => {
  //   try {
  //     await stockManagementApis.deleteRole(id);
  //     setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
  //     toast.success('role is deleted successfuly')
  //   } catch (error) {
  //     console.error('Error deleting role:', error);
  //     toast.error('role is not deleted');
  //   }
  // };


  const deleteHandle = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');
    if (isConfirmed) {
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
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
    {
      name: <b>Name</b>,
      selector: row => row.name,
      sortable: true,
    
    },
    {
      name: <b>Status</b>,
      selector: row => row.status === 'active' ? 'active' : 'inactive',
      sortable: true,
     
    },
    {
      name: <b>Actions</b>,
      cell: row => (
        <>
          <Button className='mx-2 btn-sm border-0' onClick={() => handleUpdateClick(row)}>
              <i className="fa-regular fa-edit" aria-hidden="true"></i>
          </Button>
          <Button className="bg-danger btn-sm border-0" onClick={() => deleteHandle(row.id)}>
            <i className='fa fa-trash' aria-hidden="true"></i>
          </Button>
        </>
      ),
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
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Role List</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Card style={{boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }}>
        <Container fluid className='p-3'>
          <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Role List</p>
          <hr />
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <TextField
                  id="search"
                  type="text"
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
                  <Button className='btn-sm' onClick={handleModalShow}>
                  <i className='fa fa-plus' aria-hidden='true'></i>&nbsp;Add Role
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <DataTable
                columns={columns}
                data={filteredRoles}
                pagination
                highlightOnHover
                striped
                customStyles={customStyles}
              />
            </Col>
          </Row>
        </Container>
      </Card>
      <Modal show={showModal} onHide={handleModalClose} size="lg" backdrop="static">
        <Modal.Header style={{ fontSize: "16px" }} closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {isUpdate ? 'Update Role' : 'Add Role'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Role Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={newRole.name}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      name="status"
                      value={newRole.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Container>
            <Modal.Footer>
              <Button variant="primary" type="submit">
                {isUpdate ? 'Update Role' : 'Add Role'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer/>
    </Main>
  );
}
