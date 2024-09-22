import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Alert } from 'react-bootstrap';
import { useParams, NavLink, Link } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddProductCategory() {
  const { id } = useParams();
  console.log("id=>", id); 

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      category_id: "",
      name: "",
      category_status: ""
    }
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchProductCategoryData = async () => {
        try {
          const response = await stockManagementApis.getProductCategoryById(id);
          const categoryData = response;
          for (const [key, value] of Object.entries(categoryData)) {
            setValue(key, value);
          }
          console.log('Product Category fetched:', response);
        } catch (error) {
          console.error('Error fetching product category data:', error);
        }
      };
      fetchProductCategoryData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await stockManagementApis.putProductCategory(id, data);
        setMessage('Product Category updated successfully');
        console.log('Product Category updated:', data);
      } else {
        await stockManagementApis.postProductCategory(data);
        setMessage('Product Category added successfully');
        console.log('Product Category added:', data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Error submitting data');
    }
  };

  return (
    <Main>
      <div className='my-2' style={{ fontFamily: "sans-serif", position: 'relative', left: '15px' }}>
        <Breadcrumb>
          <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp; 
            <i className="fa fa-angle-right"></i>
            <Link style={{ textDecoration: "none", color: "black" }} to="/productCategory"> Product Category&nbsp;
              <i className="fa fa-angle-right"></i>
            </Link>
          </Link>
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;Add Product Category</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={12} md={6} sm={3}>
            <Card style={{ boxShadow: "0 0 5px #a3a3a3" }}>
              <Card.Header className="bg-white text-dark" style={{ fontSize: "20px", fontWeight: 'bold' }}>
                {id ? 'Edit Product Category' : 'Add Product Category'}
              </Card.Header>
              <Card.Body>
                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col lg={6}>
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
                    </Col>
                    <Col lg={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category Status</Form.Label>
                        <Form.Control
                          type="text"
                          name="category_status"
                          placeholder="Enter category status"
                          {...register('category_status', {
                            required: 'Category status is required'
                          })}
                        />
                        {errors.category_status && <span className="text-danger">{errors.category_status.message}</span>}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="float-end mx-3">Submit</Button>
                  <NavLink to='/productCategory'>
                    <Button variant="danger" type="button" className="float-end">Cancel</Button>
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
