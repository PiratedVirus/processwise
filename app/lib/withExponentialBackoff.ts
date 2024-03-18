import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

async function withExponentialBackoff<T>(axiosConfig: AxiosRequestConfig, maxRetries: number = 5, initialDelay: number = 1000): Promise<AxiosResponse<T>> {
  let attempt = 0;
let delay = initialDelay;

while (attempt < maxRetries) {
    try {
        return await axios(axiosConfig); // Attempt the request
    } catch (error: any) {
        if (!error.response || (error.response.status !== 429 && !(error.response.status >= 500 && error.response.status < 600))) {
            throw error as Error; // Throw if error is not due to rate limiting or server error
        }
        attempt++;
        console.log(`Request failed with status ${error.response.status}. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Double the delay for the next attempt
    }
}

  throw new Error(`Request failed after ${maxRetries} attempts.`);
}
export default withExponentialBackoff;