<template>
  <div
    ref="chatBar"
    :class="activeState ? 'chatBarStyle activeStyle' : 'chatBarStyle inactiveStyle'"
  >
    <a-collapse v-model:activeKey="activeKeyComputed">
      <a-collapse-panel key="3">
        <template #header>
          <!-- 使用header插槽插入下拉组件 -->
          <a-dropdown>
            <div class="ant-dropdown-link menuText">
              {{ theChat.question }}
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
        <div class="contentStyle">
          {{ theChat.answer }}
        </div>
        <div
          class="saveButtonStyle"
          style="background-color: azure"
          @click="optimizedPolynomialRegressionPredict"
        >
          <span>预测数据</span>
        </div>
        <div class="saveButtonStyle" @click="deleteChat">
          <span>删除这个问答</span>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs, computed, watch } from "vue";
import {
  PREDICTION_POLYNOMIALREGRESSIONPREDICT,
  PREDICTION_OPTIMIZEDPOLYNOMIALREGRESSIONPREDICT,
  PREDICTION_ARIMAPREDICT,
  PREDICTION_OPTIMIZEDARIMAPREDICT,
  PREDICTION_BPNETWORKPREDICT,
  PREDICTION_SVMREGRESSIOINPREDICT,
  PREDICTION_OPTIMIZEDSVMREGRESSIOINPREDICT,
  PREDICTION_OPTIMIZEDPREDICT,
} from "../apis/prediction";
import { CHAT_GETSAVEDCHATS, CHAT_DELETETHECHAT } from "../apis/chat";
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
    question: "请登录",
    answer: "请登录",
  },
  newChat: {
    id: "new",
    question: "新问题",
    answer: "正在思考",
    saved: 0,
  },
  activeState: false,
});
const props = defineProps({ activeKey: Array, savedChat: Object });
const emit = defineEmits([
  "update:activeKey",
  "changeTheChat",
  "appendTheChat",
  "deleteTheChat",
]); // 声明事件用于 v-model 绑定
const loginState = sessionStorage.getItem("estimaLoginState");
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
  activeState,
} = toRefs(state);

//控制展开，计算属性用于双向绑定
const activeKeyComputed = computed({
  get: () => props.activeKey,
  set: (value) => {
    emit("update:activeKey", value);
    // getSavedChats();
  },
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
  state.theChat = JSON.parse(JSON.stringify(state.savedChats.find((v) => v.id === key)));
  activateTheChatBar(state.theChat.data);
};

//请求对话历史赋值给savedChats，并更新菜单项menuItems
const getSavedChats = async () => {
  try {
    const response = await CHAT_GETSAVEDCHATS(); // 等待请求完成
    state.savedChats = response.data.chats;
    state.menuItems = state.savedChats.map((chat) => ({
      key: chat.id,
      label: chat.question,
    }));
    updateTheChat();
    console.log("getSavedChats：state.savedChats", state.savedChats);
  } catch (err) {
    console.error("获取对话历史失败", err);
  }
};

const updateTheChat = () => {
  state.theChat = JSON.parse(
    JSON.stringify(state.savedChats[state.savedChats.length - 1])
  );
  activateTheChatBar(state.theChat.data);
};

onMounted(async () => {
  if (loginState) {
    //登录状态才会自动请求接口
    await getSavedChats(); //如果getSavedChats内部用then则无效
  }

  watch(
    () => props.savedChat,
    (newData, oldData) => {
      getSavedChats();
    }
  );
});

//删除当前对话
const deleteChat = () => {
  const chat = state.theChat;
  CHAT_DELETETHECHAT({ chat: chat })
    .then((response) => {
      const data = response.data;
      if (data.message) {
        alert(data.message);
        emit("deleteTheChat", chat);
        console.log("deleteTheChat", JSON.stringify(chat));
        getSavedChats();
      } else {
        alert(data.err);
      }
    })
    .catch((err) => {});
};

// 获取 cookie
const getCookie = (name) => {
  let value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};

//将当前对话的数据根据线性预测进行更新
const optimizedPolynomialRegressionPredict = () => {
  let n = [];
  for (let i = -30; i <= 30; i++) {
    n.push(i);
  }
  // PREDICTION_POLYNOMIALREGRESSIONPREDICT
  // PREDICTION_OPTIMIZEDPOLYNOMIALREGRESSIONPREDICT
  // PREDICTION_BPNETWORKPREDICT
  // PREDICTION_OPTIMIZEDARIMAPREDICT
  // PREDICTION_SVMREGRESSIOINPREDICT
  // PREDICTION_OPTIMIZEDSVMREGRESSIOINPREDICT

  PREDICTION_OPTIMIZEDPREDICT({
    data: state.theChat.data,
  })
    .then((response) => {
      const result = response.data;
      if (result) {
        // state.theChat.data = data;
        const dataAndPredictedData = {
          data: state.theChat.data,
          predictedData: result.data,
        };
        console.log("menuBar中dataAndPredictedData", dataAndPredictedData);
        state.theChat.answer = result.answer;
        emit("appendTheChat", dataAndPredictedData); //传输原数据和预测数据，最终到达图表组件
      } else {
        alert(response);
      }
    })
    .catch((err) => {
      alert(err.message);
    });
  // 获取 "estimaToken" cookie
  // console.log("token", JSON.stringify(document.cookie)); // 打印 token
};
</script>

<style scoped lang="less" src="/src/styles/components/menuBar.less"></style>
