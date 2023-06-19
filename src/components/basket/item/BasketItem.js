import React from 'react';
import {Button, Card, Image} from "react-bootstrap";
import "../Basket.css"
import {deleteBasket, updateBasket} from "../../../http/API/basketAPI";
import {useContext,useState} from "react";
import {Context} from "../../../index";
import MakeKey from "../../../utils/makeKey";
import Modal from "react-bootstrap/Modal";
import {useEffect} from "react";
import {fetchOneMerchandise} from "../../../http/API/merchandiseAPI";
import {observer} from "mobx-react-lite";

const BasketItem = observer(({merch}) => {
    const context = useContext(Context);
    const [availableCount, setAvailableCount] = useState(0);
    const [countSelected, setCountSelected] = useState(merch.count);

    useEffect(() => {
        fetchOneMerchandise(merch.merchandiseId).then(data => {
            data.merchandiseAvailable.map(a => {
                if (merch.merchandiseId === a.merchandiseId && merch.sizeId === a.sizeId) {
                    setAvailableCount(a.count);
                }
            })
        })
    }, [])

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const deleteButton = (merch) => {
        context.merchandise.setIsMerchDelete(MakeKey());
        deleteBasket(merch.createdAt).then(data => {});
        handleClose();
    }

    return (
        <div className={"mt-3 basketItemWrapper"}>
            <Card className={"d-flex align-items-center"}>
                <div className={"basketImageWrapper"}>
                    <Image src={process.env.REACT_APP_API_URL + merch.image} />
                </div>
                <div className={"merchandiseContent d-flex justify-content-center align-items-center"}>
                    <div>
                        <p>{merch.name}</p>
                    </div>
                    <div>
                        <p>Стоимость: <br/>{merch.price} руб.</p>
                    </div>
                    <div>
                        <p>Размер: <br/>{merch.size}</p>
                    </div>
                    <div className={"merchandiseCountAndDelete d-flex align-items-center justify-content-between"}>
                        <div className={"merchandiseCount d-flex align-items-center"}>
                            <div className={"d-flex"}>
                                <p>Количество:</p>
                                <p style={{margin:"0 10px"}}>{countSelected}</p>
                            </div>
                            <div className={"basketItemButton"}>
                                <Button onClick={
                                    () => {
                                        if (countSelected !== availableCount) {
                                            let newCount = countSelected + 1;
                                            setCountSelected(newCount);
                                            updateBasket({createdAt: merch.createdAt, count: newCount, orderStatusId: null});
                                            window.location.reload();
                                        } else {
                                            setCountSelected(availableCount);
                                        }
                                    }
                                }>+</Button>
                                <Button onClick={
                                    () => {
                                        if (countSelected !== 1) {
                                            let newCount = countSelected - 1;
                                            setCountSelected(newCount);
                                            updateBasket({createdAt: merch.createdAt, count: newCount, orderStatusId: null});
                                            window.location.reload();
                                        } else {
                                            setCountSelected(1);
                                        }
                                    }
                                }>-</Button>
                            </div>
                        </div>
                        <div className={"btnDelete ms-3"}>
                            <Button id={"btnDelete"} onClick={() => handleShow()}>удалить</Button>
                        </div>
                    </div>
                </div>
            </Card>
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
                    Вы уверены что хотите удалить данный товар?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={() => deleteButton(merch)}>Удалить</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default BasketItem;