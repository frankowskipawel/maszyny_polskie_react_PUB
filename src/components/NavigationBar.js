import React, {Component} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown'
import {AppContext} from "../AppContext";
import {Link, Redirect} from 'react-router-dom';


class NavigationBar extends Component {

    static contextType = AppContext;

    state = {
        redirectLink: '',
        redirect: false
    }

    handleLoginOnClick = () => {
        window.location.href = `/`;

        if (this.context.isUserLogged === true) {
            window.location.href = `/`;
        }
        this.setState({redirectLink: '/login'})
    }


    render() {
        return (
            <div>
                {this.state.redirectLink !== '' ? <Redirect to={this.state.redirectLink}/> : ''}
                <Navbar bg="light" expand="lg" fixed={"top"}>
                    <Link to="/home">
                        <Navbar.Brand>
                            <img
                                src="logo.png"
                                width="55"
                                height="55"
                                className="d-inline-block align-top"
                                alt="Maszyny Polskie"
                            />
                        </Navbar.Brand>
                    </Link>
                    <Link to="/home">
                        <Navbar.Brand>SERWIS</Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        {this.context.isUserLogged ?
                            <Nav className="mr-auto">
                                <NavDropdown title="Maszyny" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/machineAdd">Dodaj</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/machineList">Lista maszyn</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Kontrahenci" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="customerAdd">Dodaj</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="customerList">Lista kontrahentów</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="Kategorie" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="categoryAdd">Dodaj</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="categoryList">Lista kategorii</NavDropdown.Item>
                                </NavDropdown>
                                {this.context.isAdmin === true ?
                                    <NavDropdown title="Pracownicy" id="basic-nav-dropdown">
                                        <NavDropdown.Item as={Link} to="userAdd">Dodaj</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="userList">Lista pracowników</NavDropdown.Item>
                                    </NavDropdown> : false}
                                {this.context.isAdmin === true ?
                                    <Nav.Link as={Link} to="/logs">Logi</Nav.Link> : false}
                            </Nav>
                            : ''}

                        <div className='nav text-secondary mr-lg-auto' style={{fontSize: '10px', textAlign: 'center'}}>
                            {this.context.isUserLogged ? `Jesteś zalogowany jako:` : ''}<br/>
                            {this.context.isUserLogged ? `${this.context.firstName} ${this.context.lastName}` : ''}
                            {this.context.isAdmin ? ' (admin)' : ''}

                            <br/>
                            {this.context.isUserLogged ? `(${this.context.login})` : ''}
                        </div>
                        <Nav.Link onClick={this.handleLoginOnClick}
                                  style={{color: 'grey'}}>{this.context.isUserLogged ? 'Wyloguj' : 'Zaloguj'}</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

export default NavigationBar;