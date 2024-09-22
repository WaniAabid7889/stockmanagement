import React, { useEffect, useState } from 'react';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Card, Breadcrumb, Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Main from '../layout/Main';
import { Link } from 'react-router-dom';
import { TextField, InputAdornment } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Sidebar.css';
import '../../App.css';

export default function Module() {
    const [showAlert, setShowAlert] = useState(false);
    const [modules, setModules] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredModules, setFilteredModules] = useState([]);
    const [newModule, setNewModule] = useState({ name: '', status: '' });
    const [showModal, setShowModal] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedModule, setSelectedModule] = useState(null);

    const handleGetData = async () => {
        try {
            const result = await stockManagementApis.getModule();
            setModules(result);
            console.log('Modules fetched:', result);
        } catch (error) {
            console.error('Error fetching modules:', error);
            setModules([]);
        }
    };

    useEffect(() => {
        handleGetData();
    }, []);

    const handleModalClose = () => {
        setShowModal(false);
        setNewModule({ name: '', status: '' });
        setIsUpdate(false);
        setSelectedModule(null);
    };

    const handleModalShow = () => {
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewModule({ ...newModule, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isUpdate) {
                const result = await stockManagementApis.updateModule(selectedModule.id, newModule);
                console.log('Module updated:', result);
                toast.success('Module updated successfully!');
            } else {
                const result = await stockManagementApis.addModule(newModule);
                console.log('Module added:', result);
                toast.success('Module added successfully!');
            }
            handleModalClose();
            handleGetData();
        } catch (error) {
            console.error(`Error ${isUpdate ? 'updating' : 'adding'} module:`, error);
            toast.error(`Error ${isUpdate ? 'updating' : 'adding'} module!`);
        }
    };

    useEffect(() => {
        const filteredModules = modules.filter(item =>
            item.name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.status.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredModules(filteredModules);
    }, [filterText, modules]);

    // const deleteModule = async (row) => {
    //     try {
    //         const result = await stockManagementApis.deleteModule(row.id);
    //         console.log('Module deleted:', result);
    //         toast.success('Module deleted successfully!');
    //         handleGetData();
    //     } catch (error) {
    //         console.error('Error deleting module:', error);
    //         toast.error('Error deleting module!');
    //     }
    // };

    const deleteModule = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this record?');

        if (isConfirmed) {
            setModules((prevMods) => prevMods.filter((mdl) => mdl.id !== id));
        } else {
            setShowAlert(true);
        }
    };

    const handleUpdateClick = (row) => {
        console.log('row:', row);
        setSelectedModule(row);
        setNewModule({ name: row.name, status: row.status ? 'active' : 'inactive' });
        setIsUpdate(true);
        handleModalShow();
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
        { name: <b>Name</b>, selector: row => row.name, sortable: true, className: 'data-table-cell' },
        { name: <b>Status</b>, selector: row => (row.status === 'active' ? 'active' : 'inactive'), sortable: true, className: 'data-table-cell' },
        {
            name: <b>Action</b>,
            cell: row => (
                <>
                    <Button className='mx-2 btn-sm border-0' onClick={() => handleUpdateClick(row)}>
                        <i className="fa-regular fa-edit" aria-hidden="true"></i>
                    </Button>
                    <Button className='bg-danger btn-sm border-0' onClick={() => deleteModule(row)}>
                        <i className="fa fa-trash" aria-hidden="true" style={{ color: "white" }}></i>
                    </Button>
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            className: 'data-table-cell'
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
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Module List</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }}>
                <Container fluid className='p-3'>
                    <p style={{ fontSize: "16px", fontWeight: 'bold' }}>Module List</p>
                    <hr />
                    <Row>
                        <Col lg={12} md={6} sm={3}>
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
                                                <i className="fa fa-search" style={{ fontSize: '14px' }}></i>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className='d-flex'>
                                    <Button className='btn-sm' onClick={handleModalShow}>
                                        <i className='fa fa-plus' aria-hidden='true'></i>&nbsp;Add Module
                                    </Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DataTable
                                columns={columns}
                                data={filteredModules}
                                pagination
                                highlightOnHover
                                striped
                                customStyles={customStyles}
                            />
                        </Col>
                    </Row>
                </Container>
            </Card>

            <Modal show={showModal} style={{ fontSize: "16px" }} size="lg" backdrop="static" onHide={handleModalClose}>
                <Modal.Header style={{ fontSize: "16px" }} closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {isUpdate ? 'Update Module' : 'Add Module'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Module Name</Form.Label>
                                        <Form.Control
                                            name="name"
                                            type="text"
                                            value={newModule.name}
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
                                            value={newModule.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">
                                {isUpdate ? 'Update Module' : 'Add Module'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
                <ToastContainer />
            </Modal>
        </Main>
    );
}
