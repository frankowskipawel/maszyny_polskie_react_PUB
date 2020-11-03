import React, {Component} from "react";
import {Spinner, Button} from "react-bootstrap";
import '../../App.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {Search} from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import {Redirect} from "react-router-dom";
import {AppContext} from "../../AppContext";


const defaultSorted = [{
    dataField: 'id',
    order: 'desc'
}];

const {SearchBar} = Search;

const searchProps = {
    delay: 800,
    placeholder: "wpisz aby wyszukać",
};

const sizePerPageRenderer = ({
                                 options,
                                 currSizePerPage,
                                 onSizePerPageChange
                             }) => (
    <div className="btn-group" role="group">
        {
            options.map((option) => {
                const isSelect = currSizePerPage === `${option.page}`;
                return (
                    <button
                        key={option.text}
                        type="button"
                        onClick={() => onSizePerPageChange(option.page)}
                        className={`btn ${isSelect ? 'btn-secondary' : 'btn-warning'}`}
                    >
                        {option.text}
                    </button>
                );
            })
        }
    </div>
);

const options = {
    sizePerPageRenderer
};

class CategoryList extends Component {

    static contextType = AppContext;

    state = {
        data: [],
        isDataLoaded: false,
        edit: false,
        redirect: ''
    }

    componentDidMount() {
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
                    data: data,
                    isDataLoaded: true
                })
            });
    }

    handleBackOnClick = () => {
        this.setState({redirect: '/home'})
    }


    render() {

        const onClickEvent = {

            onClick: (e, column, columnIndex, row, rowIndex) => {
                const link = `/categoryEdit?id=${row.id}&name=${row.name.replace("&", "%26")}`
                this.setState({redirect: link})
            }
        }

        const columns = [{
            dataField: 'id',
            text: 'id',
            sort: true,
            events: onClickEvent,
        }, {
            dataField: 'name',
            text: 'Nazwa',
            sort: true,
            events: onClickEvent,
        }];


        if (this.state.edit === true) {
            return (<Redirect to="/categoryEdit"/>)
        }


        return (

            <div className="fragment">
                {this.context.isUserLogged === false ? <Redirect to="/login"/> : ''}
                {this.state.redirect != '' ? <Redirect to={this.state.redirect}/> : ''}
                <ToolkitProvider
                    bootstrap3
                    keyField="id"
                    data={this.state.data}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    bordered={false}
                    noDataIndication=""
                    search>
                    {
                        props => (
                            <div>
                                <h3>
                                    <Button variant="light" onClick={this.handleBackOnClick}>
                                        <svg width="1em" height="1em" viewBox="0 0 16 16"
                                             className="bi bi-arrow-return-left"
                                             fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd"
                                                  d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"/>
                                        </svg>
                                    </Button>
                                    &nbsp;Lista kategorii
                                    <Button
                                        className="float-right"
                                        variant="outline-dark"
                                        onClick={() => this.setState({redirect: '/categoryAdd'})}>
                                        +
                                    </Button>
                                </h3>

                                <SearchBar
                                    {...props.searchProps}
                                    placeholder="Wpisz aby wyszukać..."
                                />
                                <hr/>
                                <BootstrapTable
                                    bootstrap3
                                    keyField="id"
                                    data={this.state.data}
                                    columns={columns}
                                    defaultSorted={defaultSorted}
                                    bordered={false}
                                    noDataIndication=""
                                    pagination={paginationFactory(options)}
                                    {...props.baseProps}
                                />
                            </div>
                        )
                    }
                </ToolkitProvider>
                {!this.state.isDataLoaded &&
                <div className={"container"} style={{textAlign: "center"}}><Spinner animation="border"/></div>}
            </div>
        )
    }
};

export default CategoryList;