<script setup lang="ts">
// import FormInp from '@/components/FormComp/FormInp.vue';
// import FormBtn from '@/components/FormComp/FormBtn.vue';
import BpInp from '@cps/BpForm/BpInp.vue';
import BpForm from '@cps/BpForm/index.vue';
import BpSubmit from '@cps/BpForm/BpSubmit.vue';

const emailInp = ref('123');
const validEmail = () => {
  return true;
};

const doSubmit = () => {
  console.log('提交。。');
};
</script>

<template>
  <div class="test-wrap pt-200" form-wrap="test-wrap">
    <div>{{ emailInp }}</div>

    <!-- <FormInp
      dataSame="forgetEmail"
      dataName="email"
      class="mt-14rem"
      v-model:value="emailInp"
      :holder="$t('login.7')"
      require
      no-tag
      :requireMsg="$t('login.8')"
      :rules="[{ valid: () => validEmail(), message: 'invalid email!' }]"
    />

    <FormBtn data-same="forgetEmail" class="login-btn hover-color-btn mx-auto" @click="doSubmit">
      提交
    </FormBtn> -->

    <BpForm>
      <BpInp
        name="email"
        v-model:value="emailInp"
        require
        :rules="[{ valid: () => validEmail(), message: 'invalid email!' }]"
      />
      <BpSubmit name="submit" @submit="doSubmit"> 提交 </BpSubmit>
    </BpForm>
  </div>
</template>

<style lang="scss" scoped></style>
