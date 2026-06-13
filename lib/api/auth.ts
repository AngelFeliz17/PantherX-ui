import { SignUpData, VerifyCodeData } from "@/lib/dto/auth.dto";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signUp = async (data: SignUpData) => {
    const res = await axios.post(`${API_URL}/auth/signup`, data)
    return res.data;
}

export const verifyAccount = async (data: VerifyCodeData) => {
    const res = await axios.put(`${API_URL}/auth/verify-code`, data);
    return res.data;
}

export const generateCode = async (email: string) => {
    const res = await axios.post(`${API_URL}/auth/generate-code`, { email });
    return res.data;
}