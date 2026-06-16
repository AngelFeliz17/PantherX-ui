import { ForgotPasswordEmailData, ResetPasswordData, SignUpData, VerifyCodeData } from "@/lib/dto/auth.dto";
import api from "../axios/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signUp = async (data: SignUpData) => {
    const res = await api.post(`${API_URL}/auth/signup`, data)
    return res.data;
}

export const logIn = async (data: Omit<SignUpData, "name">) => {
    const res = await api.post(`${API_URL}/auth/login`, data)
    return res.data;
}

export const verifyAccount = async (data: VerifyCodeData) => {
    const res = await api.put(`${API_URL}/auth/verify-code`, data);
    return res.data;
}

export const generateCode = async (email: string) => {
    const res = await api.post(`${API_URL}/auth/generate-code`, { email });
    return res.data;
}

export const sendForgotPasswordEmail = async (data: ForgotPasswordEmailData) => {
    const res = await api.post(`${API_URL}/auth/forgot-password`, data);
    return res.data;
}

export const resetPassword = async (token: string, data: ResetPasswordData) => {
    const res = await api.put(`${API_URL}/auth/reset-password/${token}`, data );
    return res.data;
}