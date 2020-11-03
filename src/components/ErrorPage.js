import React from "react";
import {Image} from "react-bootstrap";
import '../App.css';

const ErrorPage = () =>
    <div>
        <div className='d-flex justify-content-center' style={{
            marginTop: '140px',
        }}>
            <Image src={require("../../src/static/error-2129569_640.jpg")} style={{
                width: '400px'
            }} thumbnail/>
        </div>
        <div className='d-flex justify-content-center'>
            <div className='fontRoboto'>Przepraszamy podana strona nie istnieje!</div>
        </div>
    </div>
export default ErrorPage;