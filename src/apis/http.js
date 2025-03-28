import axios from "axios";
//封装统一的请求方法，包括从sessionStorage中获取token发送
const requestURL = (url, method, data) => {
  const token = sessionStorage.getItem("token");
  return axios({
    url,
    method,
    data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }, //如果属性名是合法的变量名（例如 Authorization），可以不用引号。但如果属性名 包含短横线（-），必须加引号
  });
};

export { requestURL };
