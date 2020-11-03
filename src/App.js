import React, {Component} from 'react';
import './App.css';
import NavigationBar from "./components/NavigationBar";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import MachineList from "./components/machineFragment/MachineList";
import MachineAdd from "./components/machineFragment/MachineAdd";
import Home from "./components/Home";
import ErrorPage from "./components/ErrorPage";
import AppProvider, {AppContext} from "./AppContext";
import CustomerList from "./components/customerFragment/CustomerList";
import '../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css'
import CategoryList from "./components/categoryFragment/CategoryList";
import UserList from "./components/userFragment/UserList";
import CategoryAdd from "./components/categoryFragment/CategoryAdd";
import CategoryEdit from "./components/categoryFragment/CategoryEdit";
import CustomerEdit from "./components/customerFragment/CustomerEdit";
import CustomerAdd from "./components/customerFragment/CustomerAdd";
import MachineEdit from "./components/machineFragment/MachineEdit";
import UserAdd from "./components/userFragment/UserAdd";
import UserEdit from "./components/userFragment/UserEdit";
import Logs from "./components/logFragment/Logs";
import Login from "./components/Login";
import Footer from "./components/Footer";

class App extends Component {

    static contextType = AppContext;

    render() {

        return (
            <AppProvider>
                <Router>
                    <NavigationBar></NavigationBar>
                    <div>

                        <Switch>
                            <Route path="/" exact component={Login}/>
                            <Route path="/home" component={Home}/>
                            <Route path="/machineAdd" component={MachineAdd}/>
                            <Route path="/machineEdit" component={MachineEdit}/>
                            <Route path="/machineList" component={MachineList}/>
                            <Route path="/customerAdd" component={CustomerAdd}/>
                            <Route path="/customerEdit" component={CustomerEdit}/>
                            <Route path="/customerList" component={CustomerList}/>
                            <Route path="/categoryAdd" component={CategoryAdd}/>
                            <Route path="/categoryEdit" component={CategoryEdit}/>
                            <Route path="/categoryList" component={CategoryList}/>
                            <Route path="/userList" component={UserList}/>
                            <Route path="/userAdd" component={UserAdd}/>
                            <Route path="/userEdit" component={UserEdit}/>
                            <Route path="/logs" component={Logs}/>
                            <Route path="/login" component={Login}/>
                            <Route component={ErrorPage}/>
                        </Switch>
                    </div>
                    <Footer/>
                </Router>
            </AppProvider>
        );
    }
}

export default App;
