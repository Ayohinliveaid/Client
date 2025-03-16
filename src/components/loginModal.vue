<template>
  <a-modal
    v-model:open="props.showLoginModal"
    title="Basic Modal"
    :closable="false"
    @ok="onOK"
    @cancel="onCancel"
    class="windowStyle"
  >
    <template #footer>
      <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
        Submit
      </a-button>
    </template>
    <!-- <form action="" class="formStyle">
      <label>phone number</label>
      <input type="text" placeholder="Enter your phone number" v-model="form.pn" />
      <label>varification code</label>
      <input type="text" placeholder="Enter varification code" v-model="form.pw" />
      <label>password</label>
      <input type="text" placeholder="Enter your password" />
      <button type="button" style="grid-column-start: span 2" v-on:click="login">
        登录
      </button>
    </form> -->
    <a-form
      :model="form"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Phone Number"
        name="pn"
        :rules="[{ required: true, message: 'Please input your pn!' }]"
      >
        <a-input v-model:value="form.pn" />
      </a-form-item>
      <a-form-item
        label="Password"
        name="pw"
        :rules="[{ required: true, message: 'Please input your pw!' }]"
      >
        <a-input v-model:value="form.pw" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
const emit = defineEmits(["update:showLoginModal"]);
const props = defineProps(["showLoginModal"]);
const signup = ref(false);

const form = ref({
  pn: "",
  pw: "",
});
const login = () => {
  console.log(form.value);
};

//取消按钮和遮罩层的点击
const onCancel = () => {
  emit("update:showLoginModal", false);
};
const onOK = () => {
  console.log(form.value.pn);
  emit("update:showLoginModal", false);
};
</script>

<style scoped lang="less" src="/src/styles/components/loginModal.less"></style>
