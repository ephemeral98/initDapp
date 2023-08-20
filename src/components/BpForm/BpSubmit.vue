<script setup lang="ts">
import mitt from './useMitt';
import { findAttr } from './findAttr';

const props = defineProps<{
  dataSame?: string;
  name: string;
}>();

const emits = defineEmits<{
  (click: 'submit'): MouseEvent;
}>();

const total = ref(0);
const tempCount = reactive<any>({});

const formBtnRef = ref(null);

/**
 * 计算有多少目标
 */
const calcElesLens = () => {
  const target = findAttr(formBtnRef.value, 'form-wrap');
  const eles = target.querySelectorAll('[data-same]');
  console.log('target...', target, eles);
  total.value = eles.length;
};

onMounted(() => {
  mitt.on('bp-same', (e: any) => {
    if (e.data || e.require === false) {
      console.log('temp...', tempCount);
      tempCount[e.name] = true;
    } else {
      tempCount[e.name] = false;
      // temp.value--;
    }
  });

  calcElesLens();
});

onBeforeUnmount(() => {
  mitt.off('bp-same');
});

const handleClick = () => {
  const finishedArr = Object.values(tempCount);
  // console.log('finished...', finished);
  const result = finishedArr.filter((item) => item);
  console.log('result...', finishedArr, result, total.value);
  if (result.length >= total.value) {
    emits('submit');
  } else {
    // console.log('不通过');
    mitt.emit('btn' + 'bp-same', false);
  }
};
</script>

<template>
  <button type="submit" @click="handleClick" ref="formBtnRef">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped></style>
