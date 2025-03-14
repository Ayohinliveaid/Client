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

<style scoped lang="less" src="/src/styles/components/loginModal.less"></style>
