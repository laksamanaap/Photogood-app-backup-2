import axios from "axios";
import Domain from "./baseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";

const client = axios.create({
  baseURL: Domain.ipAddress,
});

client.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        config.params = {
          ...config.params,
          token: token,
        };
      }
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
