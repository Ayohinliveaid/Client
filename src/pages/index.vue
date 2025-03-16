<template>
  <div class="backgroundStyle">
    <mapL7></mapL7>
    <dialogBar v-bind:showDialogBar="showDialogBar" ref="dialogSectioin"></dialogBar>
    <div class="userStyle" ref="user" v-on:click="toggleShowLoginModal">Login</div>
    <loginModal v-model:showLoginModal="showLoginModal" />
  </div>

  <!-- <chartG2>
      <div class="setPitch">
        <button
          class="buttonStyle"
          @mousedown="modifyAttribute('pitch', '+1')"
          @mouseup="stopModifing"
        >
          +
        </button>
        <button
          class="buttonStyle"
          @mousedown="modifyAttribute('pitch', '-1')"
          @mouseup="stopModifing"
        >
          -
        </button>
      </div>
      <div class="setRotation">
        <button
          class="buttonStyle"
          @mousedown="modifyAttribute('rotation', '+1')"
          @mouseup="stopModifing"
        >
          +
        </button>
        <button
          class="buttonStyle"
          @mousedown="modifyAttribute('rotation', '-1')"
          @mouseup="stopModifing"
        >
          -
        </button>
      </div>
    </chartG2> -->
</template>

<script setup>
import { onMounted, ref, reactive, toRefs } from "vue";

import loginModal from "/src/components/loginModal.vue";
import dialogBar from "/src/components/dialogBar.vue";
import chartG2 from "/src/components/chartG2.vue";
import mapL7 from "/src/components/mapL7.vue";

const state = reactive({
  title: "hah",
});
const { title } = toRefs(state);

//控制菜单点击后不收起
const dropdownVisible = ref(false);

// 隐藏对话框回答部分
const showDialogBar = ref(true);
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

// 编辑倾斜角度和旋转角度
let scene = null;

const modificationTimmer = ref(null);
//编辑场景对象参数，长按有效
const modifyAttribute = (attribute, change) => {
  modificationTimmer.value = setInterval(() => {
    if (attribute === "pitch") {
      pitch.value += Number(change); // 修改 pitch
      if (pitch.value < 0) {
        pitch.value = 0;
      } else if (pitch.value > 60) {
        pitch.value = 60;
      }
      if (scene) {
        scene.setPitch(pitch.value); // 确保使用最新的 pitch 值
      }
    } else if (attribute === "rotation") {
      rotation.value += Number(change); // 修改 rotation
      if (scene) {
        scene.setRotation(rotation.value); // 确保使用最新的 rotation 值
      }
    }
  }, 50);
};
const stopModifing = () => {
  clearInterval(modificationTimmer.value);
};

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
const showLoginModal = ref(false);
const toggleShowLoginModal = () => {
  showLoginModal.value = !showLoginModal.value;
  console.log(showLoginModal.value);
};
</script>

<style scoped lang="less" src="/src/styles/pages/index.less"></style>
