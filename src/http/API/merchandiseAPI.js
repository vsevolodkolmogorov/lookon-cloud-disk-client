import {$authHost, $host} from "../index";

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const createMerchandise = async (merchandise) => {
    const {data} = await $authHost.post('api/merchandise', merchandise)
    return data
}

export const updateMerchandise = async (merchandise) => {
    const {data} = await $authHost.post('api/merchandise/update', merchandise)
    return data
}

export const createMerchandiseAvailable = async (merchandise) => {
    const {data} = await $authHost.post('api/merchandiseAvailable', merchandise)
    return data
}

export const updateMerchandiseAvailable = async (merchandise) => {
    const {data} = await $authHost.post('api/merchandiseAvailable/update', merchandise)
    return data
}

export const deleteMerchandiseAvailable = async (merchandiseId) => {
    const {data} = await $authHost.delete('api/merchandiseAvailable/delete', {data: {merchandiseId: merchandiseId}})
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brand')
    return data
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const createSize = async (size) => {
    const {data} = await $authHost.post('api/size', size)
    return data
}

export const fetchSizes = async () => {
    const {data} = await $authHost.get('api/size')
    return data
}

export const fetchNamesOfSizes = async (sizeId) => {
    const {data} = await $authHost.get('api/size/' + sizeId)
    return data
}

export const fetchMerchandises = async (typeId, brandId, page, limit, admin) => {
    const {data} = await $host.get('api/merchandise', {
        params: {typeId, brandId, page, limit, admin}
    })
    return data
}

export const fetchMerchandiseAvailable = async () => {
    const {data} = await $host.get('api/merchandiseAvailable')
    return data
}

export const fetchLook = async () => {
    const {data} = await $host.get('api/look')
    return data
}

export const fetchOneMerchandise = async (id) => {
    const {data} = await $host.get('api/merchandise/' + id)
    return data
}

export const deleteMerchandise = async (merchandiseId) => {
    const {data} = await $authHost.delete('api/merchandise', {data: {merchandiseId: merchandiseId}})
    return data
}

export const createLook = async (look) => {
    const {data} = await $authHost.post('api/look', look)
    return data
}





