<template>
  <a-modal
    v-model:open="props.showLoginModal"
    :closable="false"
    @ok="onOK"
    @cancel="onCancel"
    class="windowStyle"
  >
    <a-tabs v-model:activeKey="activeKey" type="card" v-if="!loginState">
      <a-tab-pane key="1" tab="登录">
        <div class="flexBox">
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
              label="Username"
              name="phoneNumber"
              :rules="[{ required: true, message: 'Please input your user name!' }]"
            >
              <a-input v-model:value="form.phoneNumber" />
            </a-form-item>
            <a-form-item
              label="Password"
              name="password"
              :rules="[{ required: true, message: 'Please input your password!' }]"
            >
              <a-input v-model:value="form.password" />
            </a-form-item>
          </a-form>
          <a-button
            v-if="!loginState"
            class="buttonStyle"
            key="submit"
            type="primary"
            :loading="loading"
            @click="login"
          >
            登录
          </a-button>
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" tab="注册">
        <div class="flexBox">
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
              label="Username"
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
            <a-form-item
              label="ConfirmedPassword"
              name="confirmedPassword"
              :rules="[
                { required: true, message: '' },
                { validator: validateConfirmPassword },
              ]"
            >
              <a-input v-model:value="form.confirmedPassword" />
            </a-form-item>
          </a-form>
          <a-button
            v-if="!loginState"
            class="buttonStyle"
            type="primary"
            :loading="loading"
            @click="signup"
          >
            注册
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>

    <template #footer>
      <a-button v-if="loginState" type="primary" :loading="loading" @click="logout">
        退出登录
      </a-button>
    </template>
    <div v-if="!loginState"></div>
    <div v-if="loginState">{{ userInfo.phoneNumber }}</div>
  </a-modal>
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from "vue";
import { USER_LOGIN, USER_SIGNUP, USER_GETUSERINFO } from "../apis/user";
const emit = defineEmits(["update:showLoginModal"]);
const props = defineProps(["showLoginModal"]);
// const loginState = computed(() => {
//   return sessionStorage.getItem("estimaLoginState");
// });
let loginState = null;
const loading = ref(false);

const form = ref({
  phoneNumber: "19106537806",
  password: "A000000",
  confirmedPassword: "A000000",
});
const userInfo = ref({});

const activeKey = ref("1");

//以上是属性，以下是方法

const validateConfirmPassword = (_rule, value) => {
  if (!value) {
    return Promise.reject("Please confirm your password!");
  } else if (value !== form.value.password) {
    return Promise.reject("Passwords do not match!");
  } else {
    return Promise.resolve();
  }
};

const signup = () => {
  USER_SIGNUP(form.value)
    .then((res) => {
      if (res.request.status == 200) {
        // alert(res.data.message);
        alert(res.data.message);
        location.reload();
      } else if (res.request.status == 409) {
        alert(res.data.message);
      } else {
        alert("注册失败");
      }
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status == 400) {
        alert("服务器繁忙：" + err.message);
      } else {
        alert(err.response.data.message);
      }

      // console.log(err);
      // const errorMessage = err.response?.data?.message || "网络错误，请重试";
      // alert(errorMessage);
    });
};
const login = () => {
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
        alert(res.data.message);
        location.reload();
      } else {
        alert("登录失败");
      }
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status == 400) {
          alert(err.response.data.message);
        } else {
          alert("服务器繁忙：" + err.message);
        }
      } else {
        alert("网络错误");
      }

      console.log(err);
    });
};

const logout = () => {
  document.cookie = "estima_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  sessionStorage.removeItem("estimaLoginState");
  emit("update:showLoginModal", false);
  alert("您已退出登录");
  location.reload();
};

//请求用户信息
const getUserInfo = () => {
  USER_GETUSERINFO()
    .then((res) => {
      console.log(res);
      if (res.request.status == 200) {
        userInfo.value = res.data.userInfo;
      }
    })
    .catch((err) => {
      if (err.response.status == 400) {
        alert("服务器繁忙：" + err.message);
      } else {
        // alert(err.response.data.message);
        if (err.response.data.message == "无效的 Token") {
          logout();
          emit("update:showLoginModal", true);
        }
      }
      console.log(err);
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

onMounted(() => {
  loginState = sessionStorage.getItem("estimaLoginState");
  if (loginState == "1") {
    getUserInfo();
  }
});
</script>

<style scoped lang="less" src="/src/styles/components/loginModal.less"></style>
