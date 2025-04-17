import { requestURL } from "./http";
//具体某一个接口，只需要在本文件中配置url，请求方式，请求体这三个参数
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = "jj";
//登录
const USER_LOGIN = (data) =>
  requestURL(VITE_API_BASE_URL + "/user/login", "post", data);

//注册
const USER_SIGNUP = (data) =>
  requestURL(VITE_API_BASE_URL + "/user/signup", "post", data);

//请求用户信息
const USER_GETUSERINFO = (data) =>
  requestURL(VITE_API_BASE_URL + "/user/getUserInfo", "post", data);

export { USER_LOGIN, USER_SIGNUP, USER_GETUSERINFO };
