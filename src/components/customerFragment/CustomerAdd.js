import React, {Component} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import '../../App.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AppContext} from "../../AppContext";

class CustomerAdd extends Component {

    static contextType = AppContext;

    state = {
        id: '',
        shortName: '',
        fullName: '',
        streetAddress: '',
        zipCode: '',
        city: '',
        nip: '',
        regon: '',
        phoneNumber: '',
        email: '',
        validatorMessage: '',
        exit: false,
        redirect: ''
    }

    handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        this.setState(
            {
                [name]: value,
            }
        )
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.shortName.value;
        if (value.length < 3) {
            this.setState({
                validatorMessage: 'Kontrahent musi mieć minimum 3 znaki'
            })
        } else {
            this.submitToAPI(this.state.id, this.state.shortName, this.state.fullName, this.state.streetAddress, this.state.zipCode, this.state.city, this.state.nip, this.state.regon, this.state.phoneNumber, this.state.email)
            this.setState({
                shortName: '',
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (id, shortName, fullName, streetAddress, zipCode, city, nip, regon, phoneNumber, email) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };
        fetch(`${this.context.hostname}/api/customer/insert?id=${id.replace("&", "%26")}&shortName=${shortName.replace("&", "%26")}&fullName=${fullName.replace("&", "%26")}&street=${streetAddress.replace("&", "%26")}&zipCode=${zipCode.replace("&", "%26")}&city=${city.replace("&", "%26")}&nip=${nip.replace("&", "%26")}&regon=${regon.replace("&", "%26")}&phone=${phoneNumber.replace("&", "%26")}&emailCustomer=${email.replace("&", "%26")}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd"})
                }
                ;
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
        fetch(`${this.context.hostname}/api/customer/delete?id=${this.state.id}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd! Sprawdź czy z kontrahentem są powiązane zależności (maszyny itp.). Musisz je najpierw usunąć!"})
                }
                ;
            })
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/customerList'})
    }

    render() {

        if (this.state.exit === true) {
            return (<Redirect to="/customerList"/>
            )
        }

        return (

            <div className="fragment">
                {this.context.isUserLogged === false ? <Redirect to="/login"/> : ''}
                {this.state.redirect != '' ? <Redirect to={this.state.redirect}/> : ''}
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
                            &nbsp;Dodawanie kontrahenta
                        </h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Nazwa skrócona
                                </Form.Label>
                                <Form.Control
                                    type="text" name="shortName"
                                    value={this.state.shortName}
                                    placeholder="Wpisz kategorie..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Nazwa pełna
                                </Form.Label>
                                <Form.Control
                                    type="text" name="fullName"
                                    value={this.state.fullName}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Adres
                                </Form.Label>
                                <Form.Control
                                    type="text" name="streetAddress"
                                    value={this.state.streetAddress}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Kod pocztowy
                                </Form.Label>
                                <Form.Control
                                    type="text" name="zipCode"
                                    value={this.state.zipCode}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Miasto
                                </Form.Label>
                                <Form.Control
                                    type="text" name="city"
                                    value={this.state.city}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>NIP
                                </Form.Label>
                                <Form.Control
                                    type="text" name="nip"
                                    value={this.state.nip}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>REGON
                                </Form.Label>
                                <Form.Control
                                    type="text" name="regon"
                                    value={this.state.regon}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Telefon
                                </Form.Label>
                                <Form.Control
                                    type="text" name="phoneNumber"
                                    value={this.state.phoneNumber}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>E-mail
                                </Form.Label>
                                <Form.Control
                                    type="text" name="email"
                                    value={this.state.email}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Text className="validatorMessage">
                                    {this.state.validatorMessage}
                                </Form.Text>
                            </Form.Group>
                            <Button
                                variant="outline-dark"
                                type="submit"
                                size="sm"
                                style={{marginRight: "5px"}}>
                                Dodaj
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => this.setState({redirect: '/customerList'})}>
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

export default CustomerAdd;