<template>
  <div class="backgroundStyle" ref="background">
    <div :class="leftActive ? 'mainArea leftActive' : 'mainArea rightActive'">
      <chartG2
        v-bind:data="data"
        v-bind:dataAndPredictedData="dataAndPredictedData"
        ref="theChartG2"
      ></chartG2>
      <!-- <mapL7 v-bind:data="data" ref="theMapL7"></mapL7> -->
      <chatBar
        v-model:activeKey="chatBarActiveKey"
        v-bind:deletedChat="deletedChat"
        ref="theChatBar"
        @changeTheChat="handleChangeTheChat($event, 'theMenuBar')"
        @appendTheChat="handleAppendTheChat($event)"
        @saveTheChat="handleSaveTheChat"
      ></chatBar>
      <menuBar
        v-model:activeKey="menuBarActiveKey"
        v-bind:savedChat="savedChat"
        ref="theMenuBar"
        @changeTheChat="handleChangeTheChat($event, 'theChatBar')"
        @appendTheChat="handleAppendTheChat($event)"
        @deleteTheChat="handleDeleteTheChat"
      ></menuBar>
    </div>

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
  chatBarActiveKey: [3],
  menuBarActiveKey: [],
  showLoginModal: false,
  data: [],
  dataAndPredictedData: {},
  savedChat: {},
  deletedChat: [],
  userText: "登录",
  leftActive: false,
});
const {
  title,
  theMapL7,
  theChartG2,
  chatBarActiveKey,
  menuBarActiveKey,
  showLoginModal,
  data,
  dataAndPredictedData,
  savedChat,
  deletedChat,
  userText,
  leftActive,
} = toRefs(state);

//控制菜单点击后不收起
const dropdownVisible = ref(false);

// 隐藏对话框回答部分
const theChatBar = ref(null);
const theMenuBar = ref(null);
const background = ref(null);

const chatSet = ref(null);
let canScroll = true;

//点击事件
// 监听整个页面的点击事件
const handleClick = (event) => {
  // if (
  //   (theMapL7.value && theMapL7.value.$el.contains(event.target)) ||
  //   (theChartG2.value && theChartG2.value.$el.contains(event.target))
  // ) {
  //   // if (background.value && background.value.contains(event.target)) {
  //   console.log("点击了 theMapL7");
  //   chatBarActiveKey.value = [];
  //   menuBarActiveKey.value = [];
  // } else {
  //   console.log("点击了theMapL7以外地方");
  // }
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

//接受对话模块传输的数据，并控制活跃状态
const handleChangeTheChat = (data, type = null) => {
  // console.log("index.vue recevied changement of the chat");
  // alert(JSON.stringify(data));
  state.data = data;
  if (type == "theChatBar") {
    theChatBar.value.deactivatedTheChatBar(); //改变对话栏本身状态
    chatBarActiveKey.value = [];
    state.leftActive = true; //通过改变背景，改变图表组件样式
  } else if (type == "theMenuBar") {
    theMenuBar.value.deactivatedTheChatBar();
    menuBarActiveKey.value = [];
    state.leftActive = false;

    console.log("state.leftActive", state.leftActive);
  }
};

//预测模块中，将数据更新为原始数据和预测数据的叠加
const handleAppendTheChat = (dataAndPredictedData) => {
  console.log("index中handleAppendTheChat收到预测数据");
  state.dataAndPredictedData = dataAndPredictedData;
  console.log("index中最新state.dataAndPredictedData", state.dataAndPredictedData);
};
const handleSaveTheChat = (savedChat) => {
  state.savedChat = savedChat;
};
const handleDeleteTheChat = (deletedChat) => {
  state.deletedChat = deletedChat;
};
</script>

<style scoped lang="less" src="/src/styles/pages/index.less"></style>
