import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v0/auth/signin', formData);
      console.log(response)
      if (response.status === 200 && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setErrorMessage('');
        setSuccessMessage('Successfully Sign in!');
        
/*         const decodedToken = jwt_decode(response.data.token);
        console.log(decodedToken);
 */        
      } else {
        setErrorMessage('Sign in failed. Please try again.');
        setSuccessMessage('');
        
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 500 && error.response.data.error === "No value present") {
        setErrorMessage('Invalid email or password.');
      } else {
        setErrorMessage('Sign in failed. Please try again.');
      }
      
    }
  };
  
  return (
    <div className="container d-flex justify-content-center">
      <div className="card card-limit">
        <div className="card-header">Sign In</div>
        <div className="card-body card-body d-flex flex-column align-items-center">

          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button className="mt-3" variant="primary" type="submit">
              Sign In
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
