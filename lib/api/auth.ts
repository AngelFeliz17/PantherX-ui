import { ForgotPasswordEmailData, ResetPasswordData, SignUpData, VerifyCodeData } from "@/lib/dto/auth.dto";
import api from "../axios/api";

export const signUp = async (data: SignUpData) => {
    const res = await api.post(`/auth/signup`, data)
    console.log("Error is: " + res)
    return res.data;
}

export const logIn = async (data: Omit<SignUpData, "name">) => {
    const res = await api.post(`/auth/login`, data)
    return res.data;
}

export const logOut = async () => {
    await api.post('/auth/logout');
}

export const verifyAccount = async (data: VerifyCodeData) => {
    const res = await api.put(`/auth/verify-code`, data);
    return res.data;
}

export const generateCode = async (email: string) => {
    const res = await api.post(`/auth/generate-code`, { email });
    return res.data;
}

export const sendForgotPasswordEmail = async (data: ForgotPasswordEmailData) => {
    const res = await api.post(`/auth/forgot-password`, data);
    return res.data;
}

export const resetPassword = async (token: string, data: ResetPasswordData) => {
    const res = await api.put(`/auth/reset-password/${token}`, data );
    return res.data;
}