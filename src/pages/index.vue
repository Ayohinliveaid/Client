<template>
  <div class="backgroundStyle" ref="background">
    <chartG2 v-bind:data="data" ref="theChartG2"></chartG2>
    <!-- <mapL7 v-bind:data="data" ref="theMapL7"></mapL7> -->
    <chatBar
      v-model:activeKey="chatBarActiveKey"
      ref="theChatBar"
      @changeTheChat="handleChangeTheChat"
    ></chatBar>
    <menuBar
      v-model:activeKey="menuBarActiveKey"
      ref="theChatBar"
      @changeTheChat="handleChangeTheChat"
    ></menuBar>
    <div class="userStyle" ref="user" v-on:click="toggleShowLoginModal">Login</div>
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
});
const {
  title,
  theMapL7,
  theChartG2,
  chatBarActiveKey,
  menuBarActiveKey,
  showLoginModal,
  data,
} = toRefs(state);

//控制菜单点击后不收起
const dropdownVisible = ref(false);

// 隐藏对话框回答部分
const theChatBar = ref(null);
const background = ref(null);

const chatSet = ref(null);
let canScroll = true;
//设置对话合集滚动固定距离
const handleScroll = (event) => {
  event.preventDefault();

  //避免多次调用，进而降低灵敏度，1s内只调用一次
  if (!canScroll) return;
  canScroll = false;
  setTimeout(() => {
    canScroll = true;
  }, 1200);

  const width = parseFloat(window.getComputedStyle(chatSet.value).width);
  if (event.deltaX > 0) {
    var distance = Math.ceil(event.deltaX / width) * width;
  } else {
    var distance = Math.floor(event.deltaX / width) * width;
  }
  console.log(event.deltaX, "px");
  setTimeout(() => {
    chatSet.value.scrollLeft -= event.deltaX;
    chatSet.value.scrollLeft += distance;
    console.log(event.deltaX, distance, "px");
  }, 1000);
};

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
});
onUnmounted(() => {
  document.removeEventListener("click", handleClick);
});

const layout = ref("layout");
const chat = ref("chat");

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
</script>

<style scoped lang="less" src="/src/styles/pages/index.less"></style>
