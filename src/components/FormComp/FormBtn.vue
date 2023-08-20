<script setup lang="ts">
import mitt from './useMitt';
import { findAttr } from './findAttr';

const props = defineProps<{
  dataSame?: string;
}>();

const emits = defineEmits<{
  (click: 'click'): MouseEvent;
}>();

const total = ref(0);
const tempCount = reactive<any>({});

const FormInpRef = ref(null);

/**
 * 计算有多少目标
 */
const calcElesLens = () => {
  const target = findAttr(FormInpRef.value, 'form-wrap');
  const eles = target.querySelectorAll('[data-same]');
  console.log('eless', eles);
  const targetEles = []; // 总DOM数量
  eles.forEach((item) => {
    if (item.getAttribute('data-same') === props.dataSame) {
      targetEles.push(item);
    }
  });
  total.value = targetEles.length;
};

onMounted(() => {
  mitt.on(props.dataSame, (e: any) => {
    if (e.data || e.require === false) {
      tempCount[e.name] = true;
    } else {
      tempCount[e.name] = false;
      // temp.value--;
    }
  });

  calcElesLens();
});

onBeforeUnmount(() => {
  mitt.off(props.dataSame);
});

const handleClick = () => {
  const finishedArr = Object.values(tempCount);
  // console.log('finished...', finished);
  const result = finishedArr.filter((item) => item);
  console.log('result...', finishedArr, result, total.value);

  if (result.length >= total.value) {
    emits('click');
  } else {
    // console.log('不通过');
    mitt.emit('btn' + props.dataSame, false);
  }
};
</script>

<template>
  <button @click="handleClick" ref="FormInpRef">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped></style>
