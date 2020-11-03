import React, {Component} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import '../../App.css';
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {AppContext} from "../../AppContext";

const CustomerMachines = (value) => {
    return (
        value.machines.map(
            machine =>
                <Card style={{margin: '3px'}}>

                    <Card.Body style={{padding: '5px', margin: '3px'}}>
                        <Link to={`/machineEdit?id=${machine.id}`}>Nazwa: {machine.name}</Link><br/>
                        Moc źródła: {machine.sourcePower}<br/>
                        Kontrahent: {machine.customer.shortName}<br/>
                        Kategoria: {machine.category.name}<br/>
                        S/N: {machine.serialNumber}<br/>
                    </Card.Body>
                </Card>
        )
    );
}

class CategoryEdit extends Component {

    static contextType = AppContext;

    state = {
        id: new URLSearchParams(this.props.location.search).get("id"),
        categoryName: new URLSearchParams(this.props.location.search).get("name"),
        customerMachines: [],
        exit: false,
        delete: false,
        showDeleteModal: false,
        redirect: ''
    }

    componentDidMount() {
        fetch(`${this.context.hostname}/api/device/findByCategory?id=${this.state.id}`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(machines => {
                this.setState({
                        customerMachines: machines,

                        isDataLoaded: true
                    }
                )
            });
    }

    handleChange = (e) => {
        const name = e.target.value;
        this.setState(
            {categoryName: name}
        )
    }
    handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.categoryName.value;
        if (value.length < 3) {
            this.setState({
                validatorMessage: 'Kategoria musi mieć minimum 3 znaki'
            })
        } else {
            this.submitToAPI(this.state.id, this.state.categoryName)
            this.setState({
                categoryName: '',
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (id, categoryName) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };
        fetch(`${this.context.hostname}/api/category/update?id=${id}&name=${categoryName}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Podana kategoria już istnieje!"})
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
        fetch(`${this.context.hostname}/api/category/delete/${this.state.id}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Błąd!"})
                }

            })
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/categoryList'})
    }

    render() {

        if (this.state.exit === true) {
            return (<Redirect to="/categoryList"/>
            )
        }

        return (

            <div className="fragment">
                {this.context.isUserLogged === false ? <Redirect to="/login"/> : ''}
                {this.state.redirect != '' ? <Redirect to={this.state.redirect}/> : ''}
                <h3>
                    <Button variant="light" onClick={this.handleBackOnClick}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-left"
                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </Button>
                    &nbsp;Edycja kategorii
                </h3>
                <Row>
                    <Col sm={5}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Nazwa kategorii (id: {this.state.id})
                                    {this.context.isAdmin === true ?
                                        <Button onClick={this.handleOnClickDelete}
                                                size="sm"
                                                variant="outline-dark"
                                                style={{marginLeft: "5px"}}>
                                            Usuń
                                        </Button> : false}
                                </Form.Label>
                                <Form.Control
                                    type="text" name="categoryName"
                                    value={this.state.categoryName}
                                    placeholder="Wpisz kategorie..."
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
                                onClick={() => this.setState({redirect: '/categoryList'})}>
                                Anuluj
                            </Button>
                        </Form>
                    </Col>
                    <Col>
                        <br/>
                        <Tabs
                            id="controlled-tab-example">
                            <Tab eventKey="machines" title="Maszyny">
                                <CustomerMachines machines={this.state.customerMachines}/>
                            </Tab>

                        </Tabs>
                    </Col>
                </Row>
                <Modal show={this.state.showDeleteModal} onHide={() => this.setState({showDeleteModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Potwierdzenie</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Czy napewno chcesz usunąć: {this.state.categoryName}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({showDeleteModal: false})}>
                            Anuluj
                        </Button>
                        <Button variant="primary" onClick={this.handleDeleteOnClick}>
                            Usuń
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default CategoryEdit;