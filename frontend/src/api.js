// File: frontend/src/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadResumes = async (jobDescription, resumes) => {
  const formData = new FormData();
  formData.append('job_description', jobDescription);
  resumes.forEach((file) => {
    formData.append('resume', file); // Only handles one file, see note below
  });
  return axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadMultiple = async (jobDescription, resumeFiles) => {
  const uploadPromises = resumeFiles.map(async (file) => {
    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('resume', file);
    return axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => ({ filename: file.name, ...res.data }));
  });
  return Promise.all(uploadPromises);
};
