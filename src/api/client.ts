import axios from "axios";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "X-Api-Token": API_TOKEN,
  },
});