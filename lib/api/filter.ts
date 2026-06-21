import { FilterType } from "@/interfaces/filter";
import api from "../axios/api"

export const filterListings = async (filters: FilterType) => {
    const { data } = await api.get("/filters", {
        params: filters,
        paramsSerializer: {
            indexes: null
        }
    });
    return data;
}