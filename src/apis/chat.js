import { requestURL } from "./http";
//具体某一个接口，只需要在本文件中配置url，请求方式，请求体这三个参数
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//向AI提问并获得回答
const CHAT_GETRESPONSE = (question) =>
  requestURL(VITE_API_BASE_URL + "/chat/getResponse", "post", question);

//注册
const USER_SIGNUP = (data) =>
  requestURL(VITE_API_BASE_URL + "/user/signup", "post", data);

export { CHAT_GETRESPONSE, USER_SIGNUP };
