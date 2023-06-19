import {makeAutoObservable, toJS} from "mobx";
import {$authHost, $host} from "../http";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default class UserStore {

    constructor() {
        this._isAuth = false;
        this._user = {};
        this._users = {};
        this._userAddress = {};
        this._orderAddress = {};
        this._allAddress = [];
        makeAutoObservable(this);
    }

    setIsAuth (bool) {
        this._isAuth = bool;
    }

    setAllAddress (addresses) {
        this._allAddress = addresses;
    }

    setUser (user) {
        this._user = user;
    }

    setUserAddress (address) {
        this._userAddress = address;
    }

    setOrderAddress (address) {
        this._orderAddress = address;
    }

    async login(email, password) {
        try {
            const {data} = await $host.post('api/user/login', {email, password})
            if (data.user.isActivated || data.user.role === "ADMIN") {
                localStorage.setItem('token', data.accessToken)
                this.setIsAuth(true);
            }
            this.setUser(data.user);
        } catch (e) {
            return e.response?.data?.message;
        }
    }

    async registration(firstName,email,password) {
        try {
            let {data} = await $host.post('api/user/registration', {firstName, email, password, role: "USER"})
            if (data.user.isActivated) {
                localStorage.setItem('token', data.accessToken);
                this.setIsAuth(true);
            }
            this.setUser(data.user);
        } catch (e) {
            return e.response?.data?.errors;
        }
    }

    async checkIsAuth() {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API_URL}api/user/refresh`, {withCredentials: true});
            localStorage.setItem('token', data.accessToken);
            this.setIsAuth(true);
            this.setUser(data.user);
            if (data.address) {
                this.setUserAddress(data.address);
            }
            return jwt_decode(data.accessToken)
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async sendEmail(email) {
        try {
            const {data} = await $host.post('api/user/sendEmail', {email});
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async updateUser(email, firstName, secondName, patronymic, genderCode, birthdayDate, phoneNumber,role) {
        email =  email ? email : this._user.email;
        firstName =  firstName ? firstName : this._user.firstName;
        secondName =  secondName ? secondName : this._user.secondName;
        patronymic =  patronymic ? patronymic : this._user.patronymic;
        genderCode =  genderCode ? genderCode : this._user.genderCode;
        birthdayDate =  birthdayDate ? birthdayDate :this._user.birthdayDate;
        phoneNumber =  phoneNumber ? phoneNumber : this._user.phoneNumber;
        role = role ? role : this._user.role;
        try {
            console.log(email,role);
            const {data} = await $host.post('api/user/updateUser', {email,firstName,secondName,patronymic,genderCode,birthdayDate,phoneNumber,role});
            localStorage.setItem('token', data.accessToken);
        } catch (e) {
            return e.response?.data?.message;
        }
    }

    async createAddress(city, street, index, house, corpus, flat, description, userEmail, addressId, inBasket) {
        try {
            const {data} = await $host.post('api/user/createAddress', {city, street, index, house, corpus, flat, description, userEmail, addressId, inBasket});
            localStorage.setItem('token', data.accessToken);
            if (!inBasket) {
                this.setUserAddress(data.address);
            } else {
                this.setOrderAddress(data.address);
            }

        } catch (e) {
            return e.response?.data?.message;
        }
    }

    async getUsers() {
        try {
            const {data} = await $host.get('api/user/getUsers');
            this._users = data;
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async getAllAddress()  {
        try {
            const {data} = await $authHost.get('api/user/getAllAddress');
            this.setAllAddress(data);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    async logout() {
        try {
            const {data} = await $authHost.post('api/user/logout')
            localStorage.removeItem('token')
            this.setIsAuth(false);
            this.setUser(data.user);
        } catch (e) {
            console.log(e.response?.data?.message);
        }
    }

    get isAuth () {
        return this._isAuth;
    }

    get user () {
        return this._user;
    }

    get users () {
        return this._users;
    }

    get userAddress () {
        return this._userAddress;
    }

    get allAddress () {
        return this._allAddress;
    }

    get orderAddress () {
        return this._orderAddress;
    }
}