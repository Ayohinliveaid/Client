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
  chatHistory: [],
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

//提交方法
const submit = async () => {
  try {
    state.theChat.answer = "正在思考";

    //请求后端接口，获取答案和数据
    //获取参数
    const data = state.theChat.question;
    // alert(state.theChat.question)

    state.theChat.answer = "得到的答案得到的答案得到的答案得到的答案得到的答案得到的答案";

    // const response = await axios.post("http://127.0.0.1:8000/property/getData");
    state.theChat.data = [
      { j: -95.692878, t: 1795, w: 29.048486 },
      { j: -95.621654, t: 2050, w: 29.159313 },
      { j: -95.832777, t: 1750, w: 29.385545 },
      { j: -95.822279, t: 1600, w: 29.529074 },
      { j: -95.638787, t: 1800, w: 29.150857 },
      { j: -95.68719, t: 1000, w: 29.047557 },
      { j: -95.9466908, t: 1875, w: 29.46569 },
      { j: -95.731908, t: 2100, w: 29.532459 },
      { j: -95.882095, t: 2500, w: 29.428891 },
      { j: -95.836821, t: 1550, w: 29.393597 },
      { j: -95.675125, t: 1400, w: 29.357355 },
      { j: -95.642059, t: 1350, w: 29.126698 },
      { j: -95.803286, t: 1765, w: 29.510028 },
      { j: -95.818829, t: 1850, w: 29.524324 },
      { j: -95.64636, t: 1500, w: 29.149027 },
      { j: -95.748512, t: 1127, w: 29.538614 },
      { j: -95.736517, t: 1550, w: 29.288497 },
      { j: -95.729097, t: 2750, w: 29.525523 },
      { j: -95.7055, t: 999, w: 29.038051 },
      { j: -95.780724, t: 1995, w: 29.517914 },
      { j: -95.705915, t: 1299, w: 29.038099 },
      { j: -95.646687, t: 1200, w: 29.136685 },
      { j: -95.936158, t: 1450, w: 29.260828 },
      { j: -95.849982, t: 1980, w: 29.514634 },
      { j: -95.735963, t: 2025, w: 29.526858 },
      { j: -95.725102, t: 2450, w: 29.527717 },
      { j: -95.680156, t: 1575, w: 29.08076 },
    ];
    // alert(JSON.stringify(state.theChat.data));

    //存储到chatHistory列表
    await axios.post("http://127.0.0.1:8000/chat/updateChatHistory", {
      chat: state.theChat,
    });
    //请求chatHistory列表，更新前端为最新状态
    getChatHistroy();
  } catch (err) {
    console.log(err.message);
  }

  emit("changeTheChat", state.theChat.data);
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
  const chat = state.chatHistory.find((v) => (v.id = state.theChat.id));
  axios
    .post("http://127.0.0.1:8000/chat/saveTheChat", { chat: chat })
    .then((response) => {
      const data = response.data;
      if (data.message) {
        alert(data.message);
        state.theChat.saved = 1;
      } else {
        alert(data.err);
      }
    })
    .catch((err) => {});
};

//请求对话历史赋值给chatHistory，并更新菜单项menuItems
const getChatHistroy = () => {
  axios
    .post("http://127.0.0.1:8000/chat/getChatHistroy")
    .then((response) => {
      state.chatHistory = response.data.chats;
      state.menuItems = state.chatHistory.map((chat) => {
        return {
          key: chat.id,
          label: chat.question,
        };
      });
      state.menuItems.push({ key: "new", label: "新的问题" });
    })
    .catch((err) => {});
};

onMounted(() => {
  getChatHistroy();
});
</script>

<style scoped lang="less" src="/src/styles/components/chatBar.less"></style>
