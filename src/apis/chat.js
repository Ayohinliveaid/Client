import { requestURL } from "./http";
//具体某一个接口，只需要在本文件中配置url，请求方式，请求体这三个参数
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

//向AI提问并获得回答
const CHAT_GETRESPONSE = (question) =>
  requestURL(VITE_API_BASE_URL + "/chat/getResponse", "post", question);
//获取对话历史
const CHAT_GETCHATHISTORY = () =>
  requestURL(VITE_API_BASE_URL + "/chat/getChatHistroy", "post");
//获取保存对话列表
const CHAT_GETSAVEDCHATS = () =>
  requestURL(VITE_API_BASE_URL + "/chat/getSavedChats", "post");

//删除当前对话列表
const CHAT_DELETETHECHAT = (chat) =>
  requestURL(VITE_API_BASE_URL + "/chat/deleteTheChat", "post", chat);

//获取保存对话列表
const CHAT_SAVETHECHAT = (chat) =>
  requestURL(VITE_API_BASE_URL + "/chat/saveTheChat", "post", chat);

//更新对话历史记录列表
const CHAT_UPDATECHATHISTORY = (chat) =>
  requestURL(VITE_API_BASE_URL + "/chat/updateChatHistory", "post", chat);

export {
  CHAT_GETRESPONSE,
  CHAT_GETSAVEDCHATS,
  CHAT_GETCHATHISTORY,
  CHAT_SAVETHECHAT,
  CHAT_DELETETHECHAT,
  CHAT_UPDATECHATHISTORY,
};
