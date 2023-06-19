import React, {useEffect} from 'react';
import {Button, Card, Col, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom"
import {MERCHANDISE_ROUTE} from "../../../utils/consts";
import "./MerchandiseItem.css"
import {deleteMerchandise} from "../../../http/API/merchandiseAPI";
import Modal from "react-bootstrap/Modal";
import {useState, useContext} from "react";
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";

const MerchandiseItem = observer(({merch, isAdmin, isLook, viewOnly}) => {
    const navigate = useNavigate();
    const {merchandise} = useContext(Context);
    const image = isAdmin ? merch.image : merch[0].image;
    const id = isAdmin ? merch.id : merch[0].id;
    const merchName = isAdmin ? merch.name : merch[0].name;
    const [typeName, setTypeName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [showForm, setShowForm] = useState(false);
    let name = "";


    useEffect(() => {
        merchandise.types.map(type => {
            if (!isAdmin) {
                if (merch[0].typeId === type.id) {
                    setTypeName(type.name);
                }
            } else {
                if (merch.typeId === type.id) {
                    setTypeName(type.name);
                }
            }
        });

        merchandise.brands.map(brand => {
            if (!isAdmin) {
                if (merch[0].brandId === brand.id) {
                    setBrandName(brand.name);
                }
            } else {
                if (merch.brandId === brand.id) {
                    setBrandName(brand.name);
                }
            }
        });
    })

    if (brandName === merchName) {
        name = typeName + " " + brandName;
    } else {
        name = typeName + " " + brandName + " " + merchName;
    }

    return (
        <Col md={4} sm={6} lg={3} style={viewOnly ? {margin: "5px"} : null}
             className={"mt-3 merchItemColumn"}>
            <div className={isLook ? "merchItemContentLook" : "merchItemContent"}>
                <Card className={"d-flex justify-content-center align-items-center flex-wrap"} border={"light"}>
                    {
                        isLook ? <Image onClick={() => {
                            merchandise.setMerchandisesInLook(merch[0]);
                        }} src={process.env.REACT_APP_API_URL + image}/> : <Image onClick={() => {
                            navigate(MERCHANDISE_ROUTE + '/' + id);
                        }} src={process.env.REACT_APP_API_URL + image}/>
                    }
                </Card>
            </div>
            <div className={"merchTextWrapper"}>
                <div className={"merchNameText"}>{name}</div>
                <div className={"merchPriceText"}>{isAdmin ? merch.price : merch[0].price} руб.</div>
                {isAdmin === true && viewOnly === false ?
                    <Button onClick={() => isLook ? merchandise.deleteMerchandisesInLook(merch) : setShowForm(true) } className={"mt-3"}
                            variant={"danger"}>Удалить</Button> : null}
            </div>
            <Modal
                show={showForm}
                onHide={() => setShowForm(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Вы уверенны что хотите удалить товар?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowForm(false)}>
                        Отменить
                    </Button>
                    <Button variant="danger" onClick={() => {
                        deleteMerchandise(merch.id);
                        setShowForm(false);
                    }}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    );
});

export default MerchandiseItem;