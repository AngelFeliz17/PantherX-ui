import api from "../axios/api";

export const findAll = async () => {
    const { data } = await api.get('/listings');
    return data;
}

export const create = async (dataForm: FormData) => {
    const { data, status} = await api.post('/listings', dataForm);
    return { data, status };
}

export const update = async (id: string, dataForm: FormData) => {
    const { data, status} = await api.patch(`/listings/${id}`, dataForm);
    return { data, status };
}

export const find = async (id: string) => {
    const { data } = await api.get(`/listings/${id}`);
    return data;
}