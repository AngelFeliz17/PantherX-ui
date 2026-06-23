import api from "../axios/api"

export const add = async (id: string) => {
    const { data } = await api.post(`/favorites/${id}`);
    return data;
}

export const remove = async (id: string) => {
    const { data } = await api.delete(`/favorites/${id}`);
    return data;
}

export const find = async () => {
    const data = await api.get('/favorites');
    return data;
}