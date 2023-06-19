import {makeAutoObservable, toJS} from "mobx";

export default class MerchandiseStore {

    constructor() {
        this._types = [];
        this._prices = [];
        this._minPrice = 0;
        this._maxPrice = Infinity;
        this._searchText = "";
        this._brands = [];
        this._sizes = [];
        this._merchandises = [];
        this._merchandisesInLook = [];
        this._merchandisesAvailable = [];
        this._selectedMerchandise = {};
        this._selectedType = {};
        this._selectedBrand = {};
        this._selectedSize = {};
        this._selectedSizeAndCount = [];
        this._page = 1;
        this._limit = 16;
        this._merchBrandsId = [];
        this._merchTypesId = [];
        this._textMerchNull = "";
        this._isMerchDelete = "";
        this._looks = {};
        makeAutoObservable(this);
    }

    setMerchandises(merchandises) {
        this._merchandises = merchandises;
    }

    setPrices(prices) {
        this._prices = prices;
    }

    setSearchText(searchText) {
        this._searchText = searchText;
    }

    setLooks(looks) {
        this._looks = looks;
    }

    setMerchandisesInLook(merchandise) {
        let count = 0;
        if (this._merchandisesInLook.length === 0) {
            this._merchandisesInLook.push(merchandise);
        } else {
            this._merchandisesInLook.map(m => {
                if (m.id === merchandise.id) {
                    count++
                }
            })
            if (count === 0) {
                this._merchandisesInLook.push(merchandise);
            }
        }

    }

    deleteMerchandisesInLook(merchandise) {
        this._merchandisesInLook.map((m, number) => {
            if (m.id === merchandise.id) {
                this._merchandisesInLook.splice(number, 1);
            }
        })
    }

    setMerchandisesAvailable(data) {
        data.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
        let availableNew = [];
        let prices = [];

        data.map(a => {
            this._merchandises.map(m => {
                if (a.merchandiseId === m.id) {
                    m.count = a.count;
                    m.discount = a.discount;
                    m.merchandiseId = a.merchandiseId;
                    availableNew.push(toJS(m));
                    this._merchBrandsId.push(m.brandId);
                    this._merchTypesId.push(m.typeId);
                }
            })
        })

        let countOfAvailableMerch = availableNew.filter((item, num) => {
            if (availableNew[num + 1] !== undefined) {
                return availableNew[num].name !== availableNew[num + 1].name;
            } else {
                return item.name;
            }
        });

        countOfAvailableMerch.map(item => {
            prices.push(toJS(item.price));
        })

        this.setPrices(prices);

        this.setTotalCount(countOfAvailableMerch.length);



        this._merchandisesAvailable = availableNew;
        this._textMerchNull = "Данного товара нет в наличии"
    }

    setIsMerchDelete(isMerchDelete) {
        this._isMerchDelete = isMerchDelete;
    }

    setTypes(types, isAdmin = false) {
        let merchTypesId = [...new Set(this._merchTypesId)];
        let typesNew = [];

        if (!isAdmin) {
            types.map(type => {
                merchTypesId.map(merch => type.id === merch ? typesNew.push(type) : null);
            });

            typesNew.unshift({name: "Все"})
            this._types = typesNew;
        } else {
            this._types = types;
        }
    }

    setBrands(brands, isAdmin = false) {
        let merchBrandsId = [...new Set(this._merchBrandsId)];
        let brandsNew = [];

        if (!isAdmin) {
            brands.map(brand => {
                merchBrandsId.map(merch => brand.id === merch ? brandsNew.push(brand) : null);
            });

            this._brands = brandsNew;
        } else {
            this._brands = brands;
        }
    }

    setSizes(sizes) {
        this._sizes = sizes;
    }

    setMinPrice(price) {
        this._minPrice = price;
    }

    setMaxPrice(price) {
        this._maxPrice = price;
    }

    setSelectedType(type) {
        if (toJS(type).name === "Все") {
            this._selectedType = "";
            this._selectedBrand = "";
        }
        this._selectedType = type;
    }

    setSelectedBrand(brand) {
        this._selectedBrand = brand;
    }

    setSelectedMerchandise(merchandise) {
        this._selectedMerchandise = merchandise;
    }

    setSelectedSize(size) {
        this._selectedSize = size;
    }

    setSelectedSizeAndCount(size, sizeId) {
        this._selectedSizeAndCount = [size, sizeId];
    }

    setPage(page) {
        this._page = page;
    }

    setTotalCount(totalCount) {
        this._totalCount = totalCount;
    }

    setFiltersClear() {
        this._selectedType = {};
        this._selectedBrand = {};
    }

    setSelectedMerchandises(content) {
        this._selectedMerchandises = [...content];
    }

    get searchText() {
        return this._searchText;
    }

    get isMerchDelete() {
        return this._isMerchDelete;
    }

    get prices() {
        return this._prices;
    }

    get minPrice() {
        return this._minPrice;
    }

    get maxPrice() {
        return this._maxPrice;
    }

    get looks() {
        return this._looks;
    }

    get types() {
        return this._types;
    }

    get sizes() {
        return this._sizes;
    }

    get brands() {
        return this._brands;
    }

    get merchandises() {
        return this._merchandises;
    }

    get merchandisesAvailable() {
        return this._merchandisesAvailable;
    }

    get selectedMerchandise() {
        return this._selectedMerchandise;
    }

    get merchandisesInLook() {
        return this._merchandisesInLook;
    }

    get selectedType() {
        return this._selectedType;
        this.setPage(1);
    }

    get selectedBrand() {
        return this._selectedBrand;
        this.setPage(1);
    }

    get selectedSize() {
        return this._selectedSize;
    }

    get selectedSizeAndCount() {
        return this._selectedSizeAndCount;
    }

    get page() {
        return this._page;
    }

    get totalCount() {
        return this._totalCount;
    }

    get limit() {
        return this._limit;
    }

    get textMerchNull() {
        return this._textMerchNull;
    }

}