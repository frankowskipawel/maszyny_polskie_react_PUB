import React from "react";
import {Form, Button} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {AppContext} from "../../AppContext";

const {Component} = require("react");

class CategoryAdd extends Component {

    static contextType = AppContext;

    state = {
        categoryName: '',
        validatorMessage: '',
        exit: false,
        redirect: ''
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const value = e.target.categoryName.value;
        if (value.length < 3) {
            this.setState({
                validatorMessage: 'Kategoria musi mieć minimum 3 znaki'
            })
        } else {
            this.submitToAPI(this.state.categoryName)
            this.setState({
                categoryName: '',
                validatorMessage: ''
            })
        }
    }

    submitToAPI = (categoryName) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            },
        };
        fetch(`${this.context.hostname}/api/category/insert?name=${categoryName}`, requestOptions)
            .then(responseData => {
                if (responseData.status === 200) {
                    this.setState({exit: true,})
                } else {
                    this.setState({validatorMessage: "Podana kategoria już istnieje!"})
                }
            })
    }

    handleChange = (e) => {
        const name = e.target.value;
        this.setState(
            {categoryName: name}
        )
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
                {this.state.redirect !== '' ? <Redirect to={this.state.redirect}/> : ''}
                <h3>
                    <Button variant="light" onClick={this.handleBackOnClick}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-left"
                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </Button>
                    &nbsp;Dodawanie kategorii
                </h3>
                <Row>
                    <Col sm={5}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Nazwa kategorii</Form.Label>
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
                                Dodaj
                            </Button>
                            <Button
                                size="sm"
                                variant="outline-dark"
                                onClick={() => this.setState({redirect: '/categoryList'})}>
                                Anuluj
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CategoryAdd;