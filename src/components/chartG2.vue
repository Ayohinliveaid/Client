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
import { message } from "ant-design-vue";

const state = reactive({});
const {} = toRefs(state);

const props = defineProps({ data: Array });
const loginState = sessionStorage.getItem("estimaLoginState");
// const chartContainer = ref(null);
let chart = null;

const updateChart = (data, xField, yField) => {
  chart.clear(); // 清除旧的绘图
  chart
    .point()
    .data(data)
    .encode("x", xField) // 使用动态 X 轴字段
    .encode("y", yField) // 使用动态 Y 轴字段
    .encode("size", 8)
    .scale("x", { type: "linear" })
    .style("fill", "steelblue");

  chart.render();
};

onMounted(() => {
  chart = new Chart({
    container: "container", // 确保容器已挂载
    autoFit: true,
  });
  chart
    .point()
    .data([])
    .encode("x", "x")
    .encode("y", "y")
    .encode("size", 8) // 设置点的大小为固定的 10
    .scale("x", {
      type: "linear", // 使用 band 比例尺，适合离散数据
    })
    .style("fill", "steelblue");

  chart.render();
  watch(
    () => props.data,
    (newData, oldData) => {
      if (!Array.isArray(newData)) {
        chart.changeData([]);
      } else {
        // message.success(`图表组件收到新数据：${JSON.stringify(newData)}`, 1);
        // console.log("received newData:", newData);
        // chart.changeData(newData);
        let keys, x, y;
        for (let v of newData) {
          keys = v ? Object.keys(v) : null;
          x = keys[0];
          y = keys[1];
          if (x && y) {
            break;
          }
        }
        console.log(keys);
        updateChart(newData, x, y);
        chart.changeData(newData); //似乎请求数据后虽然改变了encode，但是图表需要刷新页面才能显示
      }
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
