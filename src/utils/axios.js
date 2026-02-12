import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.request.use(async (config) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // No active session, continue without auth header
  }

  return config;
});

export default instance;
