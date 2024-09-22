import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Alert } from 'react-bootstrap';
import { Link, NavLink, useParams } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddUser() {
  const { id } = useParams();
  const [branch, setBranch] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      role_id: "",
      user_name: "",
      password: "",
      user_status: false,
      branch_id: "",
      user_id: "",
      branch_name: "",
      role_name: "", 
    }
  });

  

  useEffect(() => {
    const fetchUserData = async (id) => {
      try {
        const result = await stockManagementApis.getUserById(id);
        
        console.log('User fetched:', result[0])
        if (result && result.length > 0) {
          reset(result[0]);
        }
      
       
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id) {
      fetchUserData(id);
    }
  }, [id, reset]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await stockManagementApis.getRoles();
        setRoles(rolesData);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const branchData = await stockManagementApis.getBranch();
        setBranch(branchData);
      } catch (error) {
        console.error('Error fetching Branch:', error);
      }
    };
    fetchBranches();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (id) {
        await stockManagementApis.putUser(id, data);
        setMessage('User updated successfully');
      } else {
        await stockManagementApis.postUser(data);
        setMessage('User added successfully');
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
            <Link style={{ textDecoration: "none", color: "black" }} to="/User"> User&nbsp;
              <i className="fa fa-angle-right"></i>
            </Link>
          </Link>
          <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;{id ? 'Edit User' : 'Add User'}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Container fluid>
        <Row className="justify-content-center">
          <Col lg={12} md={6}>
            <Card style={{ boxShadow: "0 0 5px #a3a3a3" }}>
              <Card.Header className="text-dark bg-white" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                {id ? 'Edit User' : 'Add User'}
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
                          placeholder="Enter name"
                          {...register('name', {
                            required: 'Name is required',
                            minLength: { value: 2, message: 'Name must be at least 2 characters long' }
                          })}
                        />
                        {errors.name && <span className="text-danger">{errors.name.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter contact"
                          {...register('contact', {
                            required: 'Contact is required',
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: 'Invalid contact number'
                            }
                          })}
                        />
                        {errors.contact && <span className="text-danger">{errors.contact.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                          as="select"
                          {...register('role_id', { required: 'Role is required' })}
                        >
                          <option value="">Select a role</option>
                          {roles.map((role) => (
                            <option key={role.role_id} value={role.role_id}>
                              {role.name}
                            </option>
                          ))}
                        </Form.Control>
                        {errors.role_id && <span className="text-danger">{errors.role_id.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter email"
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                        {errors.email && <span className="text-danger">{errors.email.message}</span>}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter user name"
                          {...register('user_name', {
                            required: 'User name is required',
                            minLength: { value: 4, message: 'User name must be at least 4 characters long' }
                          })}
                        />
                        {errors.user_name && <span className="text-danger">{errors.user_name.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter password"
                          {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters long' }
                          })}
                        />
                        {errors.password && <span className="text-danger">{errors.password.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Branch</Form.Label>
                        <Form.Control
                          as="select"
                          {...register('branch_id', { required: 'Branch is required' })}
                        >
                          <option value="">Select a branch</option>
                          {branch.map((brh) => (
                            <option key={brh.branch_id} value={brh.branch_id}>
                              {brh.name}
                            </option>
                          ))}
                        </Form.Control>
                        {errors.branch_id && <span className="text-danger">{errors.branch_id.message}</span>}
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select {...register('user_status'?'Active':'Inactive')}>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className='float-end'>
                    <NavLink to="/User">
                      <Button type="button" className="" variant="danger">Cancel</Button>
                    </NavLink>
                    <Button type="submit" className="mx-2" variant="primary">Submit</Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Main>
  );
}
