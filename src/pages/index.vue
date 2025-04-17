<template>
  <div class="backgroundStyle" ref="background">
    <chartG2 v-bind:data="data" ref="theChartG2"></chartG2>
    <!-- <mapL7 v-bind:data="data" ref="theMapL7"></mapL7> -->
    <chatBar
      v-model:activeKey="chatBarActiveKey"
      v-bind:deletedChat="deletedChat"
      ref="theChatBar"
      @changeTheChat="handleChangeTheChat"
      @saveTheChat="handleSaveTheChat"
    ></chatBar>
    <menuBar
      v-model:activeKey="menuBarActiveKey"
      v-bind:savedChat="savedChat"
      ref="theChatBar"
      @changeTheChat="handleChangeTheChat"
      @deleteTheChat="handleDeleteTheChat"
    ></menuBar>
    <div class="userStyle" ref="user" v-on:click="toggleShowLoginModal">
      {{ userText }}
    </div>
    <loginModal v-model:showLoginModal="showLoginModal" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, onUnmounted } from "vue";

import loginModal from "/src/components/loginModal.vue";
import chatBar from "/src/components/chatBar.vue";
import menuBar from "/src/components/menuBar.vue";
import chartG2 from "/src/components/chartG2.vue";
import mapL7 from "/src/components/mapL7.vue";
import axios from "axios";

const state = reactive({
  title: "hah",
  theMapL7: null,
  theChartG2: null,
  chatBarActiveKey: [],
  menuBarActiveKey: [3],
  showLoginModal: false,
  data: [],
  savedChat: {},
  deletedChat: [],
  userText: "登录",
});
const {
  title,
  theMapL7,
  theChartG2,
  chatBarActiveKey,
  menuBarActiveKey,
  showLoginModal,
  data,
  savedChat,
  deletedChat,
  userText,
} = toRefs(state);

//控制菜单点击后不收起
const dropdownVisible = ref(false);

// 隐藏对话框回答部分
const theChatBar = ref(null);
const background = ref(null);

const chatSet = ref(null);
let canScroll = true;

//点击事件
// 监听整个页面的点击事件
const handleClick = (event) => {
  if (
    (theMapL7.value && theMapL7.value.$el.contains(event.target)) ||
    (theChartG2.value && theChartG2.value.$el.contains(event.target))
  ) {
    // if (background.value && background.value.contains(event.target)) {
    console.log("点击了 theMapL7");
    chatBarActiveKey.value = [];
    menuBarActiveKey.value = [];
  } else {
    console.log("点击了theMapL7以外地方");
  }
};
onMounted(() => {
  document.addEventListener("click", handleClick);
  if (!sessionStorage.getItem("estimaLoginState")) {
    state.userText = "登录";
  } else {
    state.userText = "用户";
  }
});
onUnmounted(() => {
  document.removeEventListener("click", handleClick);
});

//登录注册模块
const user = ref(null);
const toggleShowLoginModal = () => {
  state.showLoginModal = !state.showLoginModal;
  console.log(showLoginModal.value);
};

//接受对话模块传输的数据
const handleChangeTheChat = (data) => {
  // console.log("index.vue recevied changement of the chat");
  // alert(JSON.stringify(data));
  state.data = data;
};
const handleSaveTheChat = (savedChat) => {
  state.savedChat = savedChat;
};
const handleDeleteTheChat = (deletedChat) => {
  state.deletedChat = deletedChat;
};
</script>

<style scoped lang="less" src="/src/styles/pages/index.less"></style>
