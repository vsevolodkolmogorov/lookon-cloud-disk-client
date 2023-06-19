import React, {useContext, useState} from 'react';
import {Col, Container, Row, Spinner} from "react-bootstrap";
import TypeBar from "../bars/typeBar/TypeBar";
import BrandBar from "../bars/brandBar/BrandBar";
import MerchandiseList from "../merchandise/list/MerchandiseList";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import Pages from "../pages/Pages";
import "./Shop.css";
import {
    fetchBrands,
    fetchMerchandiseAvailable,
    fetchMerchandises,
    fetchTypes
} from "../../http/API/merchandiseAPI";
import PriceBar from "../bars/priceBar/PriceBar";
import {toJS} from "mobx";
import Button from "react-bootstrap/Button";

const Shop = observer(({isLook}) => {
    const {merchandise} = useContext(Context)
    const [loading, setLoading] = useState(true)
    const [searchText, setSearchText] = useState("");

    fetchMerchandises(merchandise.selectedType.id, merchandise.selectedBrand.id, merchandise.page, merchandise.limit).then(data => {
        merchandise.setTotalCount(data.count);
        merchandise.setMerchandises(data.rows);
        fetchTypes().then(data => {
            merchandise.setTypes(data);
        })
        fetchBrands().then(data => {
            merchandise.setBrands(data);
        })
        fetchMerchandiseAvailable().then(available => {
            merchandise.setMerchandisesAvailable(available);
        }).finally(data => {
            setLoading(false);
        })
    })


    if (loading) {
        return <Spinner animation={"grow"}/>
    }

    return (
        <div>
            <Container>
                <Row style={{margin: "1px auto"}} className={"mt-3 d-flex justify-content-center"}>
                    <Col md={12}>
                        <TypeBar/>
                        <div className={"d-flex flex-wrap align-items-center justify-content-between shopFilter"}>
                            <div>
                                <BrandBar/>
                                <PriceBar/>
                            </div>
                            <div className={"d-flex input-group searchFilter align-items-center"}>
                                <input className="form-control rounded" placeholder="Поиск"
                                       value={searchText} onChange={e => setSearchText(e.target.value)}/>
                                <Button type="button" className={"d-flex align-items-center justify-content-center"} variant={"outline-dark"} onClick={() => merchandise.setSearchText(searchText)}>
                                    <svg className="t-store__search-icon js-store-filter-search-btn"
                                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
                                        <path fill="#757575"
                                              d="M85 31.1c-.5-8.7-4.4-16.6-10.9-22.3C67.6 3 59.3 0 50.6.6c-8.7.5-16.7 4.4-22.5 11-11.2 12.7-10.7 31.7.6 43.9l-5.3 6.1-2.5-2.2-17.8 20 9 8.1 17.8-20.2-2.1-1.8 5.3-6.1c5.8 4.2 12.6 6.3 19.3 6.3 9 0 18-3.7 24.4-10.9 5.9-6.6 8.8-15 8.2-23.7zM72.4 50.8c-9.7 10.9-26.5 11.9-37.6 2.3-10.9-9.8-11.9-26.6-2.3-37.6 4.7-5.4 11.3-8.5 18.4-8.9h1.6c6.5 0 12.7 2.4 17.6 6.8 5.3 4.7 8.5 11.1 8.9 18.2.5 7-1.9 13.8-6.6 19.2z"></path>
                                    </svg>
                                </Button>
                            </div>
                        </div>
                        <div className={"d-flex flex-wrap shopFilter"}>
                            {
                                toJS(merchandise.minPrice) !== 0 ?
                                    <Button onClick={() => merchandise.setMinPrice(0)} className={"shopFilterButton"}>{`X > ${toJS(merchandise.minPrice)}`}</Button> : null
                            }
                            {
                                toJS(merchandise.maxPrice) !== Infinity ?
                                    <Button onClick={() => merchandise.setMaxPrice(Infinity)} className={"shopFilterButton"}>{`X < ${toJS(merchandise.maxPrice)}`}</Button> : null
                            }
                            {
                                toJS(merchandise.selectedBrand).name !== undefined ?
                                    <Button onClick={() => merchandise.setSelectedBrand("")} className={"shopFilterButton"}>{toJS(merchandise.selectedBrand).name}</Button> : null
                            }
                            {
                                (toJS(merchandise.selectedType).name !== "Все" && toJS(merchandise.selectedType).name !== undefined) ?
                                    <Button onClick={() => merchandise.setSelectedType("")} className={"shopFilterButton"}>{toJS(merchandise.selectedType).name}</Button> : null
                            }
                            {
                                (toJS(merchandise.searchText).length !== 0) ?
                                    <Button onClick={() => {merchandise.setSearchText("");setSearchText("")}} className={"shopFilterButton"}>{toJS(merchandise.searchText)}</Button> : null
                            }
                        </div>
                        <MerchandiseList isAdmin={false} isLook={isLook}/>
                        <Pages/>
                    </Col>
                </Row>
            </Container>
        </div>
    );
});

export default Shop;