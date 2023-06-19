import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../../../index";
import {Col} from "react-bootstrap";
import './TypeBar.css';
import MakeKey from "../../../utils/makeKey";
import Button from "react-bootstrap/Button";
import {toJS} from "mobx";

const TypeBar = observer(() => {
    const {merchandise} = useContext(Context)
    return (
        <Col md={12} className={"d-flex typeBarWrapper"}>
            {merchandise.types.map(type =>
                <Button
                    className={toJS(merchandise.selectedType).id === type.id ? "active" : null}
                    variant={"outline-light"}
                    style={{cursor: "pointer"}}
                    onClick={() => merchandise.setSelectedType(type)}
                    key={MakeKey()}>
                    {type.name}
                </Button>
            )}
        </Col>
    );
});

export default TypeBar;