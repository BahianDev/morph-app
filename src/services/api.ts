import axios from "axios";

const api = axios.create({
  baseURL: 'https://better-festival-3bb25677f9.strapiapp.com/api/'
});

const api_backend = axios.create({
  baseURL: 'http://localhost:3001/'
});

export { api, api_backend };