import axios from 'axios';
import { API_URL } from 'shared/config';
import {CreateRequestApiParams, IRequest, IRequestDetails, IRequestType} from '../model/types';


export const getRequestTypes = () => {
  return axios.get<IRequestType[]>(`${API_URL}/api/v1/investor/typesChecks`);
};

const generateRequestTypes = () => {
  return axios.post(`${API_URL}/api/v1/investor/typesChecks`);
};

const createRequest = (data: any) => (
  axios.post(`${API_URL}/api/v1/investor/request`, data)
);


const createGameTicTacToeMove = (sessionId: string, cellNumber: number) => {
    return axios.post(`${API_URL}/api/v1/user/game/ticTacToe/move`, { sessionId , cellNumber} );
};

const getGameTicTacToe = (sessionId: string) => {
    return axios.get(`${API_URL}/api/v1/user/game/ticTacToe`, { params: { sessionId} });
};

const createGameTicTacToe5x5Move= (sessionId: string, cellNumber: number) => {
    return axios.post(`${API_URL}/api/v1/user/game/ticTacToe5x5/move`, { sessionId , cellNumber} );
};

const getGameTicTacToe5x5 = (sessionId: string) => {
    return axios.get(`${API_URL}/api/v1/user/game/ticTacToe5x5`, { params: { sessionId} });
};

type attachFileParams = {
  file: File,
  countryId: string,
  requestId: string,
  idDocType: string
};
const attachFile = (data: attachFileParams) => {
  const formData = new FormData();
  for (const key in data) {
    // @ts-ignore
    formData.append(key, data[key]);
  }
  return axios.post(`${API_URL}/api/v1/investor/request/document`, formData);
};

const initCheck = (requestId: string) => (
  axios.get(`${API_URL}/api/v1/investor/request/check`, { params: { requestId } })
);

const getRequestDetails = (sessionId: string) => (
    axios.get(`${API_URL}/api/v1/user/session`, { params: { sessionId: sessionId } })
);


const getRequestDetailsAdmin = (id: string) => (
  axios.get<IRequestDetails>(`${API_URL}/api/v1/admin/request`, { params: { requestId: id } })
);

export const requestApi = {
    generateRequestTypes,
    getRequestTypes,
    createRequest,
    initCheck,
    attachFile,
    getRequestDetails,
    createGameTicTacToeMove,
    getGameTicTacToe,
    createGameTicTacToe5x5Move,
    getGameTicTacToe5x5,

};

export const adminRequestApi = {
  getRequestDetails: getRequestDetailsAdmin
};
