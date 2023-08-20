<script setup lang="ts">
import mitt from './useMitt';

interface IRule {
  valid: () => boolean; // 规则函数
  message: string; // 消息
}
const props = defineProps<{
  name?: string; // 名字
  value: string; // 输入框的值
  type?: 'text' | 'password'; // 类型
  holder?: string;
  noTag?: boolean; // 不做星星标记require
  require?: boolean; // 是否必须填写
  requireMsg?: string; // 自定义空值消息
  rules?: IRule[]; // 规则
  dataSame?: string; // 标记同类
  dataName?: string; // 标记自己(同类中独一无二的)
}>();

const emits = defineEmits<{
  (update: 'update:value', string);
}>();

const handleInp = (e) => {
  if (props.type === 'password' && e.data === ' ') {
    // 密码不能按空格
    e.target.value = props.value;
    return;
  }
  const value = String(e.target.value).trim();
  emits('update:value', value);
};

const cloneRules = ref<any>({});

cloneRules.value = props.rules?.map((item) => {
  return {
    ...item,
    status: true,
  };
});

// 犯规的那一项
const ruleItem = computed(() => {
  return cloneRules.value?.find((item) => !item.status);
});

/**
 * 校验数据
 */
const validData = () => {
  cloneRules.value?.forEach((item) => {
    if (item.valid) {
      item.status = item.valid();
    }
  });
};

const inpRef = ref(null);
const watching = ref(false);
const doWatch = () => {
  watching.value = !watching.value;
  inpRef.value.type = watching.value ? 'text' : 'password';
};

const showEmpty = ref(false);
const doBlur = () => {
  if (props.require && !props.value) {
    showEmpty.value = true;

    mitt.emit(props.dataSame, {
      type: props.dataSame,
      name: props.dataName,
      data: false,
    });
    return;
  }
  showEmpty.value = false;

  validData();
  const pass = cloneRules.value?.every((item) => item?.status) ?? true;
  mitt.emit(props.dataSame, {
    type: props.dataSame,
    name: props.dataName,
    data: pass,
  });
};

onMounted(() => {
  setTimeout(() => {
    // 滞后执行
    mitt.emit(props.dataSame, {
      require: !!props.require,
      type: props.dataSame,
      data: !!props.value,
      name: props.dataName,
    });
  }, 0);

  mitt.on('btn' + props.dataSame, (e: any) => {
    if (props.require && !props.value) {
      showEmpty.value = true;
    }
  });
});

onBeforeUnmount(() => {
  mitt.off('btn' + props.dataSame);
});
</script>

<template>
  <div class="inp-comp-wrap" :data-same="props.dataSame">
    <div class="sign-name" v-if="props.require && !props.noTag">*{{ props.name }}</div>
    <div class="sign-name" v-else-if="props.name">{{ props.name }}</div>
    <div class="mt-14rem relative">
      <input
        ref="inpRef"
        :type="props.type ?? 'text'"
        :placeholder="props.holder ?? ''"
        :class="['inp', { pwd: props.type === 'password' }]"
        :value="props.value"
        @input="handleInp"
        @blur="doBlur"
      />

      <!-- 密码输入框的眼睛 -->
      <template v-if="props.type === 'password'">
        <img
          src="@img/common/icon-eye.svg"
          alt=""
          class="cursor-pointer w-35rem md:w-20rem absolute right-0 top-1/2 transform translate-y-[-50%] translate-x-[-0.2rem] md:translate-x-[-10rem]"
          @click="doWatch"
          v-show="watching"
        />

        <img
          src="@img/common/icon-eye-close.svg"
          alt=""
          class="cursor-pointer w-35rem md:w-2rem absolute right-0 top-1/2 transform translate-y-[-50%] translate-x-[-2rem] md:translate-x-[-10rem]"
          @click="doWatch"
          v-show="!watching"
        />
      </template>
    </div>

    <div class="text-red max-w-6rem" v-show="showEmpty">
      {{ props.requireMsg ?? 'Cannot be empty!' }}
    </div>

    <div class="text-red max-w-6rem" v-show="!showEmpty && ruleItem?.status === false">
      {{ ruleItem?.message }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inp {
  width: 648rem;
  @include -height(80rem, 60rem, 60rem);
  border-radius: 10rem;
  padding: 17rem 14rem;
  background-color: transparent;
  border: 1px solid #efefef;
  @include -font-size(24rem, 16rem, 16rem);

  &::placeholder {
    color: #707070;
  }

  &.pwd {
    padding-right: 8rem;
  }
}

.sign-name {
  @include -font-size(28rem, 24rem, 24rem);
  font-weight: bold;
}
</style>
