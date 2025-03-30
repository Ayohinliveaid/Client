import axios from "axios";

// 获取 cookie
const getCookie = (name) => {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};
//封装统一的请求方法，包括从sessionStorage中获取token发送
const requestURL = (url, method, data = {}) => {
  const token = getCookie("estima_token");
  if (url.includes("/user/login") || url.includes("/user/signup")) {
    return axios({
      url,
      method,
      data,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      }, //如果属性名是合法的变量名（例如 Authorization），可以不用引号。但如果属性名 包含短横线（-），必须加引号
    });
  } else {
    return axios({
      url,
      method,
      data,
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }, //如果属性名是合法的变量名（例如 Authorization），可以不用引号。但如果属性名 包含短横线（-），必须加引号
    });
  }
};

export { requestURL };
