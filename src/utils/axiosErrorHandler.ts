import { AxiosError } from "axios";
import { ResponseError } from "./responseError";

function handleAxiosError(error: AxiosError, query: string): ResponseError {
  const resError = new Error() as ResponseError;
  if (error.response) {
    resError.message = JSON.stringify(error.response.data);
    resError.status = 400;
    resError.stack = error.stack;
    resError.query = query;
  } else {
    resError.message = "Could not receive or parse response from database";
    resError.status = 502;
    resError.stack = error.stack;
  }
  return resError;
}

export default {
  handleAxiosError
};