import React, {Component} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import '../../App.css';
import './MachineEdit.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import {DropdownButton} from "react-bootstrap/DropdownButton";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {AppContext} from "../../AppContext";
import MachineFiles from "./MachineFiles";
import MachineParameters from "./MachineParameters";
import MachineService from "./MachineService";


const DeviceNotes = (props) => {
    return (

        props.deviceNotes.map(
            note =>

                <Card style={{margin: '3px'}}>
                    <Card.Body style={{padding: '5px', margin: '3px'}}>{note.text}</Card.Body>
                </Card>
        )
    );
}


const Equipments = (value) => {

    return (
        value.props.machine.parts.map(
            part =>
                <Card style={{margin: '3px'}}>
                    <Card.Body style={{padding: '5px', margin: '3px'}}>
                        Nazwa: {part.name}<br/>
                        S/N: {part.serialNumber}<br/>
                        Producent: {part.producer}<br/>
                        Opis: {part.description}<br/>
                    </Card.Body>
                </Card>
        )
    )
}


class MachineEdit extends Component {

    static contextType = AppContext;

    state = {
        id: new URLSearchParams(this.props.location.search).get("id"),
        categoryId: '',
        customerId: '',
        machine: {
            name: '',
            category: {},
            customer: '',
            serialNumber: '',
            sourcePower: '',
            transferDate: '',
            streetAddress: '',
            zipCode: '',
            city: '',
            parts: []

        },
        connectionFTP: {
            FTP_HOSTNAME: '',
            FTP_LOGIN: '',
            FTP_PASSWORD: '',
        },
        customers: [],
        categories: [],
        services: [],
        deviceNotes: [],
        files: [],
        parameters: [],
        exit: false,
        delete: false,
        showDeleteModal: false,
        redirect: ''
    }

    componentDidMount() {
        fetch(`${this.context.hostname}/api/device/findById/${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(machine => {
                this.setState({
                        customerId: machine.customer.id,
                        categoryId: machine.category.id,
                        machine: {
                            ...machine,
                            category: machine.category.name,
                            customer: machine.customer.shortName
                        },
                        isDataLoaded: true
                    }
                )
            });

        fetch(`${this.context.hostname}/api/deviceNote/findByIdDevice?id=${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    deviceNotes: data,
                    isDataLoaded: true
                })
            });

        fetch(`${this.context.hostname}/api/file/findByDevice?idDevice=${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    files: data,
                    isDataLoaded: true
                })
                const filteredFiles = this.state.files.filter(file => !file.type.includes('PARAMETERS'))
                const filteredParameters = this.state.files.filter(file => file.type.includes('PARAMETERS'))
                this.setState({
                    files: filteredFiles,
                    parameters: filteredParameters
                })
            });

        fetch(`${this.context.hostname}/api/service/findByDevice?id=${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    services: data,
                    isDataLoaded: true
                })
            });

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
                    customers: data,
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
                    categories: data,
                    isDataLoaded: true
                })
            });
    }

    handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        let categoryId = this.state.categoryId;
        let customerId = this.state.customerId;
        if (name === 'category') {
            categoryId = e.target.children[e.target.selectedIndex].id;
        }
        if (name == 'customer') {
            customerId = e.target.children[e.target.selectedIndex].id;
        }

        this.setState(prevState => (
            {
                categoryId: categoryId,
                customerId: customerId,
                machine: {
                    ...prevState.machine,
                    [name]: value,
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
            this.submitToAPI(this.state.machine.id, this.state.machine.name, this.state.categoryId, this.state.customerId, this.state.machine.serialNumber, this.state.machine.sourcePower, this.state.machine.transferDate, this.state.machine.streetAddress, this.state.machine.zipCode, this.state.machine.city)
            this.setState({
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (id, name, category, customer, serialNumber, sourcePower, transferDate, streetAddress, zipCode, city) => {

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };

        fetch(`${this.context.hostname}/api/device/update?id=${id}&name=${name.replace("&", "%26")}&categoryId=${category}&customerId=${customer}&serialNumber=${serialNumber.replace("&", "%26")}&sourcePower=${sourcePower.replace("&", "%26")}&transferDate=${transferDate.replace("&", "%26")}&streetAddress=${streetAddress.replace("&", "%26")}&zipCode=${zipCode.replace("&", "%26")}&city=${city.replace("&", "%26")}`, requestOptions)
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
        fetch(`${this.context.hostname}/api/device/delete?id=${this.state.id}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd!"})
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
                            &nbsp;Szczegóły
                        </h3>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Nazwa (id: {this.state.id})
                                    {this.context.isAdmin === true ?
                                        <Button onClick={this.handleOnClickDelete}
                                                size="sm"
                                                variant="outline-dark"
                                                style={{marginLeft: "5px"}}>
                                            Usuń
                                        </Button> : false}
                                </Form.Label>
                                <Form.Control
                                    type="text" name="name"
                                    value={this.state.machine.name}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Kategoria
                                </Form.Label>
                                <Form.Control as="select" name="category"
                                              value={this.state.machine.category}
                                              onChange={this.handleChange}

                                >
                                    {this.state.categories.map(category =>
                                        <option id={category.id}>{category.name}</option>
                                    )}
                                </Form.Control>
                                <Form.Label>Kontrahent
                                </Form.Label>
                                <Form.Control as="select" name="customer"
                                              value={this.state.machine.customer}
                                              onChange={this.handleChange}>
                                    {this.state.customers.map(customer =>
                                        <option id={customer.id}>{customer.shortName}
                                        </option>
                                    )}
                                </Form.Control>
                                <Form.Label>Numer seryjny
                                </Form.Label>
                                <Form.Control
                                    type="text" name="serialNumber"
                                    value={this.state.machine.serialNumber}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Moc źródła
                                </Form.Label>
                                <Form.Control
                                    type="text" name="sourcePower"
                                    value={this.state.machine.sourcePower}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Data przekazania
                                </Form.Label>
                                <Form.Control
                                    type="date" name="transferDate"
                                    value={this.state.machine.transferDate}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />

                                <hr/>
                                <Form.Label>Ulica
                                </Form.Label>
                                <Form.Control
                                    type="text" name="streetAddress"
                                    value={this.state.machine.streetAddress}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Kod pocztowy
                                </Form.Label>
                                <Form.Control
                                    type="text" name="zipCode"
                                    value={this.state.machine.zipCode}
                                    placeholder="Wpisz..."
                                    onChange={this.handleChange}
                                />
                                <Form.Label>Miasto
                                </Form.Label>
                                <Form.Control
                                    type="text" name="city"
                                    value={this.state.machine.city}
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
                    <Col sm={7}>
                        <br/>
                        <Tabs style={{maxWidth: '100%'}}
                              id="controlled-tab-example">
                            <Tab eventKey="notes" title="Notatki">
                                <DeviceNotes deviceNotes={this.state.deviceNotes}/>
                            </Tab>
                            <Tab eventKey="files" title="Pliki">
                                <MachineFiles props={this.state.files}/>
                            </Tab>
                            <Tab eventKey="parameters" title="Parametry">
                                <MachineParameters props={this.state.parameters}/>
                            </Tab>
                            <Tab eventKey="equipments" title="Części">
                                <Equipments props={this.state}/>
                            </Tab>
                            <Tab eventKey="servis" title="Serwis">
                                <MachineService props={this.state.services}/>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default MachineEdit;