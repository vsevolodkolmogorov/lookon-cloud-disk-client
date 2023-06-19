import {$authHost} from "../index";

export const createBasket = async (basket) => {
    const {data} = await $authHost.post('api/basket', basket)
    return data
}

export const updateBasket = async (basket) => {
    const {data} = await $authHost.post('api/basket/update', basket);
    return data
}

export const fetchBasket = async () => {
    const {data} = await $authHost.get('api/basket')
    return data
}

export const deleteBasket = async (createdAt) => {
    const {data} = await $authHost.delete('api/basket',  {data:{createdAt: createdAt}})
    return data
}

