<template>
  <div class="chatBarStyle" ref="chatBar">
    <!-- <div class="chatSetStyle" @wheel="handleScroll" ref="chatSet">
      <div class="chatStyle" v-for="i in 3">
        <div class="outputTextStyle titleStyle" ref="title"></div>
      </div>
    </div> -->

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
              <a-menu @click="handleMenuClick">
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
        <div>
          <div v-if="theChat.saved === 0" class="saveButtonStyle" @click="saveChat">
            <span>保存这个回答</span>
          </div>
          <div
            v-if="theChat.saved === 1"
            class="saveButtonStyle"
            style="background-color: aquamarine"
          >
            <span>已保存</span>
          </div>

          <textarea
            id="inputBox"
            ref="inputBox"
            v-model="theChat.question"
            placeholder="给Estima发送消息"
            placeholder-class="textarea-placeholder"
            @input="adjustHeight"
            class="inputStyle"
            @keyup.enter.prevent="submit"
            @keydown.enter.prevent
          />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, computed, watch } from "vue";
import {
  CHAT_GETRESPONSE,
  CHAT_GETCHATHISTORY,
  CHAT_SAVETHECHAT,
  CHAT_UPDATECHATHISTORY,
} from "../apis/chat";
import { PREDICTION_BESTFITTINGMODELPREDICT } from "../apis/prediction";

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
  chatHistory: [],
  theChat: {
    id: "",
    question: "新问题",
    answer:
      "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可",
    data: [],
  },
  newChat: {
    id: "new",
    question: "新问题",
    answer: "正在思考",
    saved: 0,
    data: [],
  },
});
const props = defineProps({ activeKey: Array, deletedChat: Object });
const emit = defineEmits(["update:activeKey", "changeTheChat", "saveTheChat"]); // 声明事件用于 v-model 绑定
const loginState = sessionStorage.getItem("estimaLoginState");
//结构赋值每一个基本类型变量
const {
  inputBox,
  title,
  chatSet,

  activeKey,
  dropDownHeader,
  menuItems,
  chatHistory,
  theChat,
} = toRefs(state);

//控制展开，计算属性用于双向绑定
const activeKeyComputed = computed({
  get: () => props.activeKey,
  set: (value) => emit("update:activeKey", value),
});

//菜单点击事件
const handleMenuClick = ({ key }) => {
  emit("update:activeKey", ["3"]);

  if (key === "new") {
    state.theChat = JSON.parse(JSON.stringify(state.newChat));
    theChat;
  } else {
    // state.theChat = state.chatHistory.find((v) => v.id === key);// theChat改变会导致chatHistroy改变
    state.theChat = JSON.parse(
      JSON.stringify(state.chatHistory.find((v) => v.id === key))
    );
    emit("changeTheChat", state.theChat.data);
  }
};
//请求分段数据
const fetchStream = async (api, body) => {
  try {
    const response = await fetch(api, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // 发送请求体
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // 保存未完成的行

      for (const line of lines) {
        if (line.trim()) {
          try {
            const json = JSON.parse(line);
            console.log(json);
            state.theChat.answer = json.answer; // 更新响应式数据
            if (json.step == 4) {
              state.theChat.data = json.data;
              emit("changeTheChat", state.theChat.data);

              console.log("step4", json.data);
            }
          } catch (err) {
            console.error("JSON解析失败:", err);
          }
        }
      }
    }
  } catch (err) {
    console.error("请求失败:", err);
  }
};
//提交方法
const submit = async () => {
  try {
    state.theChat.answer = "正在思考";

    // //请求后端接口，获取答案和数据
    const question = { question: state.theChat.question };

    //分段请求getresponse
    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    await fetchStream(VITE_API_BASE_URL + "/chat/getResponse", question);

    //存储到chatHistory列表
    await CHAT_UPDATECHATHISTORY({ chat: state.theChat });
    //请求chatHistory列表，更新前端为最新状态，当前对话的id更新为数据库中id
    getChatHistroy();
    // updataTheChat();
    state.theChat.id = state.chatHistory[9].id;
    console.log("theChat", state.theChat);
  } catch (err) {
    alert(err.message);
  }
};

// 动态调整textarea高度
const adjustHeight = () => {
  // // 重置高度，保证在清空输入内容后，高度自动恢复
  inputBox.value.style.height = "auto";
  // 根据内容设置高度
  inputBox.value.style.height = `${inputBox.value.scrollHeight}px`;
};

//保存当前对话
const saveChat = () => {
  const chat = state.chatHistory.find((v) => v.id === state.theChat.id);
  console.log(
    "保存对话输出的对话历史，",
    state.chatHistory,
    "当前theChat的id",
    state.theChat.id
  );
  CHAT_SAVETHECHAT({ chat: chat })
    .then((response) => {
      const data = response.data;
      if (data.message) {
        alert(data.message);
        state.theChat.saved = 1;
        emit("saveTheChat", state.theChat);
      } else {
        alert(data.err);
      }
    })
    .catch((err) => {});
};

//将当前对话的数据根据线性预测进行更新
const bestFittingModelPredict = () => {
  let n = [];
  for (let i = -30; i <= 30; i++) {
    n.push(i);
  }
  // axios
  //   // .post("http://127.0.0.1:8000/prediction/bestFittingModelPredict", {
  //   .post("http://127.0.0.1:8000/prediction/ARIMAPredict", {
  //     // .post("http://127.0.0.1:8000/prediction/optimizedARIMAPredict", {
  //     //需要n为数量
  //     // .post("http://127.0.0.1:8000/prediction/BPNetworkPredict", {
  //     // .post("http://127.0.0.1:8000/prediction/SVMRegressionPredict", {

  //     data: state.theChat.data,
  //     // n: [12, 13, 14, 15, 16, 17, 18, 19, 20],
  //     // n: [-1, -2, -3, -4, 0, 1, 2, 3, 4, 5],
  //     // n: n,
  //     n: 5,
  //     // degree: 3,
  //   })
  PREDICTION_BESTFITTINGMODELPREDICT({ data: state.theChat.data, n: [1, 2, 3] })
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

//请求对话历史赋值给chatHistory，并更新菜单项menuItems
const getChatHistroy = () => {
  CHAT_GETCHATHISTORY()
    .then((response) => {
      state.chatHistory = response.data.chats;
      state.menuItems = state.chatHistory.map((chat) => {
        return {
          key: chat.id,
          label: chat.question,
        };
      });
      state.menuItems.push({ key: "new", label: "新的问题" });
      console.log("emitted data", state.theChat.data);
      // emit("changeTheChat", state.theChat.data);
    })
    .catch((err) => {});
};

const updataTheChat = () => {
  //请求列表和选中当前theChat分开控制，需要调用当前方法执行
  state.theChat = JSON.parse(JSON.stringify(state.chatHistory[9]));
  emit("changeTheChat", state.theChat.data);
};

onMounted(() => {
  if (loginState) {
    getChatHistroy();
  }
  watch(
    () => props.deletedChat,
    (newData, oldData) => {
      getChatHistroy();
      // updataTheChat();
    }
  );
});
</script>

<style scoped lang="less" src="/src/styles/components/chatBar.less"></style>

// for (let i = -10; i <= 10; i++) { // state.theChat.data.push({ // x: i, // y:
-Math.pow(i, 3) - 3 * Math.pow(i, 2) + i - 4, // }); // }
