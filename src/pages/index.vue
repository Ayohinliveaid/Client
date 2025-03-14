<template>
  <!-- <div class="layout" ref="layout"> -->
  <div id="container"></div>
  <div class="mapStyle" id="map" @click="handleClick">
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

    <div class="userStyle" ref="user" v-on:click="toggleShowLoginModal">Login</div>
    <loginModal :showLoginModal="showLoginModal" />

    <dialogBar v-bind:showDialogBar="showDialogBar" ref="dialogSectioin" />
  </div>

  <!-- </div> -->
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  Scene,
  PolygonLayer,
  LineLayer,
  PointLayer,
  Marker,
  HeatmapLayer,
} from "@antv/l7";
import { Mapbox, GaodeMap } from "@antv/l7-maps";
// import { nodeListProps } from "ant-design-vue/es/vc-tree/props";
import loginModal from "/src/components/loginModal.vue";
import dialogBar from "/src/components/dialogBar.vue";

//title引用的数组
const titleRefs = ref([]);

// 保存回答
const save = () => {};

// 隐藏对话框回答部分
const showDialogBar = ref(true);
const dialogSectioin = ref(null);
const handleClick = (event) => {
  showDialogBar.value = false;
  if (dialogSectioin.value.$el?.contains(event.target)) {
    if (showDialogBar.value === false) return;
    showDialogBar.value = false;

    // titleRefs.value.forEach((v, i) => {
    //   v.style.borderRadius = "10px 10px 0 0";
    //   v.style.opacity = "1";
    // });
    // dialogSet.value.style.marginBottom = "20px";
    // //设置向下舒展的动态效果
    // showDialogBar.value = false;
    // dialogSectioin.value.style.backgroundColor = "rgba(225,155,255,1)";
    // const id = setInterval(() => {
    //   dialogSectioin.value.style.height =
    //     parseFloat(window.getComputedStyle(dialogSectioin.value).height) + 10 + "px";
    //   // console.log(dialogSectioin.value.style.height);
    // }, 1);
    // setTimeout(() => {
    //   dialogSectioin.value.style.height = "calc(100vh - 20px)";
    //   clearInterval(id);
    // }, 100);
  } else if (!user.value.contains(event.target)) {
    showLoginModal.value = false;
    if (showDialogBar.value === true) return;

    // titleRefs.value.forEach((v, i) => {
    //   v.style.borderRadius = "10px";
    //   v.style.opacity = "0.3";
    // });
    // dialogSet.value.style.marginBottom = "0";

    // //设置向上收缩的动态效果
    // const id = setInterval(() => {
    //   dialogSectioin.value.style.height =
    //     parseFloat(window.getComputedStyle(dialogSectioin.value).height) - 18 + "px";
    //   // console.log(dialogSectioin.value.style.height);
    // }, 1);
    // setTimeout(() => {
    //   dialogSectioin.value.style.height = "auto";
    //   clearInterval(id);
    //   dialogSectioin.value.style.backgroundColor = "rgba(255,255,255,0)";
    //   showDialogBar.value = true;
    // }, 100);
  }
};

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
const pitch = ref(30);
const rotation = ref(0);
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

//点图层气泡图
onMounted(() => {
  scene = new Scene({
    id: "map",
    map: new GaodeMap({
      pitch: pitch.value,
      style: "light",
      center: [115.4646, 38.874],
      zoom: 5,
      rotation: rotation.value,
    }),
  });

  fetch("https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json")
    // fetch("http://127.0.0.1:8000/property/getData")
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: "json",
            x: "j",
            y: "w",
          },
        })
        .shape("circle")
        .size("t", function (level) {
          return [level * 0.01 + 10, level * 0.1 + 10];
        })
        .color("t", [
          "#094D4A",
          "#146968",
          "#1D7F7E",
          "#289899",
          "#34B6B7",
          "#4AC5AF",
          "#5FD3A6",
          "#7BE39E",
          "#A1EDB8",
          "#CEF8D6",
        ])
        .style({
          opacity: 0.3,
          strokeWidth: 1,
          stroke: "green",
          zIndex: 0,
        })
        .active(true);
      scene.addLayer(pointLayer);
    });

  // scene.on("loaded", () => {
  //   fetch(
  //     "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
  //   )
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const layer = new HeatmapLayer({})
  //         .source(data)
  //         .shape("heatmap")
  //         .size("mag", [0, 0.2]) // weight映射通道
  //         .style({
  //           intensity: 2,
  //           radius: 20,
  //           rampColors: {
  //             colors: [
  //               "#FF4818",
  //               "#F7B74A",
  //               "#FFF598",
  //               "#91EABC",
  //               "#2EA9A1",
  //               "#206C7C",
  //             ].reverse(),
  //             positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  //           },
  //           zIndex: 0,
  //         });
  //       scene.addLayer(layer);
  //     });
  // });
});

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
