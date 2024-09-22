import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import stockManagementApis from '../apis/StockManagementApis';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Modal, Form, Table, Tab, Tabs } from 'react-bootstrap';
import Main from '../layout/Main';
import { AuthContext } from '../context/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

export default function OrderDetailPage() {
    const { id } = useParams();
    const { permissions } = useContext(AuthContext);
    const [order, setOrder] = useState({});
    const [orderLineItems, setOrderLineItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [show, setShow] = useState(false);
    const [totalReturns, setTotalReturns] = useState(0);
    const [returns, setReturns] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        user_name: '',
        branch_name: '',
        vendor_name: '',
        order_number: '',
        order_date: '',
        total_amount: '',
        invoice_number: '',
        status: false,
    });
    const [returnDetails, setReturnDetails] = useState({
        product_id: '',
        product_name: '',
        quantity: '',
        return_date: '',
        issue_date: '',
        order_id: ''
    });

    const getProductDetails = async () => {
        try {
            const result = await stockManagementApis.getProduct();
            setProducts(result);
        } catch (err) {
            setProducts([]);
        }
    };

    const getReturnDetails = async () => {
        try {
            const result = await stockManagementApis.getReturnByOrderId(id);
            const returnData = Array.isArray(result) ? result : [];
            setReturns(returnData);
            setTotalReturns(returnData);
        } catch (error) {
            console.error('Error fetching return details:', error);
            setReturns([]);
            setTotalReturns(0);
        }
    };

    useEffect(() => {
        getReturnDetails();
        getProductDetails();
    },);

    const handleClose = () => setShow(false);

    const handleShow = (orderlineitemId, productId, productName, quantity) => {
        setReturnDetails({
            product_id: productId,
            product_name: productName,
            quantity: quantity,
            return_date: '',
            issue_date: '',
            order_id: id,
            orderlineitem_id: orderlineitemId
        });
        setShow(true);
    };

    // const handleShow = (orderlineitemId, productId, productName, quantity) => {
    //     const newLineItem = {
    //         orderlineitem_id: orderlineitemId,
    //         product_id: productId,
    //         product_name: productName,
    //         quantity: quantity,
    //         return_date: '',
    //         issue_date: '',
    //         order_id: id
    //     };

    //     setOrderLineItems([...orderLineItems, newLineItem]);
    //     setShow(true);
    // };




    const handleDeleteLineItem = async (orderlineitemId) => {
        try {
            await stockManagementApis.deleteOrderLineItem(orderlineitemId);
            toast.success('Order line item deleted successfully!');
            getReturnDetails();
        } catch (error) {
            console.error('Error deleting order line item:', error);
        }
    }

    const getOrderLineItemData = async (orderId) => {
        try {
            const result = await stockManagementApis.getOrderLineItemById(orderId);
            setOrderLineItems(result);
        } catch (error) {
            console.log('Order line items not fetched:', error);
        }
    };

    useEffect(() => {
        const handleOrderData = async (orderId) => {
            try {
                const result = await stockManagementApis.getOrderById(orderId);
                setOrder(result[0]);
                setFormData(result[0]);
                getOrderLineItemData(orderId);
            } catch (error) {
                console.log('Order not fetched:', error);
            }
        };
        handleOrderData(id);
    }, [id]);

    const hasUpdatePermission = permissions?.some(role => role.name === 'Admin' || role.name === 'Super Admin');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log("name", name);
        if (name === 'invoice_number' && value.length > 10) {
            setError('Invoice number must be less than 10 digits');
        } else {
            setError('');
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await stockManagementApis.updateOrder(order.id, formData);
            toast.success('Order updated successfully!');
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update order.');
            console.log('Order update error:', error);
        }
    };

    const handleReturnInputChange = (e) => {
        const { name, value } = e.target;
        setReturnDetails({ ...returnDetails, [name]: value });
    };


    // const handleReturnInputChange = (e, index) => {
    //     const { name, value } = e.target;
    //     const updatedItems = [...orderLineItems];
    //     updatedItems[index] = { ...updatedItems[index], [name]: value };
    //     setOrderLineItems(updatedItems);
    // };

    // const handleReturnSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         for (const lineItem of orderLineItems) {
    //             const returnQuantity = parseInt(lineItem.quantity, 10);
    //             const selectedOrderLineItem = orderLineItems.find(item => item.product_id === lineItem.product_id);
    //             const selectedProductLineItem = products.find(item => item.id === selectedOrderLineItem.product_id);

    //             if (!selectedOrderLineItem || returnQuantity > selectedOrderLineItem.quantity) {
    //                 toast.error('Return quantity cannot be greater than available quantity.');
    //                 continue;
    //             }

    //             const updatedQuantity = selectedOrderLineItem.quantity - returnQuantity;
    //             const updatedIssueQuantity = (selectedProductLineItem.total_issue_quantity || 0) + returnQuantity;
    //             const updatedTotalStock = (selectedProductLineItem.total_buy_quantity || 0);

    //             await stockManagementApis.addReturn(lineItem);
    //             await stockManagementApis.updateStock(selectedOrderLineItem.product_id, {
    //                 total_issue_quantity: updatedIssueQuantity,
    //                 total_buy_quantity: updatedTotalStock
    //             });
    //             await stockManagementApis.updateOrderLineItemQuantity(selectedOrderLineItem.orderlineitem_id, {
    //                 quantity: updatedQuantity,
    //             });
    //         }

    //         toast.success('All returns added successfully!');
    //         getReturnDetails();
    //         handleClose();
    //     } catch (error) {
    //         toast.error('Failed to add some returns.');
    //         console.log('Return submission error:', error);
    //     }
    // };


    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        const returnQuantity = parseInt(returnDetails.quantity, 10);
        const selectedOrderLineItem = orderLineItems.find(item => item.product_id === returnDetails.product_id);
        const selectedProductLineItem = products.find(item => item.id === selectedOrderLineItem.product_id);

        if (!selectedOrderLineItem || returnQuantity > selectedOrderLineItem.quantity) {
            toast.error('Return quantity cannot be greater than available quantity.');
            return;
        }

        const updatedQuantity = selectedOrderLineItem.quantity - returnQuantity;
        const updatedIssueQuantity = (selectedProductLineItem.total_issue_quantity || 0) + returnQuantity;
        const updatedTotalStock = (selectedProductLineItem.total_buy_quantity || 0);

        try {
            await stockManagementApis.addReturn(returnDetails);
            toast.success('Return added successfully!');
            await stockManagementApis.updateStock(selectedOrderLineItem.product_id, {
                total_issue_quantity: updatedIssueQuantity,
                total_buy_quantity: updatedTotalStock
            });
            toast.success('Updated stock successfully!');
            await stockManagementApis.updateOrderLineItemQuantity(selectedOrderLineItem.orderlineitem_id, {
                quantity: updatedQuantity,
            });
            toast.success('Updated line item quantity successfully');
            getReturnDetails();
            handleClose();
        } catch (error) {
            toast.error('Failed to add return.');
            console.log('Return submission error:', error);
        }
    };

    return (
        <Main>
            <ToastContainer />
            <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }}>
                <CardHeader className="bg-dark text-white">
                    <span style={{ fontSize: '18px' }}>Order Details</span>
                    <Link to={`/order`}>
                        <Button className="float-end btn-sm mx-2 bg-danger border-0" style={{ padding: '2px 8px' }}>
                            <i className='fa fa-close'></i>
                        </Button>
                    </Link>
                    {hasUpdatePermission && (
                        <Button
                            className="float-end btn-sm border-0"
                            style={{ padding: '2px 8px' }}
                            onClick={() => setShowModal(true)}
                        >
                            <i className='fa-regular fa-edit'></i>
                        </Button>
                    )}
                </CardHeader>
                <CardBody>
                    <Container fluid style={{ fontSize: '16px' }} >
                        <Row>
                            <Col sm={6} md={6} lg={12} xl={6}>
                                <div style={{ fontWeight: "bold" }}>User</div>
                                <div>{order.user_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Branch</div>
                                <div>{order.branch_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Vendor</div>
                                <div>{order.vendor_name}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Order Number</div>
                                <div>{order.order_number}</div>
                            </Col>
                            <Col sm={6} md={6} lg={12} xl={6}>
                                <div style={{ fontWeight: "bold" }}>Date</div>
                                <div>{moment(order.order_date).format('DD-MM-YYYY')}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Total Amount</div>
                                <div>{order.total_amount}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Invoice Number</div>
                                <div>{order.invoice_number}</div>
                                <div className='mt-3' style={{ fontWeight: "bold" }}>Status</div>
                                <div>{order.status ? 'Active' : 'Inactive'}</div>
                            </Col>
                        </Row>
                    </Container>
                </CardBody>
            </Card>

            <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)', marginTop: "20px" }}>
                <CardHeader className="bg-dark text-white">
                    <span style={{ fontSize: '18px' }}>Related</span>
                </CardHeader>
                <CardBody className='mt-1'>
                    <Tabs defaultActiveKey="orders" id="user-detail-tabs">
                        <Tab eventKey="orders" title={`Order Line Items (${orderLineItems.length})`}>
                            <Container fluid className='p-2'>
                                <Row>
                                    <Col>
                                        <Table responsive bordered hover className='text-center' style={{ fontSize: '14px' }}>
                                            <thead className='thead-dark'>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Rate</th>
                                                    <th>Amount</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderLineItems.length > 0 ? orderLineItems.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.product_name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.price}</td>
                                                        <td>{item.price * item.quantity}</td>
                                                        <td style={{ width: "250px" }}>
                                                            <div style={{ display: 'flex', justifyContent: "center", gap: "3px", padding: "1px 0px" }}>
                                                                <Button size="sm" variant="success" onClick={() => handleShow(item.orderlineitem_id, item.product_id, item.product_name, item.quantity)}>
                                                                    Return
                                                                </Button>
                                                                <Button size="sm" variant="danger" onClick={() => handleDeleteLineItem(item.orderlineitem_id)}>
                                                                    <i className='fa fa-trash'></i>
                                                                </Button>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="6">No order line items found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Container>
                        </Tab>
                        <Tab eventKey="returns" title={`Returns (${totalReturns.length})`}>
                            <Container fluid className='p-2'>
                                <Row>
                                    <Col>
                                        <Table responsive bordered hover className='text-center' style={{ fontSize: '14px' }}>
                                            <thead className='thead-dark'>
                                                <tr>
                                                    <th>S.No.</th>
                                                    <th>Product Name</th>
                                                    <th>Quantity</th>
                                                    <th>Return Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {returns.length > 0 ? returns.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.product_name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.return_date}</td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="5">No returns found.</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </Container>
                        </Tab>
                    </Tabs>
                </CardBody>
            </Card>

            {/* return model  */}
            <Modal show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Add Return</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleReturnSubmit}>
                        <Form.Group className="mb-3" controlId="formProductName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter product name" value={returnDetails.product_name} readOnly disabled />
                        </Form.Group>


                        <Form.Group className='mb-3'>
                            <Form.Label>Buy Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Quantity"
                                name="quantity"
                                min="0"
                                value={returnDetails.quantity}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value, 10);
                                    if (value >= 0 || e.target.value === '') {
                                        handleReturnInputChange(e);
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
                            <Form.Control.Feedback type="invalid">
                                Please enter the buy quantity.
                            </Form.Control.Feedback>
                        </Form.Group>


                        <Form.Group className="mb-3" controlId="formReturnDate">
                            <Form.Label>Return Date</Form.Label>
                            <Form.Control
                                type="date"
                                min={moment(order.order_date).format('YYYY-MM-DD')}
                                max={moment().format('YYYY-MM-DD')}
                                name="return_date"
                                value={returnDetails.return_date}
                                onChange={handleReturnInputChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" className='float-end' type="submit">
                            Add Return
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* order detail update modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Update Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formUserName">
                                    <Form.Label>User</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="user_name"
                                        value={formData.user_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formBranchName">
                                    <Form.Label>Branch</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="branch_name"
                                        value={formData.branch_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formVendorName">
                                    <Form.Label>Vendor</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vendor_name"
                                        value={formData.vendor_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formOrderNumber">
                                    <Form.Label>Order Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="order_number"
                                        min="0"
                                        value={formData.order_number}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formOrderDate">
                                    <Form.Label>Order Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="order_date"
                                        max={moment().format('YYYY-MM-DD')}
                                        value={formData.order_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='mb-3'>
                                    <Form.Label>Total Amount</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="total_amount"
                                        min="0"
                                        value={formData.total_amount}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value, 10);
                                            if (value >= 0 || e.target.value === '') {
                                                handleInputChange(e);
                                            } else {
                                                e.target.disabled = true;
                                                setTimeout(() => {
                                                    e.target.disabled = false;
                                                    e.target.value = formData.total_amount;
                                                }, 500);
                                            }
                                        }}
                                    />
                                </Form.Group>
                            </Col>

                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formInvoiceNumber">
                                    <Form.Label>Invoice Number</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="invoice_number"
                                        value={formData.invoice_number}
                                        onChange={handleInputChange}
                                        isInvalid={!!error}
                                    />
                                    {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" controlId="formStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" className='float-end' type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>


        </Main >
    );
}
