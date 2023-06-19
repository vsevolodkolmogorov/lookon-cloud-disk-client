import React, {useState} from 'react';
import {Form, Button, Modal} from "react-bootstrap";
import {createSize} from "../../http/API/merchandiseAPI";

const CreateSize = ({show, onHide}) => {

    const [value, setValue] = useState('');

    const addSize = () => {
        createSize({name: value}).then(data => {
            setValue('')
            onHide()
        }).finally(() => {
            window.location.reload();
        })
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Добавить новый размер
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Control
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder={"Введите значение размера"} />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addSize}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateSize;