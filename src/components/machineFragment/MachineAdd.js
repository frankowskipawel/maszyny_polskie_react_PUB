import React, {Component} from "react";
import {Button, Form} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import '../../App.css';
import './MachineEdit.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {DropdownButton} from "react-bootstrap/DropdownButton";
import {AppContext} from "../../AppContext";


class MachineAdd extends Component {

    static contextType = AppContext;

    state = {
        data: {
            name: '',
            category: '',
            customer: '',
            machine: {
                name: '',
                category: {},
                customer: '',
                serialNumber: '',
                sourcePower: '',
                transferDate: '',
                streetAddress: '',
                zipCode: '',
                city: ''
            }
        },
        customers: [],
        categories: [],
        exit: false,
        delete: false,
        showDeleteModal: false,
        redirect: ''
    }

    componentDidMount() {

        fetch(`${this.context.hostname}/api/ftp/getFtpConnection`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    connectionFTP: data,
                    isDataLoaded: true
                })
            });

        fetch(`${this.context.hostname}/api/customer/findAll`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    customers: [{shortName: 'Wybierz...'}, ...data],
                    isDataLoaded: true
                })

            });

        fetch(`${this.context.hostname}/api/category/findAll`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    categories: [{name: 'Wybierz...'}, ...data],
                    isDataLoaded: true
                })
            });
    }

    handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        let id = '';
        if (name === 'category' || name == 'customer') {
            id = e.target.children[e.target.selectedIndex].id;
        }

        this.setState(prevState => (
            {

                data: {
                    ...prevState.data,
                    [name]: id,
                    machine: {
                        ...prevState.data.machine,
                        [name]: value
                    }
                }
            }
        ))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.name.value;
        if (value.length < 3) {
            this.setState({
                validatorMessage: 'Nazwa musi mieć minimum 3 znaki'
            })
        } else {
            this.submitToAPI(this.state.data.machine.name, this.state.data.category, this.state.data.customer, this.state.data.machine.serialNumber, this.state.data.machine.sourcePower, this.state.data.machine.transferDate, this.state.data.machine.streetAddress, this.state.data.machine.zipCode, this.state.data.machine.city)
            this.setState({
                machine: {},
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (name, category, customer, serialNumber, sourcePower, transferDate, streetAddress, zipCode, city) => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };
        fetch(`${this.context.hostname}/api/device/insert?name=${name.replace("&", "%26")}&categoryId=${category}&customerId=${customer}&serialNumber=${serialNumber.replace("&", "%26")}&sourcePower=${sourcePower.replace("&", "%26")}&transferDate=${transferDate.replace("&", "%26")}&streetAddress=${streetAddress.replace("&", "%26")}&zipCode=${zipCode.replace("&", "%26")}&city=${city.replace("&", "%26")}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd"})
                }
                ;
            })
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/machineList'})
    }

    render() {

        if (this.state.exit === true) {
            return (<Redirect to="/machineList"/>
            )
        }

        return (

            <div className="fragment">
                {this.context.isUserLogged === false ? <Redirect to="/login"/> : ''}
                {this.state.redirect != '' ? <Redirect to={this.state.redirect}/> : ''}
                <Row>
                    <Col sm={5}>
                        <h3><Button variant="light" onClick={this.handleBackOnClick}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-left"
                                 fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </Button>
                            &nbsp;Dodawanie nowej maszyny
                        </h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Label>Nazwa
                            </Form.Label>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control
                                    type="text" name="name"
                                    value={this.state.data.machine.name}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Kategoria
                                </Form.Label>
                                <Form.Control as="select" name="category"
                                              value={this.state.data.machine.category}
                                              onChange={this.handleChange}>
                                    {this.state.categories.map(category =>
                                        <option id={category.id}>{category.name}</option>
                                    )}
                                </Form.Control>
                                <Form.Label>Kontrahent
                                </Form.Label>
                                <Form.Control as="select" name="customer"
                                              value={this.state.data.machine.customer}
                                              onChange={this.handleChange}>
                                    {this.state.customers.map(customer =>
                                        <option id={customer.id}>{customer.shortName}&nbsp;
                                            {customer.streetAddress}&nbsp;
                                            {customer.zipCode}&nbsp;
                                            {customer.city}&nbsp;
                                            {customer.nip}</option>
                                    )}
                                </Form.Control>
                                <Form.Label>Numer seryjny
                                </Form.Label>
                                <Form.Control
                                    type="text" name="serialNumber"
                                    value={this.state.data.machine.serialNumber}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Moc źródła
                                </Form.Label>
                                <Form.Control
                                    type="text" name="sourcePower"
                                    value={this.state.data.machine.sourcePower}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Data przekazania
                                </Form.Label>
                                <Form.Control
                                    type="date" name="transferDate"
                                    value={this.state.data.machine.transferDate}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <hr/>
                                <Form.Label>Ulica
                                </Form.Label>
                                <Form.Control
                                    type="text" name="streetAddress"
                                    value={this.state.data.machine.streetAddress}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Kod pocztowy
                                </Form.Label>
                                <Form.Control
                                    type="text" name="zipCode"
                                    value={this.state.data.machine.zipCode}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Miasto
                                </Form.Label>
                                <Form.Control
                                    type="text" name="city"
                                    value={this.state.data.machine.city}
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
                                Zapisz
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => this.setState({redirect: '/machineList'})}>
                                Anuluj
                            </Button>
                        </Form>
                    </Col>
                    <Col>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default MachineAdd;