<template>
  <div class="chatBarStyle" ref="chatBar">
    <a-collapse v-model:activeKey="activeKeyComputed">
      <a-collapse-panel key="3">
        <template #header>
          <!-- 使用header插槽插入下拉组件 -->
          <a-dropdown :open="dropdownVisible" @openChange="handleOpenChange">
            <div class="ant-dropdown-link menuText">
              {{ theChat.question }}
              <DownOutlined />
            </div>
            <template #overlay>
              <a-menu @click="handleMenuClick" class="menuStyle">
                <a-menu-item v-for="v in menuItems" :key="v.key">
                  <div class="menuText">
                    {{ v.label }}
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <div class="contentStyle">{{ theChat.answer }}</div>
        <div
          class="saveButtonStyle"
          style="background-color: azure"
          @click="bestFittingModelPredict"
        >
          <span>预测数据</span>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, computed } from "vue";
import axios from "axios";
const state = reactive({
  title: "haha",
  inputBox: null,
  chatSet: null,

  dropDownHeader: "hahah",
  menuItems: [
    { key: "1", label: "标题一" },
    { key: "4", label: "新问题" },
  ],
  savedChats: [],
  theChat: {
    id: "",
    question: "新问题",
    answer:
      "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可",
  },
  newChat: {
    id: "new",
    question: "新问题",
    answer: "正在思考",
    saved: 0,
  },
});
const props = defineProps({ activeKey: Array });
const emit = defineEmits(["update:activeKey", "changeTheChat"]); // 声明事件用于 v-model 绑定
//结构赋值每一个基本类型变量
const {
  inputBox,
  title,
  chatSet,

  activeKey,
  dropDownHeader,
  menuItems,
  savedChats,
  theChat,
} = toRefs(state);

//控制展开，计算属性用于双向绑定
const activeKeyComputed = computed({
  get: () => props.activeKey,
  set: (value) => {
    emit("update:activeKey", value);
    getsavedChats();
  },
});

//菜单点击事件
const handleMenuClick = ({ key }) => {
  emit("update:activeKey", ["3"]);

  state.theChat = JSON.parse(JSON.stringify(state.savedChats.find((v) => v.id === key)));
  emit("changeTheChat", state.theChat.data);
};

//请求对话历史赋值给savedChats，并更新菜单项menuItems
const getsavedChats = () => {
  axios
    .post("http://127.0.0.1:8000/chat/getsavedChats")
    .then((response) => {
      state.savedChats = response.data.chats;
      state.menuItems = state.savedChats.map((chat) => {
        return {
          key: chat.id,
          label: chat.question,
        };
      });
      state.theChat = JSON.parse(
        JSON.stringify(state.savedChats[state.savedChats.length - 1])
      );
    })
    .catch((err) => {});
};

onMounted(() => {
  getsavedChats();
});

//将当前对话的数据根据线性预测进行更新
const bestFittingModelPredict = () => {
  let n = [];
  for (let i = -30; i <= 30; i++) {
    n.push(i);
  }
  axios
    // .post("http://127.0.0.1:8000/prediction/polynomialRegressionPredict", {
    // .post("http://127.0.0.1:8000/prediction/bestFittingModelPredict", {
    // .post("http://127.0.0.1:8000/prediction/ARIMAPredict", {
    // .post("http://127.0.0.1:8000/prediction/optimizedARIMAPredict", {
    //需要n为数量
    .post("http://127.0.0.1:8000/prediction/BPNetworkPredict", {
      // .post("http://127.0.0.1:8000/prediction/SVMRegressionPredict", {
      data: state.theChat.data,
      // n: [12, 13, 14, 15, 16, 17, 18, 19, 20],
      n: [-1, -2, -3, -4, 0, 1, 2, 3, 4, 5],
      // n: n,
      // n: 5,
      // degree: 3,
    })
    .then((response) => {
      const data = response.data;
      if (data) {
        // state.theChat.data = data;
        console.log("预测数据", JSON.stringify(data));
        emit("changeTheChat", data);
      } else {
        alert(data.err);
      }
    })
    .catch((err) => {});
};
</script>

<style scoped lang="less" src="/src/styles/components/menuBar.less"></style>
