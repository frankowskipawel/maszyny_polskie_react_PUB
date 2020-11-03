import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {Button} from "react-bootstrap";
import {AppContext} from "../../AppContext";


class MachineService extends Component {

    static contextType = AppContext;

    handleOnClickFile = e => {

        const fileName = e.target.value;

        fetch(`${this.context.hostname}/api/storage/downloadFile?fileName=${encodeURI(e.target.value)}`,
            {
                method: "POST",
                headers: {
                    'email': `${this.context.login}`,
                    'password': `${this.context.password}`
                },
            }).then(response => response.blob()).then(blob => {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = (fileName);
            document.body.appendChild(a);
            a.click();
            a.remove();

        });
    }

    render() {
        return (
            this.props.props.map(
                service =>
                    <Card style={{margin: '3px'}}>
                        <Card.Body style={{padding: '5px', margin: '3px'}}>
                            {service.date} {service.type} - {service.state} - {service.paymentType} - {service.user}
                            {service.files.map(file =>
                                <div>
                                <Button variant="link" size="sm"
                                onClick={this.handleOnClickFile}
                                value={file}>{file}</Button></div>
                            )}

                        </Card.Body>
                    </Card>
            )
        )
    }
}

export default MachineService;