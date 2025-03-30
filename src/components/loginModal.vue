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
      <a-button
        v-if="!loginState"
        key="submit"
        type="primary"
        :loading="loading"
        @click="login"
      >
        登录
      </a-button>
      <a-button v-if="loginState" type="primary" :loading="loading" @click="logout">
        退出登录
      </a-button>
    </template>
    <div v-if="!loginState">
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
    </div>
    <div v-if="loginState">{{ form.phoneNumber }}</div>
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed } from "vue";
import { USER_LOGIN } from "../apis/user";
const emit = defineEmits(["update:showLoginModal"]);
const props = defineProps(["showLoginModal"]);
const signup = ref(false);
// const loginState = computed(() => {
//   return sessionStorage.getItem("estimaLoginState");
// });
const loginState = ref(sessionStorage.getItem("estimaLoginState"));

const form = ref({
  phoneNumber: "19106537806",
  password: "A000000",
});
const login = () => {
  // console.log(form.value);
  console.log(import.meta.env.VITE_API_BASE_URL);

  USER_LOGIN(form.value)
    .then((res) => {
      console.log(res);
      if (res.request.status == 200) {
        // alert(res.data.message);
        const token = res.data.token;
        // alert(token);
        //手动写入cookie
        const expires = new Date();
        expires.setDate(expires.getDate() + 1); // 7天后过期
        document.cookie = `estima_token=${token}; expires=${expires.toUTCString()}; path=/;`;
        sessionStorage.setItem("estimaLoginState", "1");
        emit("update:showLoginModal", false);
        location.reload();
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

const logout = () => {
  document.cookie = "estima_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  sessionStorage.removeItem("estimaLoginState");
  emit("update:showLoginModal", false);
  location.reload();
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
