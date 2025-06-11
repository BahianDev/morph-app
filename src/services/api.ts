import axios from "axios";

const api = axios.create({
  baseURL: 'https://better-festival-3bb25677f9.strapiapp.com/api/'
});

const api_backend = axios.create({
  baseURL: 'https://trophy-system-4e77f4028f3e.herokuapp.com/'
});

export { api, api_backend };