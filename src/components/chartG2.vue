<template>
  <div id="container" class="containerStyle">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs } from "vue";
import axios from "axios";
import { Chart } from "@antv/g2";

const state = reactive({
  data: [],
});
const { data } = toRefs(state);

//G2图表
onMounted(() => {
  // 准备数据
  // const data = [
  //   { genre: "Sports", sold: 275 },
  //   { genre: "Strategy", sold: 115 },
  //   { genre: "Action", sold: 120 },
  //   { genre: "Shooter", sold: 350 },
  //   { genre: "Other", sold: 150 },
  //   { genre: "Sports", sold: 275 },
  //   { genre: "Strategy", sold: 115 },
  //   { genre: "Action", sold: 120 },
  //   { genre: "Shooter", sold: 350 },
  //   { genre: "Other", sold: 150 },
  // ];

  axios
    .post("http://localhost:8000/property/getData")
    .then((response) => {
      // 请求成功
      data.value = response.data;
      console.log("请求成功：", response.data);
      // 初始化图表实例
      const chart = new Chart({
        container: "container",
        autoFit: true,
      });

      // 声明可视化
      chart
        .interval() // 创建一个 Interval 标记
        .data(data.value) // 绑定数据
        .encode("x", "w") // 编码 x 通道
        .encode("y", "t"); // 编码 y 通道
      // .coordinate({ type: "polar" });

      // 渲染可视化
      chart.render();
    })
    .catch((error) => {
      // 请求失败
      console.error("请求失败：", error);
    });
});
</script>

<style scoped lang="less" src="/src/styles/components/chartG2.less"></style>
