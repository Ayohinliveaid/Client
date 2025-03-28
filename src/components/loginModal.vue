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
      <a-button key="submit" type="primary" :loading="loading" @click="login">
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
        name="phoneNumber"
        :rules="[{ required: true, message: 'Please input your pn!' }]"
      >
        <a-input v-model:value="form.phoneNumber" />
      </a-form-item>
      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your pw!' }]"
      >
        <a-input v-model:value="form.password" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, ref } from "vue";
import { USER_LOGIN } from "../apis/user";
const emit = defineEmits(["update:showLoginModal"]);
const props = defineProps(["showLoginModal"]);
const signup = ref(false);

const form = ref({
  phoneNumber: "",
  password: "",
});
const login = () => {
  // console.log(form.value);
  console.log(import.meta.env.VITE_API_BASE_URL);

  USER_LOGIN(form.value)
    .then((res) => {
      console.log(res);
      if (res.request.status == 200) {
        alert(res.data.message);
        emit("update:showLoginModal", false);
      } else {
        alert("登录失败");
      }
    })
    .catch((err) => {
      // console.log(err.response.data.error);
      alert(err.response.data.error);
      // const errorMessage = err.response?.data?.message || "网络错误，请重试";
      // alert(errorMessage);
    });
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
