import React, { useContext, useEffect, useState } from 'react';
import { Card, Col, Image, Row, Form, Button } from 'react-bootstrap';
import stockManagementApis from '../apis/StockManagementApis';
import { AuthContext } from '../context/AuthProvider';
import { Link } from 'react-router-dom';
import Main from '../layout/Main';

export default function Profile() {
    const userData = useContext(AuthContext);
    const [object, setObject] = useState({
        name: "",
        contact: "",
        email: "",
        role_id: "",
        user_name: "",
        password: "",
        user_status: false,
        branch_id: "",
        user_id: "",
    });

    useEffect(() => {
        if (userData.loginData) {
            setObject({
                user_id: userData.loginData.user_id || "",
                name: userData.loginData.name || "",
                contact: userData.loginData.contact || "",
                email: userData.loginData.email || "",
                user_name: userData.loginData.user_name || "",
                password: userData.loginData.password || "",
                user_status: userData.loginData.user_status || false,
                branch_id: userData.loginData.branch_id || "",
                role_id: userData.loginData.role_id || "",
            });
        }
    }, [userData]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setObject({
            ...object,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await stockManagementApis.putUser(object.user_id, object);
            console.log('User updated:', object);
        } catch (error) {
            console.error('Error submitting data:', error);
        }
    };

    return (
        <Main>
            <Card className="mx-auto my-4 shadow-lg rounded" style={{ maxWidth: '35rem' }}>
                <Card.Header className="p-0" style={{ backgroundColor: '#007bff', height: '5rem', position: 'relative', borderRadius: '0.5rem 0.5rem 0 0' }}>
                    <Image
                        src="images/user.png"
                        roundedCircle
                        style={{
                            width: '100px',
                            height: '100px',
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            border: '5px solid white',
                        }}
                    />
                    <Link to="/Home">
                        <Button
                            variant="light"
                            style={{ position: 'absolute', top: '15px', right: '15px', borderRadius: '50%' }}
                        >
                            ×
                        </Button>
                    </Link>
                </Card.Header>
                <Card.Body className="text-left mt-3">
                    <Card.Title style={{ fontSize: '22px',textAlign:"center", fontWeight: 'bold' }}>{object.name}</Card.Title>
                    <Card.Text style={{ fontSize: '16px', textAlign:"center" , color: '#555' }}>{object.email}</Card.Text>
                    <Card.Text style={{ fontSize: '16px', textAlign:"center" , color: '#555' }}>User ID: {object.user_name}</Card.Text>
                

                    <Form onSubmit={handleSubmit} className="mt-4">
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formName">
                                    <Form.Label style={{fontFamily:"bold",fontSize:"12px",textAlign:"left"}}>Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={object.name}
                                        onChange={handleChange}
                                        className="rounded"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formEmail">
                                    <Form.Label style={{fontFamily:"bold",fontSize:"12px",textAlign:"left"}}>Email</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        name="email"
                                        placeholder="Enter Email"
                                        value={object.email}
                                        onChange={handleChange}
                                        className="rounded"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="formUserName">
                                    <Form.Label style={{fontFamily:"bold",fontSize:"12px",textAlign:"left"}}>User Name</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="user_name"
                                        placeholder="Enter User Name"
                                        value={object.user_name}
                                        onChange={handleChange}
                                        className="rounded"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="formContact">
                                    <Form.Label style={{fontFamily:"bold",fontSize:"12px",textAlign:"left"}}>Contact</Form.Label>
                                    <Form.Control
                                        required
                                        type="text"
                                        name="contact"
                                        placeholder="Enter Contact"
                                        value={object.contact}
                                        onChange={handleChange}
                                        className="rounded"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="justify-content-end">
                            
                            <Col xs="auto">
                                <Button type="submit" variant="primary" className="rounded">
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Main>
    );
}
