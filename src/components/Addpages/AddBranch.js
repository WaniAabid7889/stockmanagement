import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb } from 'react-bootstrap';
import { useParams, NavLink, Link } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddBranch() {
    const { id } = useParams();
    console.log("id=>", id);

    const [object, setObject] = useState({
        branch_id: "",
        name: "",
        location: "",
        city: "",
        state: "",
        branch_status: false
    });
    const [message, setMessage] = useState('');

    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchBranchData = async () => {
                try {
                    const response = await stockManagementApis.getBranchById(id);
                    setObject(response);
                } catch (error) {
                    console.error('Error fetching branch data:', error);
                }
            };
            fetchBranchData();
        }
    }, [id]);

    const addBranch = async () => {
        try {
            console.log("object=>", object);
            await stockManagementApis.postBranch(object);
            setMessage("branch added successfully");
            console.log('Branch added:', object);
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage("branch not added");
        }
    };

    const updateBranch = async (id) => {
        console.log("update id =>", id);
        try {
            await stockManagementApis.putBranch(id, object);
            console.log('Branch updated:', object);
            setMessage("branch updated successfully");
        } catch (error) {
            console.error('Error updating Branch:', error);
            setMessage("branch not updated");
        }
    };

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setObject({
            ...object,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            if (id) {
                updateBranch(id);
            } else {
                addBranch();
            }
        }
        setValidated(true);
    };

    return (
        <Main>
            <div className='my-2' style={{ fontFamily: "sans-serif", position: 'relative', left: '15px' }}>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp;
                        <i class="fa fa-angle-right"></i>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/branch"> Branch&nbsp;
                            <i class="fa fa-angle-right"></i>
                        </Link>
                    </Link>
                    <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;{id ? 'Edit Branch':'Add Branch'}</Breadcrumb.Item>

                </Breadcrumb>
            </div>
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Card style={{ boxShadow: "0 0 5px #a3a3a3" }} >
                            <Card.Header className=" text-dark bg-white" style={{ fontSize: "20px", fontWeight: 'bold' }}>
                                {id ? 'Edit Branch' : 'Add Branch'}
                            </Card.Header>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 background-transprant" controlId="branchName">
                                                <Form.Label>Branch Name</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    value={object.name}
                                                    onChange={handleChange}

                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a branch name.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="location">
                                                <Form.Label>Location</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    name="location"
                                                    placeholder="Enter location"
                                                    value={object.location}
                                                    onChange={handleChange}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a location.
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select value='branch_status'>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3" controlId="state">
                                                <Form.Label>State</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    name="state"
                                                    placeholder="Enter state"
                                                    value={object.state}
                                                    onChange={handleChange}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a state.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="city">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    required
                                                    type="text"
                                                    name="city"
                                                    placeholder="Enter city"
                                                    value={object.city}
                                                    onChange={handleChange}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    Please provide a city.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button variant="primary" type="submit" className="float-end">Submit</Button>{message}

                                    <NavLink to={'/branch'}>
                                        <Button variant="danger" type="button" className="float-end mx-2">Cancel</Button>
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
