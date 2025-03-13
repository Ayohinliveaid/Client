<template>
  <div class="windowStyle" v-if="props.showLoginModal">
    <form action="" class="formStyle">
      <label>phone number</label>
      <input type="text" placeholder="Enter your phone number" v-model="form.pn" />
      <label>varification code</label>
      <input type="text" placeholder="Enter varification code" v-model="form.pw" />
      <label>password</label>
      <input type="text" placeholder="Enter your password" />
      <button type="button" style="grid-column-start: span 2;" v-on:click="login">登录</button>
    </form>
  </div>
</template>

<script setup>
import { defineProps, ref } from "vue";
const props = defineProps({
  showLoginModal: Boolean,
});
const signup = ref(false);

const form =ref({
  pn:'',
  pw:''
})
const login = () => {
  console.log(form.value);
}
</script>

<style scoped>
.windowStyle {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
  box-sizing: border-box;
  background-color: lightblue;
  z-index: 100000;
  padding: 10px;

  .formStyle {
    display: grid;
    grid-template-columns: 20% 75%;
    grid-template-rows: 20% 20% 20% 10%;
    height: 100%;
    gap:5%;
    box-sizing: border-box;
  }
}
</style>
