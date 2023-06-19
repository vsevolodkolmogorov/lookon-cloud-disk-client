import React from 'react';
import {toJS} from "mobx";
import {useContext} from "react";
import {Context} from "../../../index";
import {Button, Container, Dropdown, Form} from "react-bootstrap";
import "../PersonalAccount.css";
import {useState} from "react";
import Modal from "react-bootstrap/Modal";

const AddressProfile = () => {
    const {user} = useContext(Context);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
    };
    const [city, setCity] = useState(toJS(user.userAddress).city ? toJS(user.userAddress).city : "");
    const [street, setStreet] = useState(toJS(user.userAddress).street ? toJS(user.userAddress).street : "");
    const [index, setIndex] = useState(toJS(user.userAddress).index ? toJS(user.userAddress).index : "");
    const [house, setHouse] = useState(toJS(user.userAddress).house ? toJS(user.userAddress).house : "");
    const [corpus, setCorpus] = useState(toJS(user.userAddress).corpus ? toJS(user.userAddress).corpus : "");
    const [flat, setFlat] = useState(toJS(user.userAddress).flat ? toJS(user.userAddress).flat : "");
    const [modalText, setModalText] = useState("");
    const [description, setDescription] = useState(toJS(user.userAddress).description ? toJS(user.userAddress).description : "");
    const inputs = [city, street, index, house, flat];
    let errorCount = 0;
    let error = "";

    function validate(event) {
        let key;
        if (event.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            key = event.keyCode || event.which;
            key = String.fromCharCode(key);
        }
        let regex = /[0-9]|\./;
        if (!regex.test(key)) {
            event.returnValue = false;
            if (event.preventDefault) event.preventDefault();
        }
    }

    const saveAddress = () => {
        inputs.map((i, number) => {
            if (i === "") {
                switch (number) {
                    case 0: {
                        if (toJS(user.userAddress).city !== "") {
                            error = "Город не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 1: {
                        if (toJS(user.userAddress).street !== "") {
                            error = "Улица не может быть пустой";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 2: {
                        if (toJS(user.userAddress).index !== "") {
                            error = "Индекс не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 3: {
                        if (toJS(user.userAddress).house !== "") {
                            error = "Дом не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 4: {
                        if (toJS(user.userAddress).flat !== "") {
                            error = "Квартира не может быть пустая";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                }
            }
        })

        if (error.length === 0) {
            setModalText("Изменения успешно сохранены!");
            user.createAddress(city, street, index, house, corpus, flat, description, toJS(user.user).email, toJS(user.userAddress).id, false);
        } else {
            setModalText(error);
        }
        handleShow();
    }

    return (
        <Form className={"d-flex accountForm"}>
            <h5>АДРЕС</h5>
            <div className={"accountFormAddressContent"}>
                <div className={"accountFormAddressContent d-flex flex-wrap justify-content-between"}>
                    <div className={"accountSelectDataBirthday"}>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Город</span>
                            <Form.Control placeholder={"Город"} value={city}
                                          onChange={e => setCity(e.target.value)}/>
                        </div>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Улица</span>
                            <Form.Control placeholder={"Улица"} value={street}
                                          onChange={e => setStreet(e.target.value)}/>
                        </div>
                    </div>
                    <div className={"accountSelectDataBirthday"}>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Индекс</span>
                            <Form.Control placeholder={"Индекс"} value={index} onKeyPress={event => validate(event)}
                                          maxLength="6" onChange={e => setIndex(e.target.value)}/>
                        </div>
                        <div className={"mt-4"}>
                            <div className={"mt-2  d-flex justify-content-between align-items-center"}>
                                <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                              placeholder={"Дом"}
                                              value={house} onChange={e => setHouse(e.target.value)}/>
                                <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                              placeholder={"Корп."}
                                              value={corpus} onChange={e => setCorpus(e.target.value)}/>
                                <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength={5}
                                              placeholder={"Кв."}
                                              value={flat} onChange={e => setFlat(e.target.value)}/>
                            </div>

                        </div>
                    </div>
                </div>
                <div className={"mt-4"}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Комментарий</Form.Label>
                        <Form.Control style={{resize: "none"}} value={description}
                                      onChange={e => setDescription(e.target.value)} as="textarea" rows={3}/>
                    </Form.Group>
                </div>
                <div className={"btnSave mt-4 align-items-center"}>
                    <Button variant={"dark"} onClick={saveAddress}>Сохранить</Button>
                </div>
            </div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Успешно</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalText}
                </Modal.Body>
                <Modal.Footer>
                    {modalText !== "Изменения успешно сохранены!" ? <Button variant="danger" onClick={handleClose}>
                        Закрыть
                    </Button> : <Button variant="success" onClick={handleClose}>
                        Ок
                    </Button>}
                </Modal.Footer>
            </Modal>
        </Form>
    );
};

export default AddressProfile;