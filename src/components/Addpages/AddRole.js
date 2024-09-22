import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Alert } from 'react-bootstrap';
import { Link, NavLink, useParams } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddRole() {
  const { id } = useParams();
  console.log("id=>", id);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      role_id: "",
      name: "",
      role_status: false,
    }
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchRoleData = async () => {
        try {
          const response = await stockManagementApis.getRoleById(id);
          const roleData = response;
          for (const [key, value] of Object.entries(roleData)) {
            setValue(key, value);
          }
          console.log('Role fetched:', response);
        } catch (error) {
          console.error('Error fetching Role data:', error);
        }
      };
      fetchRoleData();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await stockManagementApis.putRole(id, data);
        setMessage('Role updated successfully');
        console.log('Role updated:', data);
      } else {
        await stockManagementApis.postRole(data);
        setMessage('Role added successfully');
        console.log('Role added:', data);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage('Error submitting data');
    }
  };

  return (
    <Main>
      <div className='my-2' style={{ position: 'relative'}}>
        <Breadcrumb>
          <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp;
            <i className="fa fa-angle-right"></i>
            <Link style={{ textDecoration: "none", color: "black" }} to="/role"> Role&nbsp;
              <i className="fa fa-angle-right"></i>
            </Link>
          </Link>
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp; {id?'Edit Role':'Add Role'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Container fluid>
        <Row className="justify-content-center" >
          <Col lg={12}>
            <Card style={{ boxShadow: "0 0 5px #a3a3a3" }} >
              <Card.Header className="bg-white text-dark" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                {id ? 'Edit Role' : 'Add Role'}
              </Card.Header>
              <Card.Body>
                {message && <Alert variant={message.includes('successfully') ? 'success' : 'danger'}>{message}</Alert>}
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Role Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter name"
                          {...register('name', {
                            required: 'Role name is required',
                            minLength: { value: 2, message: 'Role name must be at least 2 characters long' }
                          })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register('role_status')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button variant="primary" type="submit" className="float-end mx-3">
                    Submit
                  </Button>{message}
                  <NavLink to='/role'>
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
