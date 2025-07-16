import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';  // Ensure this matches your backend

export const uploadMultiple = async (jobDescription, resumeFiles) => {
  const formData = new FormData();
  formData.append('job_description', jobDescription);

  resumeFiles.forEach((file) => {
    formData.append('resumes', file);  // <-- this must match Flask expecting "resumes"
  });

  const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.ranked_resumes;
};
