import api from "../axios/api"

export const report = async (id: string, reason: string) => {
    const { data } = await api.post(`/reports/${id}`, { reason })
    return data;
}