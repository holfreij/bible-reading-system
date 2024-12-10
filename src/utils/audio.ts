import axios from "axios";

const BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_RENDER_URL
  : "http://localhost:3000";

export const getAudioFileUrl = async (url: string): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/scrape-audio-file-url`, {
    params: { url },
  });
  return response.data;
};
