<template>
  <div class="backgroundStyle">
    <!-- <chartG2></chartG2> -->
    <mapL7 ref="theMapL7"></mapL7>
    <dialogBar v-model:activeKey="activeKey" ref="dialogSectioin"></dialogBar>
    <div class="userStyle" ref="user" v-on:click="toggleShowLoginModal">Login</div>
    <loginModal v-model:showLoginModal="showLoginModal" />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs } from "vue";

import loginModal from "/src/components/loginModal.vue";
import dialogBar from "/src/components/dialogBar.vue";
import chartG2 from "/src/components/chartG2.vue";
import mapL7 from "/src/components/mapL7.vue";

const state = reactive({
  title: "hah",
  theMapL7: null,
  activeKey: [],
});
const { title, theMapL7, activeKey } = toRefs(state);

//控制菜单点击后不收起
const dropdownVisible = ref(false);

// 隐藏对话框回答部分
const dialogSectioin = ref(null);

const dialogSet = ref(null);
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

  const width = parseFloat(window.getComputedStyle(dialogSet.value).width);
  if (event.deltaX > 0) {
    var distance = Math.ceil(event.deltaX / width) * width;
  } else {
    var distance = Math.floor(event.deltaX / width) * width;
  }
  console.log(event.deltaX, "px");
  setTimeout(() => {
    dialogSet.value.scrollLeft -= event.deltaX;
    dialogSet.value.scrollLeft += distance;
    console.log(event.deltaX, distance, "px");
  }, 1000);
};

//点击事件
// 监听整个页面的点击事件
const handleClick = (event) => {
  if (theMapL7.value && theMapL7.value.$el.contains(event.target)) {
    console.log("点击了 mapL7 组件");
    activeKey.value = [];
  } else {
    console.log("点击了其他地方");
  }
};

onMounted(() => {
  // 在 mounted 时，给 document 添加点击事件监听器
  document.addEventListener("click", handleClick);
});

// onBeforeUnmount(() => {
//   // 在组件卸载时，移除事件监听器
//   document.removeEventListener("click", handleClick);
// });

const layout = ref("layout");
const dialog = ref("dialog");

onMounted(() => {
  //响应式设计，根据宽高比来决定对话框位置，默认PC，如果是手机则修改位置
  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;
  if (innerWidth < innerHeight) {
    layout.value.style.flexDirection = "column";
    dialog.value.style.width = "100%";
    dialog.value.style.height = "30%";
  }
});

//登录注册模块
const user = ref(null);
const toggleShowLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
  console.log(showLoginModal.value);
};
</script>

<style scoped lang="less" src="/src/styles/pages/index.less"></style>
