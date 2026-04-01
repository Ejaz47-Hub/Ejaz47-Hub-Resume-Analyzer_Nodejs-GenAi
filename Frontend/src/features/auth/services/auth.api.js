import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Register API error:", error);
    throw error.response?.data || new Error("Registration failed");
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post(
      "/api/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error.response?.data || new Error("Login failed");
  }
}

export async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.error("Logout API error:", error);
    throw error.response?.data || new Error("Logout failed");
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (error) {
    console.error("GetMe API error:", error.message);
    throw error.response?.data || new Error("Failed to fetch user data");
  }
}
