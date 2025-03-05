<template>
  <!-- <div class="layout" ref="layout"> -->
    <div id="container"></div>
    <div class="mapStyle" id="map">
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

      <div class="dialogStyle" ref="dialog">
        <div class="outputStyle">
          <div class="outputTextStyle titleStyle" ref="title">这是提出的问题</div>
          <div class="outputTextStyle contentStyle">{{ outputText }}</div>
          <div class="saveButtonStyle" v-if="outputText" @click="save">保存这个回答</div>

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
          />
        </div>
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
const title = ref(null);
const outputText = ref(
  "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight"
);

const submit = () => {
  title.value.innerText = inputText.value;
  inputText.value = "";
  setTimeout(() => {
    //浏览器计算高度有延迟，需要异步执行该函数
    adjustHeight();
  }, 50);
};

//保存回答
const save = () => {};

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
          return [level * 1 + 10, level * 10 + 10];
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

  scene.on("loaded", () => {
    fetch(
      "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const layer = new HeatmapLayer({})
          .source(data)
          .shape("heatmap")
          .size("mag", [0, 0.2]) // weight映射通道
          .style({
            intensity: 2,
            radius: 20,
            rampColors: {
              colors: [
                "#FF4818",
                "#F7B74A",
                "#FFF598",
                "#91EABC",
                "#2EA9A1",
                "#206C7C",
              ].reverse(),
              positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
            },
            zIndex: 0,
          });
        scene.addLayer(layer);
      });
  });
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

// //点图层亮度图
// onMounted(() => {
//   const scene = new Scene({
//     id: "map",
//     map: new GaodeMap({
//       center: [121.417463, 31.215175],
//       style: "light",
//       zoom: 11,
//       pitch: pitch.value,
//       rotation: rotation.value

//     }),
//   });
//   scene.on("loaded", () => {
//     fetch("https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt")
//       .then((res) => res.text())
//       .then((data) => {
//         const pointLayer = new PointLayer({})
//           .source(data, {
//             parser: {
//               type: "csv",
//               y: "lat",
//               x: "lng",
//             },
//           })
//           .size(0.5)
//           .color("#080298");
//         scene.addLayer(pointLayer);
//       });
//   });
// });

// //热力图层
// onMounted(() => {
//   const scene = new Scene({
//     id: "map",
//     map: new GaodeMap({
//       style: "dark",
//       center: [127.5671666579043, 7.445038892195569],
//       zoom: 2.632456779444394,
//     }),
//   });
//   scene.on("loaded", () => {
//     fetch(
//       "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
//     )
//       .then((res) => res.json())
//       .then((data) => {
//         const layer = new HeatmapLayer({})
//           .source(data)
//           .shape("heatmap")
//           .size("mag", [0, 1.0]) // weight映射通道
//           .style({
//             intensity: 2,
//             radius: 20,
//             rampColors: {
//               colors: [
//                 "#FF4818",
//                 "#F7B74A",
//                 "#FFF598",
//                 "#91EABC",
//                 "#2EA9A1",
//                 "#206C7C",
//               ].reverse(),
//               positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
//             },
//           });
//         scene.addLayer(layer);
//       });
//   });
// });

// const input = ref("");
// const inputBox = document.querySelector("#inputBox");
// const textareaHeight = ref("auto");
// const adjustHeight = () => {
//   const textarea = $refs.inputBox;
//   // 重置高度，防止其被其他样式影响
//   textarea.style.height = "auto";
//   // 根据内容设置高度
//   textarea.style.height = `${textarea.scrollHeight}px`;
// };
onMounted(() => {});
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

    .setPitch {
      position: absolute;
      z-index: 10000;
      right: 0;
      bottom: 0;

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
  }

  .dialogStyle {
    background-color: beige;
    width: 30%;
    padding: 10px;
    position:fixed;
    right:0;
    z-index:10000;

    .outputStyle {
      background-color: rgb(213, 213, 88);
      border-radius: 10px;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      padding: 10px;
      padding-top: 0;
      line-height: 30px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .inputStyle {
        position: absolute;
        background-color: greenyellow;
        bottom: 0;
        left: 0;
        margin: 10px;
        padding: 10px;
        border-radius: 10px;
        width: 90%;
        box-sizing: border-box;
        max-height: 300px;
        min-height: 60px;
        max-width: 90%;
        min-width: 90%;
      }

      .saveButtonStyle {
        background-color: cyan;
        border-radius: 10px;
        padding: 5px 10px;
      }
      .saveButtonStyle:hover {
        cursor: pointer;
      }

      .titleStyle {
        background-color: rgb(250, 142, 130);
        width: 100%;
        padding: 10px;
        border-radius: 10px 10px 0 0;
      }
      .contentStyle {
        background-color: rgb(240, 223, 220);
        width: 100%;
        pointer-events: none;
        padding: 10px;
        border-radius: 0 0 10px 10px;
      }
    }
  }
// }
</style>
