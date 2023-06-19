import React, {useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Col, Dropdown, Form, Image, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {createMerchandiseAvailable, fetchSizes,} from "../../http/API/merchandiseAPI";
import {useContext, useEffect} from "react";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import "./CreateMerchandiseAvailable.css"

const CreateMerchandiseAvailable = observer(({show, onHide}) => {
    const {merchandise} = useContext(Context);

    const [count, setCount] = useState(1);
    const [discount, setDiscount] = useState(0);

    useEffect(() => {
        fetchSizes().then(data => {
            merchandise.setSizes(data);
        })
    }, [])

    const addMerchandise = () => {
        const formData = new FormData();
        if (merchandise.selectedMerchandise.id !== undefined || merchandise.selectedSize.id !== undefined) {
            formData.append('count', count)
            formData.append('merchandiseId', merchandise.selectedMerchandise.id)
            formData.append('sizeId', merchandise.selectedSize.id)
            createMerchandiseAvailable(formData).then(data => onHide()).finally(data => {
                window.location.reload();
            })
        } else {
            window.location.reload();
        }

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
                    Добавить новый бренд
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <div className={"d-flex justify-content-around"}>
                        <Dropdown>
                            <Dropdown.Toggle>{merchandise.selectedMerchandise.name || "Выберите товар"}</Dropdown.Toggle>
                            <Dropdown.Menu className={"createMerchandiseDropdownMenu"}>
                                <Row>
                                    {merchandise.merchandises.map(merch =>
                                        <Col md={4} sm={4} lg={4} className={"createMerchandiseCol"}>
                                            <Dropdown.Item onClick={() => merchandise.setSelectedMerchandise(merch)}
                                                           key={merch.id}>
                                                <div className={"createMerchandiseDropdownDiv"}>
                                                    <Image src={process.env.REACT_APP_API_URL + merch.image} />
                                                    {merch.name.toUpperCase()}
                                                </div>
                                            </Dropdown.Item>
                                        </Col>
                                    )}
                                </Row>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown>
                            <Dropdown.Toggle>{merchandise.selectedSize.size || "Выберите размер"}</Dropdown.Toggle>
                            <Dropdown.Menu>
                                {merchandise.sizes.map(size =>
                                    <Dropdown.Item onClick={() => merchandise.setSelectedSize(size)}
                                                   key={size.id}>{size.size}</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <p className={"mt-2"}>Количество:</p>
                    <Form.Control
                        value={count}
                        onChange={e => setCount(Number(e.target.value))}
                        placeholder={"Введите количество товара"}/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={"outline-danger"} onClick={onHide}>Закрыть</Button>
                <Button variant={"outline-success"} onClick={addMerchandise}>Добавить</Button>
            </Modal.Footer>
        </Modal>
    );
});

export default CreateMerchandiseAvailable;