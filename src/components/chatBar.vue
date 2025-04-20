<template>
  <div
    :class="activeState ? 'chatBarStyle activeStyle' : 'chatBarStyle inactiveStyle'"
    ref="chatBar"
  >
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
        <div class="contentStyle">
          {{ theChat.answer }}
          <div v-if="showDot" class="dot" ref="dotRef"></div>
        </div>
        <div
          class="saveButtonStyle"
          style="background-color: azure"
          @click="optimizedPolynomialRegressionPredict"
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
            v-model="newQuestion"
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
import { onMounted, onUnmounted, ref, reactive, toRefs, computed, watch } from "vue";
import {
  CHAT_GETRESPONSE,
  CHAT_GETCHATHISTORY,
  CHAT_SAVETHECHAT,
  CHAT_UPDATECHATHISTORY,
} from "../apis/chat";
import {
  PREDICTION_OPTIMIZEDPOLYNOMIALREGRESSIONPREDICT,
  PREDICTION_BPNETWORKPREDICT,
  PREDICTION_OPTIMIZEDARIMAPREDICT,
  PREDICTION_OPTIMIZEDPREDICT,
} from "../apis/prediction";
import { getCookie } from "../apis/http";
import { message } from "ant-design-vue";

const state = reactive({
  title: "haha",
  inputBox: null,
  chatSet: null,
  showDot: false,

  dropDownHeader: "hahah",
  menuItems: [
    { key: "1", label: "标题一" },
    { key: "4", label: "新问题" },
  ],
  chatHistory: [],
  theChat: {
    id: "",
    question: "请登录",
    answer: "请登录",
    data: [],
  },
  newChat: {
    id: "new",
    question: "新问题",
    answer: "向Estima提问",
    saved: 0,
    data: [],
    step: 0,
  },
  newQuestion: "",
  activeState: false,
});
const props = defineProps({
  activeKey: Array,
  deletedChat: Object,
});
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
  showDot,
  step,
  newQuestion,
  activeState,
} = toRefs(state);

//控制展开，计算属性用于双向绑定
const activeKeyComputed = computed({
  get: () => props.activeKey,
  set: (value) => emit("update:activeKey", value),
});

//对话框活跃状态
//当前对话框成为活跃框
const activateTheChatBar = (data) => {
  emit("changeTheChat", data);
  state.activeState = true;
};
//触发对话框不活跃状态，defineExpose暴露给父组件
const deactivatedTheChatBar = () => {
  state.activeState = false;
};
// 暴露函数，父组件通过子组件的ref.value.deactivatedTheChatBar调用
defineExpose({
  deactivatedTheChatBar,
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
    activateTheChatBar(state.theChat.data);
  }
};
//请求分段数据
const fetchStream = async (api, body) => {
  try {
    //手动加入token
    const token = getCookie("estima_token");
    const response = await fetch(api, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
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
            state.theChat.answer = json.answer;
            state.step = json.step; //记录当前获取回答的状态
            if (json.step == 4) {
              state.theChat.data = json.data;
              activateTheChatBar(state.theChat.data);

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
//提交提问，获取回答
const submit = async () => {
  try {
    // state.theChat.answer = "正在思考";

    state.theChat = JSON.parse(JSON.stringify(state.newChat));
    activateTheChatBar(state.theChat.data);
    animationFrameId = requestAnimationFrame(animate);
    state.showDot = true;

    // //请求后端接口，获取答案和数据
    const question = { question: state.newQuestion };
    state.theChat.question = state.newQuestion;
    state.newQuestion = "";

    //分段请求getresponse
    const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    await fetchStream(VITE_API_BASE_URL + "/chat/getResponse", question);

    if (state.step == 5 && state.theChat.data && state.theChat.data.length > 0) {
      //表示请求成功
      //存储到chatHistory列表
      await CHAT_UPDATECHATHISTORY({ chat: state.theChat });
      //请求chatHistory列表，更新前端为最新状态，当前对话的id更新为数据库中id
      await getChatHistory();
      // updataTheChat();
      state.theChat.id = state.chatHistory[state.chatHistory.length - 1].id;
      console.log("theChat", state.theChat);
    } else {
    }
    state.showDot = false;
    cancelAnimationFrame(animationFrameId);
  } catch (err) {
    alert(err.message);
    state.showDot = false;
    cancelAnimationFrame(animationFrameId);
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
const optimizedPolynomialRegressionPredict = () => {
  let n = [];
  for (let i = -30; i <= 30; i++) {
    n.push(i);
  }
  // axios
  //   // .post("http://127.0.0.1:8000/prediction/optimizedPolynomialRegressionPredict", {
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
  PREDICTION_OPTIMIZEDPREDICT({ data: state.theChat.data })
    .then((response) => {
      console.log(response);
      const result = response.data;
      if (result) {
        // state.theChat.data = data;
        console.log("预测数据", JSON.stringify(result));
        activateTheChatBar(result.data);
        state.theChat.answer = result.answer;
      } else {
        alert(data.err);
      }
    })
    .catch((err) => {});
};

//请求对话历史赋值给chatHistory，并更新菜单项menuItems
const getChatHistory = async () => {
  try {
    const response = await CHAT_GETCHATHISTORY();
    state.chatHistory = response.data.chats;

    state.menuItems = state.chatHistory.map((chat) => ({
      key: chat.id,
      label: chat.question,
    }));

    state.menuItems.push({ key: "new", label: "新的问题" });
    console.log("emitted data", state.theChat.data);
    // activateTheChatBar(state.theChat.data);
  } catch (err) {
    console.error("获取聊天历史失败:", err);
    // 可选的错误处理，如显示用户提示
    // state.error = "加载历史记录失败，请重试";
  }
};
const updataTheChat = () => {
  //请求列表和选中当前theChat分开控制，需要调用当前方法执行
  state.theChat = JSON.parse(
    JSON.stringify(state.chatHistory[state.chatHistory.length - 1])
  );
  activateTheChatBar(state.theChat.data);
};

onMounted(() => {
  state.theChat = state.newChat;
  if (loginState) {
    getChatHistory();
  }
  watch(
    () => props.deletedChat,
    (newData, oldData) => {
      getChatHistory();
      // updataTheChat();
    }
  );
});

//小球跳动的函数----------------------------------------------------------------------------------------------------
const dotRef = ref(null);
let startTime = null;
let animationFrameId = null;
const animate = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const elapsed = (timestamp - startTime) / 1000; // 计算秒数

  if (dotRef.value) {
    const scale = 1 + Math.sin(elapsed * Math.PI * 2) * 0.3; // 让小球变大变小（范围 0.7 ~ 1.3）
    dotRef.value.style.transform = `scale(${scale})`;
  }

  animationFrameId = requestAnimationFrame(animate);
};
</script>

<style scoped lang="less" src="/src/styles/components/chatBar.less"></style>
