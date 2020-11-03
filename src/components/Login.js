import React, {Component} from "react";
import '../App.css';
import {Button, Form} from "react-bootstrap";
import {AppContext} from "../AppContext";
import {Redirect} from "react-router-dom";


class Login extends Component {

    static contextType = AppContext;

    state = {
        login: '',
        password: '',
        user: {},
        isLogged: false,
        errorMessage: ''
    }

    handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        this.setState(
            {
                [name]: value,
            }
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.submitToAPI(this.state);
    }


    submitToAPI = (props) => {
        console.log(`${this.context.hostname}/api/user/auth`);
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${props.login}`,
                'password': `${props.password}`,
            },
        };
        fetch(`${this.context.hostname}/api/user/auth`, requestOptions)
            .then(response => response.json())
            .then(user => {
                this.setState({
                        user
                    }
                )
                if (user.id > 0) {
                    this.context.toggleUserNameState(user.userName);
                    this.context.toggleLoginState(this.state.login);
                    this.context.togglePasswordState(this.state.password);
                    this.context.toggleLoggedState(true);
                    this.context.toggleFirstNameState(user.firstName);
                    this.context.toggleLastNameState(user.lastName);
                    user.roles.map(item => {
                        if (item.role === 'ADMIN') {
                            this.context.toggleAdminState(true);
                        }
                    })
                    this.setState({isLogged: true})
                } else {
                    this.setState({errorMessage: 'Błędny login lub hasło'})
                }
            })
    }

    render() {

        return (
            <div className="fragment">
                {this.state.isLogged ? <Redirect to="/home"/> : ''}
                <Form style={{
                    paddingTop: '50px',
                    maxWidth: '500px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    float: 'none',
                }} className='span9 centred'>
                    <h3>
                        Logowanie </h3>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Wpisz email..."
                            value={this.state.login}
                            onChange={this.handleChange}
                            name="login"
                        />
                        <Form.Text className="text-danger">
                            {this.state.errorMessage}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Hasło</Form.Label>
                        <Form.Control
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                            name="password"
                            placeholder="Wpisz hasło..."
                        />
                    </Form.Group>
                    <Button
                        variant="outline-secondary"
                        type="submit"
                        onClick={this.handleSubmit}
                    >
                        Zaloguj
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Login;
