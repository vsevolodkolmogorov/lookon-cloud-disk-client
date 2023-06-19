import React, {useContext, useEffect, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {Col, Dropdown, Form, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {Context} from "../../index";
import {createMerchandise, fetchBrands, fetchTypes, updateMerchandise} from "../../http/API/merchandiseAPI";
import {observer} from "mobx-react-lite";
import {toJS} from "mobx";

const CreateMerchandise = observer(({show, onHide, content}) => {
    const {merchandise} = useContext(Context);
    const [name, setName] = useState(content === undefined ? '' : content.merchandise.name);
    const [description, setDescription] = useState(content === undefined ? '' : content.merchandise.description);
    const [price, setPrice] = useState(content === undefined ? 0 : content.merchandise.price);
    const [file, setFile] = useState(content === undefined ? null : content.merchandise.image);
    const [imageExtra, setImageExtra] = useState([]);
    const [info, setInfo] = useState(content === undefined ? [] : content.merchandise.info);
    const [count, setCount] = useState(0);
    const [brand, setBrand] = useState([]);
    const [type, setType] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const handleCloseError = () => {
        setShowError(false);
        setErrorText("");
    }

    useEffect(() => {
        if (content !== undefined) {
            fetchBrands().then(data => {
                data.map(b => {
                    if (b.id === content.merchandise.brandId) {
                        content.merchandise.brand = toJS(b);
                        merchandise.setSelectedBrand(content.merchandise.brand === undefined ? "" : content.merchandise.brand);
                    }
                });
            })
            fetchTypes().then(data => {
                data.map(t => {
                    if (t.id === content.merchandise.typeId) {
                        content.merchandise.type = toJS(t);
                        merchandise.setSelectedType(content.merchandise.type === undefined ? "" : content.merchandise.type);
                    }
                });
            })
        } else {
            fetchTypes().then(data => {
                setType(data);
            })
            fetchBrands().then(data => {
                setBrand(data);
            })
        }
    }, [])

    const selectFile = e => {
        setFile(e.target.files[0]);
    }

    const addInfo = () => {
        setInfo([...info, {title: "", description: "", number: Date.now()}])
    }

    const changeInfo = (key, value, number, id) => {
        if (number === undefined) {
            setInfo(info.map(i => (i.id === id) ? {...i, [key]: value} : i))
        } else {
            setInfo(info.map(i => (i.number === number) ? {...i, [key]: value} : i))
        }
    }

    const addImageExtra = () => {
        if (count < 3) {
            setCount(count => count + 1);
            setImageExtra([...imageExtra, {imageExtra: null, number: Date.now()}]);
        }
    }

    const removeInfo = (number) => {
        setInfo(info.filter(i => i.number !== number))
    }

    const removeImageExtra = (number) => {
        setCount(count => count - 1);
        setImageExtra(imageExtra.filter(i => i.number !== number))
    }

    const changeImageExtra = (key, value, number) => {
        setImageExtra(imageExtra.map(i => (i.number === number) ? {...i, [key]: value} : i))
    }

    const addMerchandise = () => {
        const formData = new FormData();
        let errorCount = 0;
        if (name.length === 0) {
            setErrorText("Имя не может быть пустым");
            errorCount++;
        }
        if (price <= 0) {
            setErrorText("Цена не может быть равна или меньше нуля");
            errorCount++;
        }
        if (file === null) {
            setErrorText("Изображение товара должно быть обязательно");
            errorCount++;
        }
        if (merchandise.selectedType.id === undefined) {
            setErrorText("Тип товара не может быть пустым");
            errorCount++;
        }
        if (merchandise.selectedBrand.id === undefined) {
            setErrorText("Бренд товара не может быть пустым");
            errorCount++;
        }
        if (errorCount !== 0) {
            setShowError(true);
        } else {
            formData.append('name', name)
            formData.append('price', `${price}`)
            formData.append('description', description)
            formData.append('image', file)
            formData.append('typeId', merchandise.selectedType.id)
            formData.append('brandId', merchandise.selectedBrand.id)
            formData.append('info', JSON.stringify(info))
            if (content !== undefined) {
                formData.append('merchandiseId',  content.merchandise.id);
            }
            if (imageExtra.length === 3) {
                formData.append('imageExtra', imageExtra[0].imageExtra)
                formData.append('imageExtraSecond', imageExtra[1].imageExtra)
                formData.append('imageExtraThird', imageExtra[2].imageExtra)
            } else if (imageExtra.length === 2)  {
                formData.append('imageExtra', imageExtra[0].imageExtra)
                formData.append('imageExtraSecond', imageExtra[1].imageExtra)
            } else if (imageExtra.length === 1) {
                formData.append('imageExtra', imageExtra[0].imageExtra)
            }

            content !== undefined ?  updateMerchandise(formData).then(data => onHide()).finally(data => {
                window.location.reload()
            }) : createMerchandise(formData).then(data => onHide()).finally(data => {
                window.location.reload()
            });
        }
    }

    return (
        <div>
            <Modal
                show={show}
                onHide={onHide}
                size="lg"
                centered
            >
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Добавить новый товар
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className={"d-flex justify-content-around"}>
                            <Dropdown>
                                <Dropdown.Toggle>{merchandise.selectedBrand.name || "Выберите бренд"}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {brand.map(brand =>
                                        <Dropdown.Item onClick={() => merchandise.setSelectedBrand(brand)}
                                                       key={brand.id}>{brand.name.toUpperCase()}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown>
                                <Dropdown.Toggle>{merchandise.selectedType.name || "Выберите тип"}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {type.map(type =>
                                        <Dropdown.Item onClick={() => merchandise.setSelectedType(type)}
                                                       key={type.id}>{type.name.toUpperCase()}</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Form.Control className={"mt-3"} placeholder={"Введите название товара"} value={name}
                                      onChange={e => setName(e.target.value)}/>
                        <Form.Control className={"mt-3"} placeholder={"Введите стоимость товара"} type={"number"}
                                      value={price} onChange={e => setPrice(Number(e.target.value))}/>
                        <Form.Control className={"mt-3"} placeholder={"Введите описание товара"} value={description}
                                      onChange={e => setDescription(e.target.value)}/>
                        <Form.Control className={"mt-3"} type={"file"} onChange={selectFile}/>

                        <Button variant={"outline-dark"} className={"mt-3"} onClick={addInfo}>
                            Добавить новое свойство
                        </Button>
                        {
                            info.map(i =>
                                <Row className={"mt-3"} key={i.number}>
                                    <Col md={4}>
                                        <Form.Control placeholder={"Введите название"} value={i.title}
                                                      onChange={e => changeInfo('title', e.target.value, i.number, i.id)}/>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Control placeholder={"Введите описание"} value={i.description}
                                                      onChange={e => changeInfo('description', e.target.value, i.number, i.id)}/>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant={"outline-danger"}
                                                onClick={() => removeInfo(i.number)}>Удалить</Button>
                                    </Col>
                                </Row>
                            )
                        }
                        <Button variant={"outline-dark"} className={"mt-3 d-block"} onClick={addImageExtra}>
                            Добавить дополнительные изоброжения
                        </Button>
                        {
                            imageExtra.map(i =>
                                <Row className={"mt-3"} key={i.number}>
                                    <Col md={4}>
                                        <Form.Control type={"file"}
                                                      onChange={e => changeImageExtra('imageExtra', e.target.files[0], i.number)}/>
                                    </Col>
                                    <Col md={4}>
                                        <Button variant={"outline-danger"}
                                                onClick={() => removeImageExtra(i.number)}>Удалить</Button>
                                    </Col>
                                </Row>
                            )
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"outline-danger"} onClick={() => {
                        onHide()
                    }}>Закрыть</Button>
                    <Button variant={"outline-success"} onClick={addMerchandise}>Добавить</Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showError}
                onHide={handleCloseError}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Внимание</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorText}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseError}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default CreateMerchandise;