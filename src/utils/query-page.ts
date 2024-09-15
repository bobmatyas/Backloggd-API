import config from "../config";
import axios, { AxiosError } from 'axios';

async function queryPage( endpoint: string, username: string) {
	const referer = `https://${config.baseUrl}/search/users/${username}`;
	
	try {
	  const response = await axios.get(`https://${config.baseUrl}${endpoint}`, {
		headers: {
		  ...config.headers,
		  "Turbolinks-Referrer": referer,
		  Referer: referer,
		},
	  });
	  return response.data; // Return the data if the request is successful
	} catch (err) {
	  const axiosError = err as AxiosError; // Type assertion to AxiosError
	  console.log(axiosError.response?.status);
	  
	  let error: string;
	  let status: number;
  
	  if (axiosError.response?.status === 404) {
		error = "User not found";
		status = 404;
	  } else {
		error = axiosError.message;
		status = axiosError.response?.status || 500;
	  }
  
	  return {
		error: error,
		status: status,
	  };
	}
}



export { queryPage }