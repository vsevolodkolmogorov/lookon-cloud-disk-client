import React, {useEffect} from 'react';
import {toJS} from "mobx";
import {useContext} from "react";
import {Context} from "../../../index";
import {Button, Dropdown, Form} from "react-bootstrap";
import "../PersonalAccount.css";
import {useState} from "react";
import MakeKey from "../../../utils/makeKey";
import Modal from "react-bootstrap/Modal";

const AccountProfile = () => {
    const {user} = useContext(Context)
    const ListMonths = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    let birthdayDate = [];
    if (toJS(user.user).birthdayDate !== null) {
        birthdayDate = toJS(user.user).birthdayDate.substr(0, 10).split("-");
    } else {
        birthdayDate = null;
    }
    const [name, setName] = useState(toJS(user.user).firstName ? toJS(user.user).firstName : "");
    const [secondName, setSecondName] = useState(toJS(user.user).secondName ? toJS(user.user).secondName : "");
    const [patronymic, setPatronymic] = useState(toJS(user.user).patronymic ? toJS(user.user).patronymic : "");
    const [email, setEmail] = useState(toJS(user.user).email ? toJS(user.user).email : "");
    const [genderCode, setGenderCode] = useState(toJS(user.user).genderId ? toJS(user.user).genderId : 0);
    const [phoneNumber, setPhoneNumber] = useState(toJS(user.user).phoneNumber ? toJS(user.user).phoneNumber : "");
    const [day, setDay] = useState(birthdayDate ? birthdayDate[2] : "");
    const [year, setYear] = useState(birthdayDate ? birthdayDate[0] : "");
    const [modalText, setModalText] = useState("");
    const [month, setMonth] = useState(() => {
        if (birthdayDate) {
            if (birthdayDate[1].substr(0, 1) === "0") {
                return ListMonths[+birthdayDate[1].substr(1, 2) - 1];
            } else {
                return ListMonths[+birthdayDate[1] - 1];
            }
        } else {
            return "Месяц";
        }
    });
    const [show, setShow] = useState(false);
    let errorCount = 0;
    let error = "";
    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false);
        if (errorCount > 0) {
            window.location.reload();
        }
    };

    if (phoneNumber === "7") {
        setPhoneNumber("8");
    }

    const sendEmail = (e) => {
        e.preventDefault();
        user.sendEmail(toJS(user.user).email);
        setModalText("На вашу электронную почту было отправлено письмо!");
        handleShow();
    }

    function validate(event) {
        let key;
        if (event.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
            key = event.keyCode || event.which;
            key = String.fromCharCode(key);
        }
        let regex = /[0-9]|\./;
        if(!regex.test(key) ) {
            event.returnValue = false;
            if(event.preventDefault) event.preventDefault();
        }
    }

    const inputs = [name,secondName,patronymic,email,phoneNumber,day,year];

    const saveNewUser = () => {
        let numberOfMonth;
        let birthdayDate;
        let genderId;

        ListMonths.map((i, num) => {
            if (month === i) {
                if (num + 1 < 10) {
                    numberOfMonth = "0" + (num + 1);
                } else {
                    numberOfMonth = (num + 1);
                }
            }
        })

        if (day < 10) {
            setDay("0" + day);
        }

        if (year === "" || day === "" || numberOfMonth === undefined) {
            birthdayDate = null;
        } else {
            birthdayDate = year + "-" + numberOfMonth + "-" + day;
        }

        if (genderCode === 0) {
            genderId = null;
        } else {
            genderId = genderCode;
        }

        inputs.push(birthdayDate);

        inputs.map((i,number) => {
            if (i === "") {
                switch (number) {
                    case 0: {
                        if(toJS(user.user).firstName !== "") {
                            error = "Имя не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 1: {
                        if(toJS(user.user).secondName !== "") {
                            error = "Фамилия не может быть пустой";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 2: {
                        if(toJS(user.user).patronymic !== "") {
                            error = "Отчество не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 3: {
                        error = "E-mail не может быть пустым";
                        errorCount++;
                        break;
                    }
                    case 4: {
                        if(toJS(user.user).phoneNumber !== "") {
                            error = "Номер телефона не может быть пустым";
                            errorCount++;
                            break;
                        }
                        break;
                    }
                    case 5: {
                        if(toJS(user.user).birthdayDate !== null) {
                            error = "Дата не может быть пустой";
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
            user.updateUser(email, name, secondName, patronymic, genderId, birthdayDate, phoneNumber);
        } else {
            setModalText(error);
        }

        handleShow();
    }

    return (
        <Form className={"d-flex accountForm"}>
                <h5>ПРОФИЛЬ</h5>
                <div className={"accountFormContent d-flex flex-wrap justify-content-between"}>
                    <div className={"accountSelectDataBirthday"}>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Фамилия</span>
                            <Form.Control placeholder={"Фамилия"} value={secondName}
                                          onChange={e => setSecondName(e.target.value)}/>
                        </div>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Имя</span>
                            <Form.Control placeholder={"Имя"} value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Отчество</span>
                            <Form.Control placeholder={"Отчество"} value={patronymic}
                                          onChange={e => setPatronymic(e.target.value)}/>
                        </div>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Пол</span>
                            <Form.Check
                                onChange={() => {
                                    setGenderCode(1);
                                }}
                                checked={genderCode === 1 ? true : false}
                                className={"mt-3 accountCheckBoxGender"}
                                type={"checkbox"}
                                label={"Мужской"}
                            />
                            <Form.Check
                                onChange={() => setGenderCode(2)}
                                checked={genderCode === 2 ? true : false}
                                className={"mt-3"}
                                type={"checkbox"}
                                label={"Женский"}
                            />
                        </div>
                        <div className={"mt-4"}>
                            <span className={"accountFormSpan"}>Укажите дату рождения</span>
                            <div className={"mt-2  d-flex justify-content-between align-items-center"}>
                                <Form.Control className={"accountSelectDataBirthdayDataYear"} onKeyPress={event => validate(event)} placeholder={"День"}
                                              value={day} onChange={e => setDay(e.target.value)} maxLength={"2"}/>
                                <Dropdown className={"accountSelectDataBirthdayMonth"}>
                                    <Dropdown.Toggle variant="none">
                                        {month}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            ListMonths.map(item => <Dropdown.Item key={MakeKey()}
                                                                                  onClick={() => setMonth(item)}>{item}</Dropdown.Item>)
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Form.Control className={"accountSelectDataBirthdayDataYear"} maxLength="4" onKeyPress={event => validate(event)} placeholder={"Год"}
                                              value={year} onChange={e => setYear(e.target.value)}/>
                            </div>
                        </div>
                    </div>
                    <div className={"accountSelectDataBirthday"}>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>Телефон</span>
                            <Form.Control placeholder={"Телефон"} onKeyPress={event => validate(event)} maxLength="11" value={phoneNumber}
                                          onChange={e => setPhoneNumber(e.target.value)}/>
                        </div>
                        <div className={"mt-4 d-flex align-items-center"}>
                            <span className={"accountFormSpan"}>E-mail</span>
                            <Form.Control disabled={true}  laceholder={"Электронная почта"} value={email}
                                          onChange={e => setEmail(e.target.value)}/>
                        </div>
                        <div style={{marginTop: "30px"}}>
                            {toJS(user.user).isActivated === true ?
                                <span>Электронная почта <span
                                    style={{color: "green"}}>подтверждена</span> </span> :
                                <span>Электронная почта <span style={{color: "red"}}>не подтверждена</span></span>}
                        </div>
                        {toJS(user.user).isActivated === false ? <div>
                            <div className={"align-items-center"} style={{marginTop: "15px"}}>
                                <p style={{fontSize: "13px", color: "gray"}}>Для подтверждения электронной почты
                                    необходимо перейти по ссылке в письме которое мы вам отправим</p>
                            </div>
                            <div className={"mt-2 align-items-center"}>
                                <button
                                    className={"accountButtonSendEmail"}
                                    onClick={e => sendEmail(e)}>Подтвердить E-mail
                                </button>
                            </div>
                        </div> : null}
                        <div className={"btnSave align-items-center"} style={{marginTop: "35px"}}>
                            <Button variant={"dark"} onClick={saveNewUser}>Сохранить</Button>
                        </div>
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
                        <Button variant="success" onClick={handleClose}>
                            Ок
                        </Button>
                    </Modal.Footer>
                </Modal>
        </Form>
    );
};

export default AccountProfile;