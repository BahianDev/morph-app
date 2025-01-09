import axios from "axios";

const api = axios.create({
  baseURL: 'https://better-festival-3bb25677f9.strapiapp.com/api/'
});

export { api };