import React from 'react';
import {observer} from "mobx-react-lite";
import Shop from "../../shop/Shop";
import {Card, Col, Container, Form} from "react-bootstrap";
import {useState,useEffect,useContext} from "react";
import Button from "react-bootstrap/Button";
import "./CreateLook.css";
import {Context} from "../../../index";
import {toJS} from "mobx";
import MakeKey from "../../../utils/makeKey";
import MerchandiseItem from "../../merchandise/item/MerchandiseItem";
import {createLook} from "../../../http/API/merchandiseAPI";

const CreateLook = observer(() => {
    const {merchandise} = useContext(Context);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const selectedMerch = toJS(merchandise.merchandisesInLook);

    const createNewLook = () => {
        const formData = new FormData();
        if (name.length !== 0 || description.length !== 0 || selectedMerch !== null) {
            formData.append('name', name);
            formData.append('description', description);
            formData.append('merchandise', JSON.stringify(selectedMerch));
            createLook(formData).then().finally(data => {
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    }

    return (
        <Container>
            <Shop isLook={true}/>
            <Card className={"cardCreateLook"}>
                <Form className={"formCreateLook"}>
                    <Container>
                        <Col md={12}>
                            <h5>Лук</h5>
                            <Form.Control className={"mt-3"} placeholder={"Введите название"} value={name}
                                          onChange={e => setName(e.target.value)}/>
                            <Form.Control className={"mt-3"} placeholder={"Введите описание"} value={description}
                                          onChange={e => setDescription(e.target.value)}/>
                            <h5 className={"mt-3"}>Выбранные товары:</h5>
                            <div className={"d-flex flex-wrap"}>
                                {
                                    selectedMerch.map(m => {
                                        return <MerchandiseItem key={MakeKey()} merch={m} isAdmin={true} isLook={true} viewOnly={false}/>
                                    })
                                }
                            </div>
                            <Button className={"mt-5"} onClick={createNewLook}>Создать</Button>
                        </Col>
                    </Container>
                </Form>
            </Card>
        </Container>

    );
});

export default CreateLook;