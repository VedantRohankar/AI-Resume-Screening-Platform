import api from './api.js';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getResume = async () => {
  const response = await api.get('/resume');
  return response.data;
};

export const deleteResume = async () => {
  const response = await api.delete('/resume');
  return response.data;
};

export const downloadResume = async () => {
  const response = await api.get('/resume/download');
  return response.data;
};
