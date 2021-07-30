import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.b7web.com.br/carros/api'
});

export default {
  getCarList: async (year = null) => {
    let { data: json } = await api.get(`/carros?ano=${year}`);
    return json;
  },
  login: async (email, password) => {
    let { data: json } = await api.post('/auth/login', {email, password});
    return json;
  },
  register: async (name, email, password) => {
    let { data: json } = await api.post('/auth/register', {
      name, email, password
    });
    return json;
  },
  addNewCar: async (brand, name, year, price, photo, token) => {
    let body = new FormData();
    body.append('brand', brand);
    body.append('name', name);
    body.append('year', year);
    body.append('price', price);

    if(photo) {
      body.append('photo', photo);
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;
    let { data: json } = await api.post('/carro', body);
    return json;
  }
};