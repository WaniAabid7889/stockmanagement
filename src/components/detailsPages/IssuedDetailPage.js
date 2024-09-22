import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import stockManagementApis from '../apis/StockManagementApis';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, Form } from 'react-bootstrap';
import Main from '../layout/Main';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';

export default function IssuedDetailPage() {
    const { id } = useParams();
    const [returns, setReturns] = useState([]);
    const [totalReturns, setTotalReturns] = useState(0);
    const [returnDetails, setReturnDetails] = useState({
        product_id: '',
        product_name: '',
        quantity: '',
        return_date: '',
        issue_date: '',
        issue_id: ''
    });
    const [issue, setIssue] = useState({
        name: '',
        product_name: '',
        product_id: '',
        branch_name: '',
        user_name: '',
        quantity: '',
        issue_date: '',
        description: '',
        status: false
    });
    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);

    const handleIssueData = async (id) => {
        try {
            const result = await stockManagementApis.getIssueById(id);
            setIssue(result);
            setReturnDetails(prevDetails => ({
                ...prevDetails,
                product_name: result.product_name,
                product_id: result.product_id,
                quantity: result.quantity,
                issue_date: result.issue_date,
                issue_id: result.id,
            }));
        } catch (error) {
            console.error('Error fetching issue:', error);
        }
    };

    const getReturnDetails = async () => {
        try {
            const result = await stockManagementApis.getReturnById(id);
            const returnData = Array.isArray(result) ? result : [];
            setReturns(returnData);

            // Calculate totalReturns by summing up the quantities of all returns
            const totalReturnQuantity = returnData.reduce((sum, ret) => sum + parseInt(ret.quantity), 0);
            setTotalReturns(totalReturnQuantity);
        } catch (error) {
            console.error('Error fetching return details:', error);
            setReturns([]);
            setTotalReturns(0);
        }
    };

    useEffect(() => {
        handleIssueData(id);
        getReturnDetails();
    }, [id]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const updateProductStock = async (productId, addedQuantity) => {
        try {
            const product = await stockManagementApis.getProductById(productId);
            const totalBuyQuantity = product[0].total_buy_quantity;
            const totalIssueQuantity = product[0].total_issue_quantity;

            if (totalBuyQuantity < addedQuantity && totalIssueQuantity < addedQuantity) {
                throw new Error('Not enough stock to process return');
            } else {
                const newTotalIssueQuantity = totalIssueQuantity - parseInt(addedQuantity);
                const newStockQuantity = totalBuyQuantity + parseInt(addedQuantity);
                await stockManagementApis.updateProductById(productId, { total_buy_quantity: newStockQuantity, total_issue_quantity: newTotalIssueQuantity });
            }
        } catch (error) {
            console.error('Error updating product stock:', error);
        }
    };

    const AddReturnData = async () => {
        try {
            await stockManagementApis.addReturn(returnDetails);
            toast.success('Added Return successfully');

            await updateProductStock(returnDetails.product_id, returnDetails.quantity);

            // Refresh return details and issue data after adding a return
            getReturnDetails();
            handleIssueData(id);
        } catch (error) {
            console.error('Error updating return details:', error);
            toast.error('Failed to add return details.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReturnDetails({ ...returnDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            await AddReturnData();
            handleClose();
        }
        setValidated(true);
    };

    return (
        <Main>
            <ToastContainer autoClose={5000} />
            <Card style={{ boxShadow: "0 0 5px #a3a3a3" }}>
                <CardHeader className="bg-dark text-white d-flex justify-content-between">
                    <span style={{ fontSize: '18px' }}>Issued Details</span>
                    <Link to="/issue">
                        <Button className="btn-sm bg-danger border-0" style={{ padding: '2px 8px' }}>
                            <i className='fa fa-close'></i>
                        </Button>
                    </Link>
                </CardHeader>
                <CardBody>
                    <Container fluid style={{ fontSize: '16px' }}>
                        <Row>
                            <Col sm={12} md={6}>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Product</div>
                                <div>{issue.product_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Branch</div>
                                <div>{issue.branch_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>User</div>
                                <div>{issue.user_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Status</div>
                                <div>{issue.status ? 'Active' : 'Inactive'}</div>
                            </Col>
                            <Col sm={12} md={6}>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Quantity</div>
                                <div>{issue.quantity}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Total Return</div>
                                <div>{totalReturns}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Issue Date</div>
                                <div>{moment(issue.issue_date).format('DD-MM-YYYY')}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Description</div>
                                <div>{issue.description}</div>
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </Card>

            <Modal show={show} onHide={handleClose} backdrop="static" size="lg">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Return Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Product Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Product Name"
                                            name="product_name"
                                            value={returnDetails.product_name}
                                            onChange={handleInputChange}
                                            readOnly
                                            disabled
                                        />
                                    </Form.Group>
                                    <Form.Control
                                        type="hidden"
                                        name="product_id"
                                        value={returnDetails.product_id}
                                    />
                                </Col>
                                <Col md={6}>

                                    <Form.Group className='mb-3'>
                                        <Form.Label>Quantity</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Quantity"
                                            name="quantity"
                                            min="0"
                                            value={returnDetails.quantity}
                                            onChange={(e) => {
                                                const value = parseInt(e.target.value, 10);
                                                if (value >= 0 || e.target.value === '') {
                                                    handleInputChange(e);
                                                } else {
                                                    e.target.disabled = true;
                                                    setTimeout(() => {
                                                        e.target.disabled = false;
                                                        e.target.value = returnDetails.quantity;
                                                    }, 500);
                                                }
                                            }}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Return Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            placeholder="Return Date"
                                            min={moment(returnDetails.issue_date).format('YYYY-MM-DD')}
                                            max={moment().format('YYYY-MM-DD')}
                                            name="return_date"
                                            value={returnDetails.return_date || ''}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Issue Date</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Issue Date"
                                            name="issue_date"
                                            value={moment(returnDetails.issue_date).format('DD-MM-YYYY')}
                                            readOnly
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Card className='mt-5'>
                <CardHeader className="bg-dark text-white d-flex justify-content-between">
                    <span style={{ fontSize: '18px' }}>Related Transactions</span>
                </CardHeader>
                <CardBody>
                    <Container fluid style={{ fontSize: '16px' }}>
                        <Row>
                            <Col className='mb-1' sm={12} md={6} lg={12}>
                                <Button className="btn-sm bg-success border-0 float-end" onClick={handleShow}>
                                    <i className='fa fa-plus'></i> Return
                                </Button>
                            </Col>
                        </Row>
                        <Row
                            style={{
                                padding: '5px',
                                marginLeft: '2px',
                                backgroundColor: '#333',
                                borderRadius: '5px',
                                borderBottom: '2px solid #ddd',
                                marginBottom: '10px',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Col lg={3}>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Product</div>
                            </Col>
                            <Col lg={3}>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Quantity</div>
                            </Col>
                            <Col lg={3}>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Return Date</div>
                            </Col>
                            <Col lg={3}>
                                <div style={{ fontWeight: 'bold', color: '#fff' }}>Issue Date</div>
                            </Col>
                        </Row>


                        {returns.map((ret, index) => (
                            <Row
                                key={index}
                                style={{
                                    borderBottom: '1px solid #ddd',
                                    padding: '2px',
                                    marginLeft: '2px',
                                    backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
                                    borderRadius: '5px',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                                    marginBottom: '10px',
                                }}
                            >
                                <Col className='text-left' lg={3} >
                                    {ret.product_name}
                                </Col>
                                <Col lg={3} style={{ color: '#555' }}>
                                    {ret.quantity}
                                </Col>
                                <Col lg={3} style={{ color: '#555' }}>
                                    {ret.return_date}
                                </Col>
                                <Col lg={3} style={{ color: '#555' }}>
                                    {ret.issue_date}
                                </Col>
                            </Row>
                        ))}
                        {returns.length === 0 && (
                            <Row>
                                <Col style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
                                    No related return found.
                                </Col>
                            </Row>
                        )}
                    </Container>
                </CardBody>
            </Card>
        </Main>
    );
}
