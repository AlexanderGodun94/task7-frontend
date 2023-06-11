import axios from 'axios';
import { API_URL } from 'shared/config';
import { ICreateInvestor } from 'shared/types';
import { GetRequestsApiParams, IRequest } from "../../../entities/request";

const getInvestor = () => {
  return axios.get(`${API_URL}/api/v1/user`);
};

const createInvestor = (email: string, password: string, firstName: string, lastName: string) => {
  return axios.post<ICreateInvestor>(`${API_URL}/api/v1/user`, { email, password , firstName, lastName});
};

const getUsers = () => {
    return axios.get(`${API_URL}/api/v1/user/users`);
};

const createOrFindUser = (username: string) => {
    return axios.post<ICreateInvestor>(`${API_URL}/api/v1/user`, { username });
};

const createMessage = (receiverName: string, title: string, message: string ) => {
    return axios.post(`${API_URL}/api/v1/user/messages`, {receiverName, title, message});
};

const getMessages = (params?: GetRequestsApiParams) => {
    return axios.get<IRequest[]>(`${API_URL}/api/v1/user/messages`, { params: { ...params, reverse: true } });
};

const getGameTypes = (params?: GetRequestsApiParams) => {
    return axios.get<IRequest[]>(`${API_URL}/api/v1/user/gameTypes`, { params: { ...params, reverse: true } });
};

const getSessions = (params?: GetRequestsApiParams) => {
    return axios.get<IRequest[]>(`${API_URL}/api/v1/user/sessions`, { params: { ...params, reverse: true } });
};

const createSession = (gameTypeId: string) => {
    return axios.post(`${API_URL}/api/v1/user/session`, { gameTypeId });
};


const connectSession = (sessionId: string) => {
    return axios.post(`${API_URL}/api/v1/user/session/connect`, { sessionId });
};

const getGameTicTacToe = (sessionId: string) => {
    return axios.get(`${API_URL}/api/v1/user/game/ticTacToe`, { params: { sessionId} });
};


const deleteUser = (userId: string) => {
  return axios.delete(`${API_URL}/api/v1/user/users`, { data: {userId }});
};

const updateUserStatus = (userId: string, status: string) => {
    return axios.put(`${API_URL}/api/v1/user/status`, { userId , status});
};


const sendEmailCode = () => {
  return axios.get(`${API_URL}/api/v1/investor/sendEmailSms`);
};

const verifyEmail = (code: string) => {
  return axios.post(`${API_URL}/api/v1/investor/verifyEmail`, { code });
};

const setInvestorPhone = (phone: string) => {
  return axios.post(`${API_URL}/api/v1/investor/phone`, { phone });
};

const sendPhoneCode = () => {
  return axios.get(`${API_URL}/api/v1/investor/sendPhoneSms`);
};

const verifyPhone = (code: string) => {
  return axios.post(`${API_URL}/api/v1/investor/verifyPhone`, { code });
};

const startLogin = (email: string, password: string) => {
  return axios.post(`${API_URL}/api/v1/auth`, { email , password});
};

const getLoginToken = (data: {email: string, code: string}) => {
  return axios.post(`${API_URL}/api/v1/auth/token`, { email: data.email, code: data.code });
};

export const authApi = {
    getInvestor,
    getSessions,
    getGameTypes,
    getGameTicTacToe,
    connectSession,
    createSession,
    getMessages,
    createOrFindUser,
    getUsers,
    createMessage,
    createInvestor,
    sendEmailCode,
    verifyEmail,
    setInvestorPhone,
    sendPhoneCode,
    verifyPhone,
    startLogin,
    getLoginToken,
    deleteUser,
    updateUserStatus,
};
