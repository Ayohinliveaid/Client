<template>
  <div id="map" class="mapStyle">
    <div class="setPitch">
      <a-button
        class="buttonStyle"
        @mousedown="modifyAttribute('pitch', '+1')"
        @mouseup="stopModifing"
      >
        +
      </a-button>
      <a-button
        class="buttonStyle"
        @mousedown="modifyAttribute('pitch', '-1')"
        @mouseup="stopModifing"
      >
        -
      </a-button>
    </div>
    <div class="setRotation">
      <a-button
        class="buttonStyle"
        @mousedown="modifyAttribute('rotation', '+1')"
        @mouseup="stopModifing"
      >
        +
      </a-button>
      <a-button
        class="buttonStyle"
        @mousedown="modifyAttribute('rotation', '-1')"
        @mouseup="stopModifing"
      >
        -
      </a-button>
    </div>
    haha
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, watch } from "vue";
import axios from "axios";
import { Mapbox, GaodeMap } from "@antv/l7-maps";
import {
  Scene,
  PolygonLayer,
  LineLayer,
  PointLayer,
  Marker,
  HeatmapLayer,
} from "@antv/l7";

const state = reactive({
  data: [],
  pitch: 30,
  rotation: 0,
  scene: null,
  modificationTimmer: null,
});
const { data, pitch, rotation, modificationTimmer } = toRefs(state);
const props = defineProps({ data: Array });
let scene = null;
// 点图层气泡图;
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

  // scene.on("loaded", () => {
  //   axios
  //     // .get("https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json")
  //     .post("http://127.0.0.1:8000/property/getData")
  //     .then((response) => {
  //       const data = response.data;
  //     });
  // });

  // scene.on("loaded", () => {
  //   axios
  //     .get(
  //       "https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json"
  //     )
  //     .then((response) => {
  //       const data = response.data; // data is already parsed as JSONƒ
  //     });
  // });

  watch(
    () => props.data,
    (newData, oldData) => {
      if (!Array.isArray(newData)) {
        chart.changeData([]);
      } else {
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

        console.log("收到新数据", newData);

        const pointLayer = new PointLayer({})
          .source(newData, {
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
      }
    }
  );
});

//改变倾斜度和旋转度，长按有效
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
</script>

<style scoped lang="less" src="/src/styles/components/mapL7.less"></style>
