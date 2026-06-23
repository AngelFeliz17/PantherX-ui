import api from "../axios/api";

export const send = async (conversationId: string, content: string) => {
    const { data, status } = await api.post(`/messages/${conversationId}`, { content });
    return { data, status };
};
