import React, {useEffect, useState} from 'react';
import {Button, Carousel, Col, Container, Dropdown, Form, Image, Nav, Navbar, Row, Spinner} from "react-bootstrap";
import {useNavigate, useParams} from 'react-router-dom'
import {
    deleteMerchandiseAvailable, fetchMerchandises,
    fetchOneMerchandise
} from "../../http/API/merchandiseAPI";
import "./Merchandise.css"
import MakeKey from "../../utils/makeKey";
import Modal from "react-bootstrap/Modal";
import {createBasket} from "../../http/API/basketAPI";
import {useContext} from "react";
import {Context} from "../../index";
import {toJS} from "mobx";
import {LOGIN_ROUTE, SHOP_ROUTE} from "../../utils/consts";
import MerchandiseSizes from "./sizes/MerchandiseSizes";
import {observer} from "mobx-react-lite";
import CreateMerchandise from "../modals/CreateMerchandise";

const Merchandise = observer(() => {
    const navigate = useNavigate();
    const context = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [merchandise, setMerchandise] = useState({info: []});
    const [merchVisible, setMerchVisible] = useState(false);
    const {id} = useParams();
    const [show, setShow] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [errorSize, setErrorSize] = useState("");
    const [errorAuth, setErrorAuth] = useState("");
    const [name, setName] = useState("");
    const handleClose = () => {
        setErrorSize("");
        setErrorAuth("");
        setShow(false);
    }
    const handleShow = () => setShow(true);

    useEffect(() => {
        fetchOneMerchandise(id).then(data => {
            let brandName = "";
            let typeName = "";

            context.merchandise.types.map(type => {
                if (data.merchandise.typeId === type.id) {
                    typeName = type.name;
                }
            });
            context.merchandise.brands.map(brand => {
                if (data.merchandise.brandId === brand.id) {
                    brandName = brand.name.toLowerCase();
                }
            });

            data.merchandise.brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);

            if (brandName === data.merchandise.name) {
                data.merchandise.name = typeName + " " + brandName;
            } else {
                data.merchandise.name = typeName + " " + brandName + " " + data.merchandise.name;
            }
            setMerchandise(data);
        }).finally(() => {
            setLoading(false);
        });
    }, [])

    const addToBasket = (merchandise) => {
        let size = toJS(context.merchandise.selectedSizeAndCount);
        if (toJS(context.user.user).email === undefined) {
            setErrorAuth("Для того чтобы добавить товар в корзину нужно войти на сайт!")
            handleShow();
        } else {
            if (size[0] == null) {
                setErrorSize("Вы не выбрали размер товара!")
                handleShow();
            } else {
                createBasket({
                    selectedSize: size[0],
                    sizeId: size[1],
                    userId: toJS(context.user.user).id,
                    merchandiseId: merchandise.merchandise.id,
                    orderStatusId: 1,
                }).then();
            }
        }
    }

    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    const makeVisibleModal = () => {
        setMerchVisible(true);
    }

    const deleteAvailableMerchandise = () => {
        deleteMerchandiseAvailable(merchandise.merchandiseAvailable[0].merchandiseId).then(() => {
            setShowForm(false);
            navigate(SHOP_ROUTE);
        })
    }

    return (
        <Container className={"mt-3 d-flex"}>
            <Col sm={12} md={6} lg={6} className={"merchandiseColumnSlider"}>
                <div className={"merchContainer"}>
                    <Carousel variant="dark">
                        <Carousel.Item className={"merchCarousel"}>
                            <Image src={process.env.REACT_APP_API_URL + merchandise.merchandise.image}/>
                        </Carousel.Item>
                        {merchandise.merchandise.imageExtra ? <Carousel.Item className={"merchCarousel"}>
                                <Image src={process.env.REACT_APP_API_URL + merchandise.merchandise.imageExtra}/>
                            </Carousel.Item>
                            : null}
                        {merchandise.merchandise.imageExtraSecond ? <Carousel.Item className={"merchCarousel"}>
                                <Image src={process.env.REACT_APP_API_URL + merchandise.merchandise.imageExtraSecond}/>
                            </Carousel.Item>
                            : null}
                        {merchandise.merchandise.imageExtraThird ? <Carousel.Item className={"merchCarousel"}>
                                <Image src={process.env.REACT_APP_API_URL + merchandise.merchandise.imageExtraThird}/>
                            </Carousel.Item>
                            : null}
                    </Carousel>
                </div>
            </Col>
            <Col className={"ms-5 d-flex justify-content-start merchandiseFullInfo"} sm={12} md={6} lg={6}>
                <Form>
                    <div className={"merchandiseFullInfoHead"}>
                        <h4 className={"merchName"}>{merchandise.merchandise.name}</h4>
                        <span className={"brandName"}>{merchandise.merchandise.brandName}</span>
                    </div>
                    <div className={"merchandiseFullInfoPrice"}>
                        <span className={"mt-3"}>{merchandise.merchandise.price + " руб."}</span>
                    </div>
                    <div className={"merchandiseFullInfoSize"}>
                        <span className={"mt-3"}>Размер</span>
                    </div>
                    <div className={"btnForm"}>
                        <Navbar variant="light">
                            {
                                merchandise.merchandiseAvailable.map(a => {
                                    return <MerchandiseSizes key={MakeKey()} available={a}/>
                                })
                            }
                        </Navbar>
                    </div>
                    <div className={"mt-3 merchandiseFullInfoDescription"}>
                        <span>{merchandise.merchandise.description}</span>
                    </div>
                    <div className={"d-flex mt-4 merchandiseFullInfoRights"}>
                        <span>
                            - Фотографии принадлежат {merchandise.merchandise.brandName}.
                        </span>
                        <span>
                            - Дизайн от {merchandise.merchandise.brandName}.
                        </span>
                    </div>
                    {merchandise.merchandise.info.length !== 0 ? <div className={"merchandiseInfo"}>
                        <h4 className={"mt-3 description"}>Описание</h4>
                        {merchandise.merchandise.info.map(info =>
                            <Row key={MakeKey()}>
                                {info.title}: {info.description}
                            </Row>
                        )}
                    </div> : null}
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
                            {errorSize}
                            {errorAuth}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Закрыть
                            </Button>
                            <Button
                                className={errorAuth.length > 0 ? "btnErrorAuthVisible" : "btnErrorAuthInvisible"}
                                variant="primary" onClick={() => navigate(LOGIN_ROUTE)}>
                                Войти
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className={"btnAddToBasket"}>
                        <Button variant={"outline-dark mt-3"} onClick={() => addToBasket(merchandise)}>В
                            корзину</Button>
                    </div>
                    <div className={"btnAddToBasket"}>
                        {
                            toJS(context.user.user).role === "ADMIN" ? <div className={"d-flex flex-column"}>
                                <Button variant={"secondary mt-3"}
                                        onClick={makeVisibleModal}>Редактировать</Button>
                                <Button variant={"danger mt-3"}
                                        onClick={() => setShowForm(true)}>Удалить</Button>
                            </div> : null
                        }
                    </div>
                    <CreateMerchandise show={merchVisible} content={merchandise} onHide={() => setMerchVisible(false)}/>
                </Form>
            </Col>
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
                        deleteAvailableMerchandise();
                    }}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );

});

export default Merchandise;