import React, {Component} from "react";
import '../App.css';
import {Button, Row, Card, Col} from "react-bootstrap";
import  {AppContext} from "../AppContext";
import {Link, Redirect} from "react-router-dom";


class Home extends Component {

    static contextType = AppContext;


    render() {

        return (
            <div className="fragment" style={{
                paddingLeft: '100px',
                paddingRight: '100px',
                paddingTop: '60px'
            }}>
                {this.context.isUserLogged===false ? <Redirect to="/login" /> : ''}
                <Row className="cards2">
                    <Col className="row justify-content-md-center cards imageClick">
                        <Link to="/machineList" style={{ textDecoration: 'none' }}>
                        <Card style={{width: '14rem', paddingLeft: '30px', paddingRight: '30px'}}
                              className="imageClick"
                        >
                            <Card.Img variant="top"
                                      src={require("../../src/static/lasermachine.jpg")}
                                      data-link='/machineList'
                                      className="imageClick"
                            />
                            <Card.Body
                                data-link='/machineList'
                            >
                                <Card.Title
                                    data-link='/machineList'
                                    style={{fontSize: '16px'}}
                                > MASZYNY </Card.Title>

                            </Card.Body>
                        </Card>
                </Link>
                    </Col>
                    <Col className="row justify-content-md-center cards">
                        <Link to="/customerList" style={{ textDecoration: 'none' }}>
                        <Card style={{width: '14rem', paddingLeft: '30px', paddingRight: '30px'}} className="imageClick"
                              >
                            <Card.Img variant="top"
                                      src={require("../../src/static/males-2081830_1280.jpg")}
                                      data-link='/customerList'
                                      style={{padding: '20px'}}
                            />
                            <Card.Body data-link='/customerList'>
                                <Card.Title data-link='/customerList'
                                            style={{fontSize: '16px'}}
                                >KONTRAHENCI</Card.Title>
                            </Card.Body>
                        </Card>
                        </Link>
                    </Col>
                    <Col className="row justify-content-md-center cards">
                        <Link to="/categoryList" style={{ textDecoration: 'none' }}>
                        <Card style={{width: '14rem', paddingLeft: '30px', paddingRight: '30px'}} className="imageClick"
                              >
                            <Card.Img variant="top"
                                      src={require("../../src/static/search-2876776_1280.jpg")}
                                      data-link='/categoryList'
                                      style={{padding: '20px'}}
                            />
                            <Card.Body data-link='/categoryList'>
                                <Card.Title data-link='/categoryList'
                                            style={{fontSize: '16px'}}>KATEGORIE</Card.Title>
                            </Card.Body>
                        </Card>
                        </Link>
                    </Col>
                    {this.context.isAdmin===true ?
                    <Col className="row justify-content-md-center cards">
                        <Link to="/userList" style={{ textDecoration: 'none' }}>
                        <Card style={{width: '14rem', paddingLeft: '30px', paddingRight: '30px'}} className="imageClick"
                              >
                            <Card.Img variant="top"
                                      src={require("../../src/static/craftsmen-1019836_1280.jpg")}
                                      data-link='/userList'
                            />
                            <Card.Body data-link='/userList'>
                                <Card.Title data-link='/userList'
                                            style={
                                                {fontSize: '16px'}
                                            }
                                >PRACOWNICY</Card.Title>
                            </Card.Body>
                        </Card>
                        </Link>
                    </Col> : false}
                    {this.context.isAdmin===true ?
                    <Col className="row justify-content-md-center cards">
                        <Link to="/logs" style={{ textDecoration: 'none' }}>
                        <Card style={{width: '14rem', paddingLeft: '30px', paddingRight: '30px'}} className="imageClick"
                              >
                            <Card.Img variant="top"
                                      src={require("../../src/static/white-male-1871436_640.jpg")}
                                      data-link='/logs'
                                      style={{padding: '20px'}}
                            />
                            <Card.Body data-link='/logs'>
                                <Card.Title data-link='/logs'
                                            style={{
                                                fontSize: '16px'
                                            }}
                                >LOGI</Card.Title>
                            </Card.Body>
                        </Card>
                        </Link>
                    </Col> : false}
                </Row>
            </div>
        )
    }
}

export default Home;
