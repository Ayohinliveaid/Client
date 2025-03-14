<template>
  <div class="dialogBarStyle" ref="dialogBar">
    <div class="dialogSetStyle" @wheel="handleScroll" ref="dialogSet">
      <div class="dialogStyle" v-for="i in 3">
        <div class="outputTextStyle titleStyle" ref="title">这是提出的问题</div>
        <div v-if="showDialogBar">
          <div class="outputTextStyle contentStyle">{{ outputText }}</div>
          <div class="saveButtonStyle" v-if="outputText" @click="save">保存这个回答</div>
        </div>
      </div>
    </div>

    <textarea
      id="inputBox"
      ref="inputBox"
      v-model="inputText"
      placeholder="给Estima发送消息"
      placeholder-class="textarea-placeholder"
      @input="adjustHeight"
      class="inputStyle"
      @keyup.enter.prevent="submit"
      @keydown.enter.prevent
      v-if="showDialogBar"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, toRefs } from "vue";
const state = reactive({
  outputText:
    "获取对输入框的引用，把他的高度设置为滚动高度即可，但由于一次性删除内容后，scrollheight不会马上恢复到最初值，所以需要在之前加入，height为auto的设置，使的textarea根据内容调整height和scrollheight",
  title: [],
  inputBox: null,
  dialogSet: null,
  inputText: "",
});
const props = defineProps({ showDialogBar: Boolean });
//结构赋值每一个基本类型变量
const { outputText, inputBox, title, dialogSet, inputText } = toRefs(state);

//提交方法
const submit = () => {
  title.value[title.value.length - 1].innerText = inputText.value;
  alert(inputText.value);
  // title.value[title.value.length - 1].innerText = "hahah";

  props.inputText = "";
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
</script>

<style scoped lang="less" src="/src/styles/components/dialogBar.less"></style>
