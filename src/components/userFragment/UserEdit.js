import React, {Component} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import '../../App.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AppContext} from "../../AppContext";

class UserEdit extends Component {

    static contextType = AppContext;

    state = {
        id: new URLSearchParams(this.props.location.search).get("id"),
        user: {},
        userName: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
        country: '',
        isActive: false,
        isAdmin: false,

        validatorMessage: '',
        delete: false,
        showDeleteModal: false,
        exit: false,
        redirect: ''
    }

    componentDidMount() {
        fetch(`${this.context.hostname}/api/user/findById?id=${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(user => {
                this.setState({
                        userName: user.userName,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isActive: user.active,
                        user
                    },
                )
                user.roles.map(item => {
                    if (item.role === 'ADMIN') {
                        this.setState({isAdmin: true})
                    }
                })
            });
    }

    handleChange = (e) => {
        let value = e.target.value;
        let name = e.target.name;
        if (value === 'on') {
            value = e.target.checked;
        }
        this.setState(
            {
                [name]: value,
            }
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.userName.value;
        if (value.length < 3) {
            this.setState({
                validatorMessage: 'Błąd'
            })
        } else {
            this.submitToAPI(
                this.state.id,
                this.state.userName,
                this.state.password,
                this.state.email,
                this.state.firstName,
                this.state.lastName,
                this.state.country,
                this.state.isActive,
                this.state.isAdmin)
            this.setState({
                shortName: '',
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (id, userName, password, email, firstName, lastName, country, isActive, isAdmin) => {
        let role;
        if (isAdmin) {
            role = 'ADMIN'
        } else {
            role = 'USER'
        }

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`,
                'emailUser': `${email}`,
                'passwordUser': `${password}`
            },
        };
        fetch(`${this.context.hostname}/api/user/update?id=${id}&userName=${userName.replace("&", "%26")}&firstName=${firstName.replace("&", "%26")}&lastName=${lastName.replace("&", "%26")}&country=${country.replace("&", "%26")}&active=${isActive}&role=${role.replace("&", "%26")}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd"})
                }
            })
    }

    handleOnClickDelete = () => {
        this.setState({
            showDeleteModal: true
        })
    }

    handleDeleteOnClick = () => {
        this.setState({
            delete: true,
            showDeleteModal: false,
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };
        fetch(`${this.context.hostname}/api/user/delete?id=${this.state.id}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd!"})
                }
            })
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/userList'})
    }

    render() {

        if (this.state.exit === true) {
            return (<Redirect to="/userList"/>
            )
        }

        return (

            <div className="fragment">
                {this.context.isUserLogged === false ? <Redirect to="/login"/> : ''}
                {this.context.isAdmin === false ? <Redirect to="/home"/> : ''}
                {this.state.redirect !== '' ? <Redirect to={this.state.redirect}/> : ''}
                <Row>
                    <Col sm={5}>
                        <h3>
                            <Button variant="light" onClick={this.handleBackOnClick}>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-left"
                                     fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            </Button>
                            &nbsp;Edycja pracownika <Button onClick={this.handleOnClickDelete}
                                                            size="sm"
                                                            variant="outline-dark"
                                                            className='float float-right'
                                                            style={{marginLeft: "5px"}}>
                            Usuń
                        </Button></h3>

                        <Form onSubmit={this.handleSubmit}>
                            <Form.Check type="checkbox"
                                        label="Aktywny"
                                        name="isActive"
                                        onChange={this.handleChange}
                                        checked={this.state.isActive}
                                        className='float float-right'/>
                            <Form.Check type="checkbox"
                                        label="Admin&nbsp;&nbsp;"
                                        name="isAdmin"
                                        onChange={this.handleChange}
                                        checked={this.state.isAdmin}
                                        className='float float-right'/>


                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Stanowisko
                                </Form.Label>

                                <Form.Control
                                    type="text" name="userName"
                                    value={this.state.userName}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Imię
                                </Form.Label>
                                <Form.Control
                                    type="text" name="firstName"
                                    value={this.state.firstName}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Nazwisko
                                </Form.Label>
                                <Form.Control
                                    type="text" name="lastName"
                                    value={this.state.lastName}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Email
                                </Form.Label>
                                <Form.Control
                                    type="email" name="email"
                                    value={this.state.email}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                    disabled={true}
                                />
                                <Form.Label>Hasło
                                </Form.Label>
                                <Form.Control
                                    type="password" name="password"
                                    value={this.state.password}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />

                            </Form.Group>
                            <Button
                                variant="outline-dark"
                                type="submit"
                                size="sm"
                                style={{marginRight: "5px"}}>
                                Zapisz
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => this.setState({redirect: '/userList'})}>
                                Anuluj
                            </Button>
                        </Form>
                        <Modal show={this.state.showDeleteModal} onHide={() => this.setState({showDeleteModal: false})}>
                            <Modal.Header closeButton>
                                <Modal.Title>Potwierdzenie</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>Czy napewno chcesz usunąć: {this.state.shortName}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>
                                    Anuluj
                                </Button>
                                <Button variant="primary" onClick={this.handleDeleteOnClick}>
                                    Usuń
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default UserEdit;