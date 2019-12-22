import axios from 'axios';

const baseUrl = 'http://192.168.1.102:3000/';

export const postPhoto = async ({ base64 }) => {
  console.log('got base64:', base64.slice(0, 30));
  const res = await axios.post(`${baseUrl}google-vision/annotate`, { base64 });
  return res.data;
}