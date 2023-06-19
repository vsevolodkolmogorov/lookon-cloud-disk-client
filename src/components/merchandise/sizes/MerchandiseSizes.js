import React from 'react';
import {fetchNamesOfSizes, updateMerchandiseAvailable} from "../../../http/API/merchandiseAPI";
import {useState} from "react";
import "../Merchandise.css"
import {Button, Nav} from "react-bootstrap";
import {useContext} from "react";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";
import Modal from "react-bootstrap/Modal";

const MerchandiseSizes = observer(({available}) => {
    const {user, merchandise} = useContext(Context);
    const [size, setSize] = useState("");
    const [sizeId, setSizeId] = useState("");
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    fetchNamesOfSizes(available.sizeId).then(size => {
        setSize(size.size);
        setSizeId(available.sizeId);
    })

    const addSelectedSize = (size, sizeId) => {
        merchandise.setSelectedSizeAndCount(size, sizeId);
        setCount(available.count);
        if (toJS(user.user).role === "ADMIN") {
            handleShow();
        }
    }

    return (
        <div>
            <Nav className={"d-flex flex-wrap flex-column"} variant="pills" defaultActiveKey="/home">
                <Nav.Item>
                    {
                        available.count === 0 ?
                            <div>
                                <Button variant={"dark"} className={'merchSizes'} disabled>{size}</Button>
                            </div>
                            :
                            <div>
                                <Button variant={"dark"} className={'merchSizes'}
                                        onClick={() => addSelectedSize(size, sizeId)}>{size}</Button>
                            </div>
                    }
                </Nav.Item>
            </Nav>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={"d-flex justify-content-center"}>
                        <div className={"d-flex align-items-center"}>
                            <p style={{margin: "0px"}}>Количество:</p>
                            <p style={{margin: "0 10px"}}>{count}</p>
                        </div>
                        <div className={"merchCountButtons"}>
                            <Button onClick={
                                () => {
                                    setCount(count + 1);
                                }
                            }>+</Button>
                            <Button onClick={
                                () => {
                                    setCount(count - 1);
                                }
                            }>-</Button>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button variant="success" onClick={() => {
                        updateMerchandiseAvailable({createdAt: available.createdAt, count: count}).then();
                        setShow(false);
                        window.location.reload();
                    }}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </div>


    );

});

export default MerchandiseSizes;