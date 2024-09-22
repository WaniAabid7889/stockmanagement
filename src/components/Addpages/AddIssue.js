import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Alert } from 'react-bootstrap';
import { Link, NavLink, useParams } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddIssue() {
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState([]);
    const [branch, setBranch] = useState([]);
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        defaultValues: {
            issue_id: "",
            user_id: "",
            product_id: "",
            quantity: "",
            issue_date: "",
            is_active: false,
            description: "",
            branch_id: ""
        }
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchIssueData = async () => {
            if (id) {
                try {
                    const response = await stockManagementApis.getIssue(id);
                    for (const [key, value] of Object.entries(response)) {
                        setValue(key, value);
                    }
                } catch (error) {
                    console.error('Error fetching issue data:', error);
                }
            }
        };
        fetchIssueData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            if (id) {
                await stockManagementApis.putIssue(id, data);
                setMessage('Issue updated successfully');
            } else {
                await stockManagementApis.postIssue(data);
                setMessage('Issue added successfully');
            }
            reset(); // Reset form after submission
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage('Error submitting data');
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await stockManagementApis.getUser();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const productData = await stockManagementApis.getProduct();
                setProduct(productData);
            } catch (error) {
                console.error('Error fetching product data:', error);
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
                console.error('Error fetching branch data:', error);
            }
        };
        fetchBranchData();
    }, []);

    return (
        <Main>
            <div className='my-2' style={{ fontFamily: "sans-serif", position: 'relative', left: '15px' }}>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp;
                        <i className="fa fa-angle-right"></i>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/issue"> Issue&nbsp;
                            <i className="fa fa-angle-right"></i>
                        </Link>
                    </Link>
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Add Issue</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col lg={12} md={6} sm={3}>
                        <Card style={{ boxShadow: "0 0 5px #a3a3a3" }} >
                            <Card.Header className="bg-white text-dark" style={{ fontSize: "20px", fontWeight: 'bold' }}>
                                {id ? 'Edit Issue' : 'Add Issue'}
                            </Card.Header>
                            <Card.Body>
                                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>User ID</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="user_id"
                                                    {...register('user_id', { required: 'User ID is required' })}
                                                >
                                                    <option value="">Select User</option>
                                                    {user.map((usr) => (
                                                        <option key={usr.user_id} value={usr.user_id}>
                                                            {usr.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.user_id && <span className="text-danger">{errors.user_id.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3" >
                                                <Form.Label>Product</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="product_id"
                                                    {...register('product_id', { required: 'Product ID is required' })}
                                                >
                                                    <option value="">Select Product</option>
                                                    {product.map((prd) => (
                                                        <option key={prd.product_id} value={prd.product_id}>
                                                            {prd.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.product_id && <span className="text-danger">{errors.product_id.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="Enter quantity"
                                                    {...register('quantity', { required: 'Quantity is required', min: { value: 1, message: 'Quantity must be at least 1' } })}
                                                />
                                                {errors.quantity && <span className="text-danger">{errors.quantity.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Issue Date</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="issue_date"
                                                    {...register('issue_date', { required: 'Issue Date is required' })}
                                                />
                                                {errors.issue_date && <span className="text-danger">{errors.issue_date.message}</span>}
                                            </Form.Group>
                                        </Col>

                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select {...register('is_active'?'Active':'Inactive')}>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="description"
                                                    placeholder="Enter description"
                                                    {...register('description', { required: 'Description is required' })}
                                                />
                                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="branch_id"
                                                    {...register('branch_id', { required: 'Branch ID is required' })}
                                                >
                                                    <option value="">Select Branch</option>
                                                    {branch.map((brc) => (
                                                        <option key={brc.branch_id} value={brc.branch_id}>
                                                            {brc.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.branch_id && <span className="text-danger">{errors.branch_id.message}</span>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="submit" className="float-end mx-3">Submit</Button>
                                    <NavLink to={'/issue'}>
                                        <Button variant="danger" className="float-end">Cancel</Button>
                                    </NavLink>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Main>
    );
}
