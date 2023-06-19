import React, {useEffect} from 'react';
import {Container} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import {Context} from "../../index";
import {toJS} from "mobx";
import LookItem from "./item/LookItem";
import {observer} from "mobx-react-lite";
import "./Look.css"

const Look = observer(() => {
    const navigate = useNavigate();
    const {merchandise} = useContext(Context);


    return (
        <Container className={"lookContainer"}>
            <div className={"mt-4 d-flex justify-content-center"}>
                <h4>Уникальная подборка модных и стильных луков, которые помогут
                    создать гармоничный образ для любой ситуации.</h4>
            </div>
            <div className={"mt-4 lookWrapper"}>
                {
                    toJS(merchandise.looks).look.map(look => {
                        return <LookItem look={look} />
                    })
                }
            </div>
        </Container>
    );
});

export default Look;