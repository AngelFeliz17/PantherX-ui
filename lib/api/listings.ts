import api from "../axios/api";

export const findAll = async () => {
    const { data } = await api.get('/listings');
    return data;
}