<template>
  <div class="dialogBarStyle" ref="dialogBar">
    <!-- <div class="dialogSetStyle" @wheel="handleScroll" ref="dialogSet">
      <div class="dialogStyle" v-for="i in 3">
        <div class="outputTextStyle titleStyle" ref="title"></div>
      </div>
    </div> -->

    <a-collapse v-model:activeKey="activeKeyComputed">
      <a-collapse-panel key="3">
        <template #header>
          <!-- 使用header插槽插入下拉组件 -->
          <a-dropdown :open="dropdownVisible" @openChange="handleOpenChange">
            <span class="ant-dropdown-link">
              {{ title }}
              <DownOutlined />
            </span>
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item v-for="(v, i) in menuItems" :key="v.key">{{
                  v.label
                }}</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <div class="contentStyle">{{ answer }}</div>
        <div>
          <div class="saveButtonStyle" v-if="answer" @click="saveChat">保存这个回答</div>

          <textarea
            id="inputBox"
            ref="inputBox"
            v-model="question"
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
import axios from 'axios'
const state = reactive({
  answer:
    "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight获取对输入框的引用，把他的高度设置为滚动高度即可",
  title: "haha",
  inputBox: null,
  dialogSet: null,
  question: "",
  dropDownHeader: "hahah",
});
const props = defineProps({ activeKey: Array });
const emit = defineEmits(["update:activeKey"]); // 声明事件用于 v-model 绑定
//结构赋值每一个基本类型变量
const {
  answer,
  inputBox,
  title,
  dialogSet,
  question,
  activeKey,
  dropDownHeader,
} = toRefs(state);

const menuItems = ref([
  { key: "1", label: "标题一" },
  { key: "2", label: "标题二" },
  { key: "3", label: "标题三" },
]);

const items = [
  { question: "问题1", answer: "回答1" },
  { question: "问题2", answer: "回答2" },
  { question: "问题3", answer: "回答3" },
];

//控制展开，计算属性用于双向绑定
const activeKeyComputed = computed({
  get: () => props.activeKey,
  set: (value) => emit("update:activeKey", value),
});

//菜单点击事件，改变标题
const handleMenuClick = ({ key }) => {
  const theMenuItem = menuItems.value.find((v) => v.key === key); // 确保返回布尔值
  title.value = theMenuItem.label;
};

//提交方法
const submit = () => {
  title.value[title.value.length - 1].innerText = question.value;
  alert(question.value);
  // title.value[title.value.length - 1].innerText = "hahah";

  props.question = "";
  setTimeout(() => {
    //浏览器计算高度有延迟，需要异步执行该函数
    adjustHeight();
  }, 50);
  //滚动到最右侧的
  const width = parseFloat(window.getComputedStyle(dialogSet.value).width);
  dialogSet.value.scrollLeft += title.value.length * width;
};

// 动态调整textarea高度
const adjustHeight = () => {
  // // 重置高度，保证在清空输入内容后，高度自动恢复
  inputBox.value.style.height = "auto";
  // 根据内容设置高度
  inputBox.value.style.height = `${inputBox.value.scrollHeight}px`;
};

//保存当前对话
const saveChat= ()=>{
  const chat={
    question:"hhh",
    answer:"ooo",
    data:"{thekey:thevalue}"
  }
  axios.post('http://127.0.0.1:8000/chat/savePermanently',{chat:chat}).then((response)=>{
    const data= response.data;
    if(data.message){alert(data.message)}else{
      alert(data.err)
    }
  })


}
</script>

<style scoped lang="less" src="/src/styles/components/dialogBar.less"></style>
