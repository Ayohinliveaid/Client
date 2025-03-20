<template>
  <div id="container" class="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref,
  reactive,
  toRefs,
  defineProps,
  watch,
  onUnmounted,
  nextTick,
  computed,
} from "vue";
import axios from "axios";
import { Chart } from "@antv/g2";

const state = reactive({
  data: [],
});
const { data } = toRefs(state);

const props = defineProps({ data: Array });
// const chartContainer = ref(null);
let chart = null;

onMounted(() => {
  chart = new Chart({
    container: "container", // 确保容器已挂载
    autoFit: true,
  });

  state.data = [
    // { j: -95.725102, t: 2450, w: 29.527717 },
    // { j: -95.680156, t: 1575, w: 29.08076 },
    // { j: -95.721409, t: 2200, w: 29.53275 },
    // { j: -95.778, t: 1300, w: 29.518963 },
    // { j: -95.750554, t: 2175, w: 29.440447 },
    // { j: -95.798386, t: 1295, w: 29.529758 },
    // { j: -95.77392, t: 2455, w: 29.496613 },
  ];
  chart.interval().data(state.data).encode("x", "w").encode("y", "t");
  chart.render();
  // alert("let chart render成功");
  watch(
    () => props.data,
    (newData, oldData) => {
      if (!Array.isArray(newData)) return;
      chart.changeData(newData);
    }
  );
});

// 组件销毁时，销毁 Chart 实例
onUnmounted(() => {
  if (state.chart) {
    state.chart.destroy();
    state.chart = null;
  }
});
</script>

<style scoped lang="less" src="/src/styles/components/chartG2.less"></style>

//G2图表 // onMounted(() => { // // 准备数据 // // const data = [ // // { genre: "Sports",
sold: 275 }, // // { genre: "Strategy", sold: 115 }, // // { genre: "Action", sold: 120 },
// // { genre: "Shooter", sold: 350 }, // // { genre: "Other", sold: 150 }, // // { genre:
"Sports", sold: 275 }, // // { genre: "Strategy", sold: 115 }, // // { genre: "Action",
sold: 120 }, // // { genre: "Shooter", sold: 350 }, // // { genre: "Other", sold: 150 },
// // ]; // axios // .post("http://localhost:8000/property/getData") // .then((response)
=> { // // 请求成功 // data.value = response.data; // console.log("请求成功：",
response.data); // // 初始化图表实例 // const chart = new Chart({ // container:
"container", // autoFit: true, // }); // // 声明可视化 // chart // .interval() // 创建一个
Interval 标记 // .data(data.value) // 绑定数据 // .encode("x", "w") // 编码 x 通道 //
.encode("y", "t"); // 编码 y 通道 // // .coordinate({ type: "polar" }); // // 渲染可视化
// chart.render(); // }) // .catch((error) => { // // 请求失败 //
console.error("请求失败：", error); // }); // // 声明可视化 // chart // .interval() //
创建一个 Interval 标记 // .data(props.data) // 绑定数据 // .encode("x", "w") // 编码 x
通道 // .encode("y", "t"); // 编码 y 通道 // // .coordinate({ type: "polar" }); // //
渲染可视化 // chart.render(); // }); // state.chart.data(props.data).encode("x",
"w").encode("y", "t"); // state.chart.render(); // watch( // () => props.data, //
(newData, oldData) => { // // console.log("newData", JSON.stringify(newData)); // //
state.chart.changeData(newData); // // state.chart.data(newData).encode("x",
"w").encode("y", "t"); // // state.chart.render(); //
console.log("changeData成功，newData", JSON.stringify(newData)); // } // // { immediate:
true } // );
