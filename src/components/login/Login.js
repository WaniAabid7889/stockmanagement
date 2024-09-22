import stockManagementApis from '../apis/StockManagementApis';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Form, Image } from 'react-bootstrap';
import { useContext, useState } from 'react';
import '../../App.css';
import { AuthContext } from '../context/AuthProvider';


const Login = () => {

    const { setToken, login } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loginMessage, setLoginMessage] = useState('');
    const [show, setShow] = useState(false);
    const navigate = useNavigate();


    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        let formErrors = {};
        if (!email) {
            formErrors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            formErrors.email = 'Email is not valid';
        }

        if (!password) {
            formErrors.password = 'Password is required';
        } else if (password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };


    const getLogin = async (email, password) => {
        try {
            const response = await stockManagementApis.getloginUser(email, password);
            setEmail(email);
            setPassword(password);
            return response;
        } catch (error) {
            console.error('Error fetching data:', error);
            setShow(true);
            setErrors({ message: 'Failed to login, please try again later.' });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (validateForm()) {
                const response = await getLogin(email, password)
                const accessToken = response?.data?.token;
                if (response.success) {
                    setToken(accessToken);
                    login(response.token);
                    navigate('/home');
                }
                else {
                    setLoginMessage(response.message);
                    setShow(true);
                    setErrors({ message: response.message });
                    setToken(null);
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setShow(true);
            setErrors({ message: 'Failed to login, please try again later.' });
            setToken(null);
        }
    };

    return (
        <div className="container-fluid p-2 ">
            <div className='d-flex justify-content-center align-items-center mt-5'>
                <Card style={{
                    width: '27%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 20px rgba(0, 0, 0, 0.1)'  
                }}>
                    <Card.Header className="text-center bg-primary">
                        <h1 className='text-center text-light mt-5'>Welcome Back</h1>
                    </Card.Header>
                    <Image
                        src="/images/stock.png"
                        style={{
                            height: "210px",
                            width: "50%",
                            margin: "auto",
                            objectFit: 'cover'
                        }}
                        className='mt-4 justify-content-center align-items-center'
                    />
                    <Card.Body
                        className="justify-content-center align-items-center mb-5"
                        style={{
                            backgroundColor: 'transparent',
                            color: 'black'
                        }}
                    >
                        <Form onSubmit={handleSubmit} style={{ color: "black" }}>
                            {show && <Alert style={{ color: 'red' }}>{errors.message || "Login failed"}</Alert>}
                            <Form.Group className="mt-2">
                                <Form.Control
                                    type="email"
                                    className='rounded-0'
                                    value={email}
                                    placeholder="Enter Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        border: "none",
                                        borderBottom: "1px solid black",
                                        color: 'black',
                                        backgroundColor: 'transparent',
                                        boxShadow: "none",
                                        fontSize: "16px"
                                    }}
                                />
                                {errors.email && <small className="text-dark">{errors.email}</small>}
                            </Form.Group>
                            <Form.Group className="mt-5">
                                <Form.Control
                                    type="password"
                                    className='rounded-0'
                                    value={password}
                                    placeholder="Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid black',
                                        color: 'black',
                                        boxShadow: "none",
                                        fontSize: "16px",
                                    }}
                                />
                                {errors.password && <small className="text-dark">{errors.password}</small>}
                            </Form.Group>
                            <Button
                                className='mt-5 w-100'
                                type="submit"
                                style={{
                                    fontSize: '1rem',
                                    textTransform: "uppercase"
                                }}
                            >
                                Sign In
                            </Button>
                        </Form>
                        {loginMessage ? (
                            <div className="mt-3 text-dark text-center">{loginMessage}</div>
                        ) : (
                            <div className="mt-3 text-dark text-center">{loginMessage}</div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        </div>

    );
};

export default Login;
