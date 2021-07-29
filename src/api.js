import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.b7web.com.br/carros/api'
});

export default api;