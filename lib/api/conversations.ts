import api from "../axios/api"

export const start = async (listingId: string) => {
    const { data } = await api.post(`/conversations/${listingId}`);
    return data;
};

export const findAll = async () => {
    const { data } = await api.get(`/conversations`);
    return data;
};

export const findConversation = async (id: string) => {
    const { data } = await api.get(`/conversations/${id}`);
    return data;
};