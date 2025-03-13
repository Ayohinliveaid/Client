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

    <div class="dialogSectioinStyle" ref="dialogSectioin">
      <div class="dialogSetStyle" @wheel="handleScroll" ref="dialogSet">
        <div class="dialogStyle" v-for="i in 3">
          <div class="outputTextStyle titleStyle" ref="titleRefs">这是提出的问题</div>
          <div v-if="!hide">
            <div class="outputTextStyle contentStyle">{{ outputText }}</div>
            <div class="saveButtonStyle" v-if="outputText" @click="save">
              保存这个回答
            </div>
          </div>
        </div>
      </div>

      <textarea
        id="inputBox"
        ref="inputBox"
        v-model="inputText"
        placeholder="给Estima发送消息"
        placeholder-class="textarea-placeholder"
        @input="adjustHeight"
        class="inputStyle"
        @keyup.enter.prevent="submit"
        @keydown.enter.prevent
        v-if="!hide"
      />
    </div>
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
import { nodeListProps } from "ant-design-vue/es/vc-tree/props";
import loginModal from "/src/components/loginModal.vue";

// 初始化文本和文本框高度
const text = ref("");
const inputBox = ref(null);

// 动态调整textarea高度
const adjustHeight = () => {
  // // 重置高度，保证在清空输入内容后，高度自动恢复
  inputBox.value.style.height = "auto";
  // 根据内容设置高度
  inputBox.value.style.height = `${inputBox.value.scrollHeight}px`;
};

//提交问题
const inputText = ref("");
//title引用的数组
const titleRefs = ref([]);

const outputText = ref(
  "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight"
);

const submit = () => {
  titleRefs.value[titleRefs.value.length - 1].innerText = inputText.value;
  inputText.value = "";
  setTimeout(() => {
    //浏览器计算高度有延迟，需要异步执行该函数
    adjustHeight();
  }, 50);
  //滚动到最右侧的
  const width = parseFloat(window.getComputedStyle(dialogSet.value).width);
  dialogSet.value.scrollLeft += titleRefs.value.length * width;
};

//保存回答
const save = () => {};

// 隐藏对话框回答部分
const hide = ref(false);
const dialogSectioin = ref(null);
const handleClick = (event) => {
  if (dialogSectioin.value.contains(event.target)) {
    if (hide.value === false) return;
    hide.value = false;
    titleRefs.value.forEach((v, i) => {
      v.style.borderRadius = "10px 10px 0 0";
      v.style.opacity = "1";
    });
    dialogSet.value.style.marginBottom = "20px";
    //设置向下舒展的动态效果
    hide.value = false;
    dialogSectioin.value.style.backgroundColor = "rgba(225,155,255,1)";
    const id = setInterval(() => {
      dialogSectioin.value.style.height =
        parseFloat(window.getComputedStyle(dialogSectioin.value).height) + 10 + "px";
      // console.log(dialogSectioin.value.style.height);
    }, 1);
    setTimeout(() => {
      dialogSectioin.value.style.height = "calc(100vh - 20px)";
      clearInterval(id);
    }, 100);
  } else if (!user.value.contains(event.target)) {
    showLoginModal.value = false;
    if (hide.value === true) return;
    titleRefs.value.forEach((v, i) => {
      v.style.borderRadius = "10px";
      v.style.opacity = "0.3";
    });
    dialogSet.value.style.marginBottom = "0";

    //设置向上收缩的动态效果
    const id = setInterval(() => {
      dialogSectioin.value.style.height =
        parseFloat(window.getComputedStyle(dialogSectioin.value).height) - 18 + "px";
      // console.log(dialogSectioin.value.style.height);
    }, 1);
    setTimeout(() => {
      dialogSectioin.value.style.height = "auto";
      clearInterval(id);
      dialogSectioin.value.style.backgroundColor = "rgba(255,255,255,0)";
      hide.value = true;
    }, 100);
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

  // fetch("https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json")
  fetch("http://127.0.0.1:8000/property/getData")
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

<style scoped lang="scss">
:global(body) {
  margin: 0;
  overflow: hidden;
}
// .layout {
//   // display: flex;
//   // height: 100vh;
//   box-sizing: border-box;
//   // padding: 10px;
//   // overflow: hidden;
//   overflow: hidden;

.mapStyle {
  // justify-content: center;
  // position: relative;
  // flex: 1;
  width: 50%;

  .setPitch {
    position: absolute;
    z-index: 10000;
    left: 0;
    bottom: 40px;

    .buttonStyle {
      width: 30px;
      height: 30px;
      margin: 5px;
    }
  }
  .setRotation {
    position: absolute;
    z-index: 10000;
    left: 0;
    bottom: 0;

    .buttonStyle {
      width: 30px;
      height: 30px;
      margin: 5px;
    }
  }

  .userStyle {
    position: absolute;
    z-index: 10000;
    left: 0;
    top: 0;
    background-color: aqua;
    height: 30px;
    width: 30px;
    padding: 10px;
    border-radius: 10px;
    margin: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.dialogSectioinStyle {
  background-color: rgba(225, 155, 255, 1);
  border-radius: 10px;
  height: calc(100vh - 20px);
  width: 30%;
  box-sizing: border-box;
  position: absolute;
  padding-top: 0;
  line-height: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;
  position: fixed;
  right: 0;
  z-index: 10000;

  .dialogSetStyle {
    width: 100%;
    display: flex;
    overflow: auto;
    margin-bottom: 70px;
    scroll-behavior: smooth;

    .dialogStyle {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex-shrink: 0;
      align-items: center;

      .titleStyle {
        background-color: rgb(250, 142, 130);
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 10px 10px 0 0;
      }
      .contentStyle {
        background-color: rgb(240, 223, 220);
        width: 100%;
        pointer-events: none;
        padding: 10px;
        box-sizing: border-box;
        border-radius: 0 0 10px 10px;
      }
      .saveButtonStyle {
        background-color: cyan;
        border-radius: 10px;
        padding: 5px 10px;
        margin: 10px auto;
        width: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .saveButtonStyle:hover {
        cursor: pointer;
      }
    }
  }

  .inputStyle {
    position: absolute;
    background-color: greenyellow;
    bottom: 0;
    left: 0;
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    width: calc(100% - 20px);
    box-sizing: border-box;
    max-height: 300px;
    min-height: 60px;
    max-width: calc(100% - 20px);
    min-width: 90%;
  }
}

::-webkit-scrollbar {
  display: none;
}

// }
</style>
