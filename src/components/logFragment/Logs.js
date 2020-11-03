import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {Redirect} from "react-router-dom";
import {AppContext} from "../../AppContext";
import {Button} from "react-bootstrap";


class Logs extends Component {

    static contextType = AppContext;

    state ={
        logs: [],
        redirect: ''
    }

    componentDidMount() {
        fetch(`${this.context.hostname}/api/log/findAll`, {
            method: 'POST',
            headers: {
                'email': `${this.context.login}`,
                'password': `${this.context.password}`
            }
        })
            .then(response => response.json())
            .then(logs => {
                this.setState({
                        logs
                    }
                )
            });
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/home'})
    }

    render() {
        return (
            <div className="fragment">
                {this.context.isUserLogged===false ? <Redirect to="/login" /> : ''}
                {this.context.isAdmin===false ? <Redirect to="/home" /> : ''}
                {this.state.redirect!='' ? <Redirect to={this.state.redirect} /> : ''}
                <h3>
                    <Button variant="light" onClick={this.handleBackOnClick}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-return-left"
                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                        </svg>
                    </Button>
                    &nbsp;Logi </h3>
                {this.state.logs.map( log =>
                    <Card style={{margin: '3px'}}>

                        <Card.Body style={{padding: '5px', margin: '3px'}}>

                            id: {log.id}&nbsp;&nbsp;
                            [{log.date}]&nbsp;&nbsp;
                            user: {log.user}<br/>
                            {log.value}

                        </Card.Body>
                    </Card>
                )}
            </div>
        )
    }
}

export default Logs;
