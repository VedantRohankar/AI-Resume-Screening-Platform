import api from './api.js';

export const getCompany = async () => {
  const response = await api.get('/company');
  return response.data;
};

export const createCompany = async (companyData) => {
  const response = await api.post('/company', companyData);
  return response.data;
};

export const updateCompany = async (companyData) => {
  const response = await api.patch('/company', companyData);
  return response.data;
};

export const deleteCompany = async () => {
  const response = await api.delete('/company');
  return response.data;
};
