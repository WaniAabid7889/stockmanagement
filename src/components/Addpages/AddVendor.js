import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useForm } from 'react-hook-form';
import stockManagementApis from '../apis/StockManagementApis';
import { Container, Row, Col, Form, Button, Card, Breadcrumb } from 'react-bootstrap';
import { useParams, NavLink, Link } from 'react-router-dom';
import Main from '../layout/Main';

export default function AddVendor() {
    const { id } = useParams();
    const [branch, setBranch] = useState([]);
    const [message, setMessage] = useState('');
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        defaultValues: {
            vendor_id: "",
            name: "",
            gst_no: "",
            mobile: "",
            is_active: false,
            address: "",
            city: "",
            state: "",
            branch_id: "",
        }
    });

    useEffect(() => {
        const fetchVendorData = async () => {
            if (id) {
                try {
                    const response = await stockManagementApis.getVendorById(id);
                    const vendorData = response[0];
                    for (const [key, value] of Object.entries(vendorData)) {
                        setValue(key, value);
                    }
                } catch (error) {
                    console.error('Error fetching Vendor data:', error);
                }
            }
        };
        fetchVendorData();
    }, [id, setValue]);

    const addVendor = async (data) => {
        try {
            await stockManagementApis.postVendor(data);
            console.log('Vendor added:', data);
            setMessage('Vendor added successfully');
        } catch (error) {
            console.error('Error submitting data:', error);
            setMessage('Failed to add vendor');
        }
    };

    const updateVendor = async (data) => {
        console.log("update id =>", id, data);
        try {
            await stockManagementApis.updateVendor(id, data);
            console.log('Vendor updated:', data);
            setMessage('Vendor updated successfully');
        } catch (error) {
            console.error('Error updating Vendor:', error);
            setMessage('Failed to update vendor');
        }
    };

    const onSubmit = (data) => {
        if (id) {
            updateVendor(data);
        } else {
            addVendor(data);
        }
    };

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
            <div style={{ position: 'relative', left: '15px'}}>
                <Breadcrumb>
                    <Link style={{ textDecoration: "none", color: "black" }} to="/Home">Home&nbsp;
                        <i className="fa fa-angle-right"></i>
                        <Link style={{ textDecoration: "none", color: "black" }} to="/vendor"> Vendor&nbsp;
                            <i className="fa fa-angle-right"></i>
                        </Link>
                    </Link>
                        <Breadcrumb.Item active style={{ fontWeight: "bold" }}>&nbsp;{id?'Edit Vendor':'Add Vendor'}</Breadcrumb.Item>
                </Breadcrumb>
            </div>

            <Container fluid>
                <Row className="justify-content-center p-3">
                    <Col lg={12} md={6}>
                        <Card style={{ boxShadow: "0 0 5px #a3a3a3" }}>
                            <Card.Header className="bg-white text-dark" style={{ fontSize: "16px", fontWeight: 'bold' }}>
                                {id ? 'Edit Vendor' : 'Add Vendor'}
                            </Card.Header>
                            <Card.Body>
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label>Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter name"
                                                    {...register('name', {
                                                        required: 'Name is required',
                                                        minLength: { value: 3, message: 'Name must be at least 3 characters' }
                                                    })}
                                                />
                                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mt-3">
                                                <Form.Label>GST No.</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter GST No."
                                                    {...register('gst_no', {
                                                        required: 'GST No. is required',
                                                        pattern: {
                                                            value: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                                                            message: 'Invalid GST No.'
                                                        }
                                                    })}
                                                />
                                                {errors.gst_no && <span className="text-danger">{errors.gst_no.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mt-3">
                                                <Form.Label>Mobile</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Mobile"
                                                    {...register('mobile', {
                                                        required: 'Mobile is required',
                                                        pattern: {
                                                            value: /^[0-9]{10}$/,
                                                            message: 'Invalid mobile number'
                                                        }
                                                    })}
                                                />
                                                {errors.mobile && <span className="text-danger">{errors.mobile.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mt-3">
                                                <Form.Label>Status</Form.Label>
                                                <Form.Select {...register('is_active'?'Active':'Inactive')}>
                                                    <option value="active">Active</option>
                                                    <option value="inactive">Inactive</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col lg={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter address"
                                                    {...register('address', { required: 'Address is required' })}
                                                />
                                                {errors.address && <span className="text-danger">{errors.address.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter City"
                                                    {...register('city', { required: 'City is required' })}
                                                />
                                                {errors.city && <span className="text-danger">{errors.city.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>State</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter state"
                                                    {...register('state', { required: 'State is required' })}
                                                />
                                                {errors.state && <span className="text-danger">{errors.state.message}</span>}
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Branch</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    {...register('branch_id', { required: 'Branch is required' })}
                                                >
                                                    <option value="">Select branch</option>
                                                    {branch.map((br) => (
                                                        <option key={br.branch_id} value={br.branch_id}>
                                                            {br.name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                {errors.branch_id && <span className="text-danger">{errors.branch_id.message}</span>}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="submit" className="float-end mx-3">Submit</Button>{message}
                                    <NavLink to='/vendor'>
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
