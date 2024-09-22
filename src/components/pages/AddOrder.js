import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm, useFieldArray } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb } from 'react-bootstrap';
import { useParams, Link, NavLink } from 'react-router-dom';
import Main from '../layout/Main';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import context from 'react-bootstrap/esm/AccordionContext';
import moment from 'moment';

export default function AddOrder() {
    const { id } = useParams();
    const [vendor, setVendor] = useState([]);
    const [user, setUser] = useState([]);
    const [branch, setBranch] = useState([]);
    const [product, setProduct] = useState([]);
    const [productStock, setProductStock] = useState({});
    const [productIssue, setProductIssue] = useState({});
    const [error, setError] = useState('');

    const { register, handleSubmit, setValue, formState: { errors }, reset, control, watch } = useForm({
        defaultValues: {
            id: "",
            name: "",
            vendor_id: "",
            invoice_number: "",
            order_date: "",
            status: false,
            total_amount: "",
            user_id: "",
            branch_id: "",
            orderLineItems: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'orderLineItems'
    });

    useEffect(() => {
        const fetchOrderData = async () => {
            if (id) {
                try {
                    const response = await stockManagementApis.getOrder(id);
                    for (const [key, value] of Object.entries(response[0])) {
                        setValue(key, value);
                    }
                } catch (error) {
                    console.error('Error fetching Order data:', error);
                }
            }
        };
        fetchOrderData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            console.log('onsubmit', data);
            data.total_amount = data.orderLineItems.reduce((total, item) => total + (parseFloat(item.price) * parseInt(item.quantity)), 0);
            const response = await stockManagementApis.AddOrder(data);
            console.log('Order added successfully', response.result1);
            const orderId = response.result[0].id;
            console.log('OrderId', orderId);
            const productId = response.result1[0].id;
            console.log('ProductId', productId);
            data.orderLineItems = data.orderLineItems.map(item => ({ ...item, order_id: orderId }));
            console.log('Order updated successfully', data.orderLineItems);
            await stockManagementApis.updateOrderLineItem(productId, data.orderLineItems);
            toast.success('Order added successfully');
            reset();
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Error submitting data');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await stockManagementApis.getAllUsers();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user Data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const vendorData = await stockManagementApis.getVendor();
                setVendor(vendorData);
            } catch (error) {
                console.error('Error fetching vendor Data:', error);
            }
        };
        fetchVendorData();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await stockManagementApis.getProduct();
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product Data:', error);
            }
        };
        fetchProductData();
    }, []);

    useEffect(() => {
        const fetchBranchData = async () => {
            try {
                const branchData = await stockManagementApis.getBranch();
                setBranch(branchData);
            } catch (error) {
                console.error('Error fetching branch Data:', error);
            }
        };
        fetchBranchData();
    }, []);

    const addItem = () => {
        append({ product_id: "", price: "", quantity: "" });
    };

    const removeItem = (index) => {
        remove(index);
    };

    const watchOrderLineItems = watch('orderLineItems', []);

    const handleProductChange = async (index, productId) => {
        console.log('Product changed', productId);
        if (productId) {
            try {
                const productData = await stockManagementApis.getProductById(productId);
                console.log('productData', productData[0].total_buy_quantity, productData[0].total_issue_quantity);
                setProductStock((prevStock) => ({
                    ...prevStock,
                    [index]: productData[0].total_buy_quantity,
                }));
                setProductIssue((prevIssue) => ({
                    ...prevIssue,
                    [index]: productData[0].total_issue_quantity,
                }));
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        }
    };

    const handleQuantityChange = async (index, quantity) => {
        const productId = watchOrderLineItems[index].product_id;
        if (productId) {
            try {
                const newBuyQuantity = productStock[index] - parseInt(quantity);
                const newIssueQuantity = productIssue[index] + parseInt(quantity);
                if (newBuyQuantity > newIssueQuantity) {
                    setProductStock((prevStock) => ({
                        ...prevStock,
                        [index]: newBuyQuantity,
                    }));
                    setProductIssue((prevIssue) => ({
                        ...prevIssue,
                        [index]: newIssueQuantity,
                    }));

                    console.log(`Updating product stock and issue quantity for product ${productId}:`, { total_buy_quantity: newBuyQuantity, total_issue_quantity: newIssueQuantity });
                    const result = await stockManagementApis.updateStock(productId, { total_buy_quantity: newBuyQuantity, total_issue_quantity: newIssueQuantity });
                    console.log(`Updated product stock and issue quantity for product ${productId}`, result);
                }
                else {
                    console.log('stock is not avaliable this product quantity');
                }
            } catch (error) {
                console.error('Error updating product stock and issue quantity:', error);
            }
        }
    };



    return (
        <Main>
            <ToastContainer />
            <div className='my-2' style={{ fontFamily: "sans-serif", position: 'relative', left: '15px' }}>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp;
                        <i className="fa fa-angle-right"></i>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/order"> Order&nbsp;
                            <i className="fa fa-angle-right"></i>
                        </Link>
                    </Link>
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;{id ? 'Edit Order' : 'Add Order'}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={12} md={6} sm={3}>
                        <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }} >
                            <Card.Header className="bg-white text-dark" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                                {id ? 'Edit Order' : 'Add Order'}
                                <Button variant="primary" type="submit" className="float-end mx-3" onClick={handleSubmit(onSubmit)}>Submit</Button>
                                <NavLink to={'/order'}>
                                    <Button variant="danger" className="float-end">Cancel</Button>
                                </NavLink>
                            </Card.Header>
                            <Card.Body>
                                <Form>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>User</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="user_id"
                                                    {...register('user_id', { required: 'User is required' })}
                                                >
                                                    <option value="">Select User</option>
                                                    {user.map((usr) => (
                                                        <option key={usr.id} value={usr.id}>
                                                            {usr.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.user_id && <span className="text-danger">{errors.user_id.message}</span>}
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="branch_id"
                                                    {...register('branch_id', { required: 'Branch is required' })}
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branch.map((brc) => (
                                                        <option key={brc.id} value={brc.id}>
                                                            {brc.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.branch_id && <span className="text-danger">{errors.branch_id.message}</span>}
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Vendor</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="vendor_id"
                                                    {...register('vendor_id', { required: 'Vendor is required' })}
                                                >
                                                    <option value="">Select Vendor</option>
                                                    {vendor.map((vndr) => (
                                                        <option key={vndr.id} value={vndr.id}>
                                                            {vndr.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.vendor_id && <span className="text-danger">{errors.vendor_id.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Invoice Number</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="invoice_number"
                                                    placeholder="Invoice Number"
                                                    {...register('invoice_number', {
                                                        validate: (name) => {
                                                            if (name && !/^\d{1,10}$/.test(name)) {
                                                                setError('Invoice Number must be up to 10 digits');
                                                            }
                                                        }
                                                    })}
                                                />
                                                {error.invoice_number && <span className="text-danger">{error.invoice_number.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Order Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="order_date"
                                                    max={moment().format('YYYY-MM-DD')}
                                                    {...register('order_date', { required: 'Order Date is required' })}
                                                />
                                                {errors.order_date && <span className="text-danger">{errors.order_date.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select {...register('status')}>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Container className='mt-5'>
                <Card style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)' }} >
                    <Card.Header className='bg-white'>
                        <div className='d-flex justify-content-between'>
                            <h3 style={{ fontSize: "16px", fontWeight: 'bold' }}>Order Line Items</h3>
                            <Button variant="primary" onClick={addItem}>
                                <i className='fa fa-plus'></i> Add Row</Button>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row
                                style={{
                                    color: 'white',
                                    fontSize: "30px",
                                    background: 'rgb(17, 24, 39)',
                                    height: "30px",
                                    fontFamily: "bold",
                                    border: "2px solid",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Col lg={3} style={{ textAlign: "center" }}>Product</Col>
                                <Col lg={2} style={{ textAlign: "center" }}>Price</Col>
                                <Col lg={2} style={{ textAlign: "center" }}>Quantity</Col>
                                <Col lg={3} style={{ textAlign: "center" }}>Total</Col>
                                <Col lg={2} style={{ textAlign: "center" }}>Action</Col>
                            </Row>

                            {fields.map((item, index) => (
                                <Row key={item.id} className='mt-2'>
                                    <Col lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                as="select"
                                                {...register(`orderLineItems.${index}.product_id`, {
                                                    required: 'Product is required',
                                                    onChange: (e) => handleProductChange(index, e.target.value)
                                                })}
                                            >
                                                <option value="">Select Product</option>
                                                {product.map((prod) => (
                                                    <option key={prod.id} value={prod.id}>
                                                        {prod.name}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            {errors.orderLineItems?.[index]?.product_id && <span className="text-danger">{errors.orderLineItems[index].product_id.message}</span>}
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                {...register(`orderLineItems.${index}.price`, 
                                                    { required: 'Price is required',
                                                        onChange :(e) =>{
                                                            const value = parseInt(e.target.value,10);
                                                            if(value >=0 || e.target.value === ''){

                                                            }else{
                                                                e.target.disabled =true;
                                                                setTimeout(()=>{
                                                                    e.target.disabled = false;
                                                                    e.target.value ='';
                                                                },500)
                                                            }
                                                        }
                                                     })}
                                            />
                                            {errors.orderLineItems?.[index]?.price && (
                                                <span className="text-danger">
                                                    {errors.orderLineItems[index].price.message}
                                                </span>
                                            )}
                                        </Form.Group>
                                    </Col>


                                    <Col lg={2}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                {...register(`orderLineItems.${index}.quantity`, {
                                                    required: 'Quantity is required',
                                                    onChange: (e) => {
                                                        const value = parseInt(e.target.value, 10);
                                                        if (value >= 0 || e.target.value === '') {
                                                        } else {
                                                            e.target.disabled = true;
                                                            setTimeout(() => {
                                                                e.target.disabled = false;
                                                                e.target.value = '';
                                                            }, 500);
                                                        }
                                                    }
                                                })}
                                            />
                                            {errors.orderLineItems?.[index]?.quantity && (
                                                <span className="text-danger">
                                                    {errors.orderLineItems[index].quantity.message}
                                                </span>
                                            )}
                                        </Form.Group>
                                    </Col>

                                    <Col lg={3}>
                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                value={watchOrderLineItems[index]?.price * watchOrderLineItems[index]?.quantity || 0}
                                                readOnly
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2} style={{ textAlign: "center" }}>
                                        <Button variant="danger" onClick={() => removeItem(index)}>
                                            <i className='fa fa-close'></i>&nbsp;Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </Main>
    );
}
