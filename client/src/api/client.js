import axios from "axios";

const BASE_URL = "https://mern-movie-reiew-app.vercel.app/api/v1";
// const BASE_URL = "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
});

export default client;
