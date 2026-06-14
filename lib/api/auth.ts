import { ForgotPasswordEmailData, ResetPasswordData, SignUpData, VerifyCodeData } from "@/lib/dto/auth.dto";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.withCredentials = true;

export const signUp = async (data: SignUpData) => {
    const res = await axios.post(`${API_URL}/auth/signup`, data)
    return res.data;
}

export const logIn = async (data: Omit<SignUpData, "name">) => {
    const res = await axios.post(`${API_URL}/auth/login`, data)
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

export const sendForgotPasswordEmail = async (data: ForgotPasswordEmailData) => {
    const res = await axios.post(`${API_URL}/auth/forgot-password`, data);
    return res.data;
}

export const resetPassword = async (token: string, data: ResetPasswordData) => {
    const res = await axios.put(`${API_URL}/auth/reset-password/${token}`, data );
    return res.data;
}