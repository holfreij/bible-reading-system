import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const getAudioFileUrl = async (url: string): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/scrape-audio-file-url`, {
    params: { url },
  });
  console.log(response);
  return response.data;
};
