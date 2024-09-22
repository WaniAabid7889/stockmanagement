import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Alert } from 'react-bootstrap';
import { useParams, NavLink, Link } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddProduct() {
    const { id } = useParams();
    console.log('id=>', id);

    const [productCategory, setProductCategory] = useState([]);
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
        defaultValues: {
            product_id: "",
            name: "",
            category_id: "",
            description: "",
            is_active: false,
            total_buy_quantity: "",
            total_issue_quantity: ""
        }
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProductData = async () => {
            if (id) {
                try {
                    const response = await stockManagementApis.getProductById(id);
                    const productData = response[0];
                    for (const [key, value] of Object.entries(productData)) {
                        setValue(key, value);
                    }
                    console.log('Product fetched:', response);
                } catch (error) {
                    console.error('Error fetching product data:', error);
                }
            }
        };
        fetchProductData();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            if (id) {
                await stockManagementApis.putProduct(id, data);
                setMessage('Product updated successfully');
                console.log('Product updated:', data);
            } else {
                await stockManagementApis.postProduct(data);
                setMessage('Product added successfully');
                console.log('Product added:', data);
            }
            reset(); // Reset form after submission
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage('Error submitting data');
        }
    };

    useEffect(() => {
        const fetchProductCategoryData = async () => {
            try {
                const productCategoryData = await stockManagementApis.getProductCategory();
                setProductCategory(productCategoryData);
            } catch (error) {
                console.error('Error fetching product category:', error);
            }
        };
        fetchProductCategoryData();
    }, []);

    return (
        <Main>
            <div className='my-2' style={{ fontFamily: "sans-serif", position: 'relative', left: '15px'}}>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp; 
                        <i className="fa fa-angle-right"></i>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/product"> Product&nbsp;
                            <i className="fa fa-angle-right"></i>
                        </Link>
                    </Link>
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;{id?'Edit Product':'Add Product'}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <Container fluid>
                <Row className="justify-content-center ">
                    <Col lg={12} md={6}>
                        <Card style={{ boxShadow: "0 0 5px #a3a3a3" }} className='p-2'>
                            <Card.Header className="bg-white text-dark" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                                {id ? 'Edit Product' : 'Add Product'}
                            </Card.Header>
                            <Card.Body>
                                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    {...register('name', {
                                                        required: 'Name is required',
                                                        minLength: { value: 2, message: 'Name must be at least 2 characters long' }
                                                    })}
                                                />
                                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name="category_id"
                                                    {...register('category_id', {
                                                        required: 'Category is required'
                                                    })}
                                                >
                                                    <option value="">Select product category</option>
                                                    {productCategory.map((cat) => (
                                                        <option key={cat.category_id} value={cat.category_id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.category_id && <span className="text-danger">{errors.category_id.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="description"
                                                    placeholder="Enter description"
                                                    {...register('description', {
                                                        required: 'Description is required',
                                                        minLength: { value: 5, message: 'Description must be at least 5 characters long' }
                                                    })}
                                                />
                                                {errors.description && <span className="text-danger">{errors.description.message}</span>}
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Buy Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="total_buy_quantity"
                                                    placeholder="Enter total buy quantity"
                                                    {...register('total_buy_quantity', {
                                                        required: 'Total buy quantity is required',
                                                        min: { value: 1, message: 'Quantity must be at least 1' }
                                                    })}
                                                />
                                                {errors.total_buy_quantity && <span className="text-danger">{errors.total_buy_quantity.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Issue Quantity</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="total_issue_quantity"
                                                    placeholder="Enter total issue quantity"
                                                    {...register('total_issue_quantity', {
                                                        required: 'Total issue quantity is required',
                                                        min: { value: 0, message: 'Quantity must be at least 0' }
                                                    })}
                                                />
                                                {errors.total_issue_quantity && <span className="text-danger">{errors.total_issue_quantity.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select {...register('is_active'?'Active':'Inactive')}>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="submit" className="float-end mx-3">Submit</Button>
                                    <NavLink to='/product'>
                                        <Button variant='danger' type="button" className="float-end">Cancel</Button>
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
