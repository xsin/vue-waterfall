<script setup lang="ts" generic="T">
import type {
  Column,
  NonEmptyArray,
  WaterfallEmits,
} from '@xsin/vue-waterfall-core'
import type { Ref, VNode } from 'vue'
import {
  useWaterfall,
  WF_EVENTS_SCROLL_LOAD,
} from '@xsin/vue-waterfall-core'
import { nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue'

import { WF_CLASS_COLUMN, WF_CLASS_ITEM, WF_CLASS_ROOT } from '~/consts'

export type KeyMapper<T> = (
  item: T,
  column: number,
  row: number,
  index: number,
) => string | number | symbol | undefined

const props = withDefaults(
  defineProps<{
    columnWidth?: number | NonEmptyArray<number> | undefined
    items: T[]
    gap?: number | undefined
    rtl?: boolean | undefined
    ssrColumns?: number | undefined
    scrollContainer?: HTMLElement | null | undefined
    minColumns?: number | undefined
    maxColumns?: number | undefined
    keyMapper?: KeyMapper<T> | undefined
    // 新增：滚动加载相关配置
    scrollLoadThreshold?: number | undefined
    scrollLoadDisabled?: boolean | undefined
    scrollLoadDebounce?: number | undefined
  }>(),
  {
    columnWidth: 400,
    gap: 0,
    minColumns: 1,
    rtl: false,
    scrollContainer: null,
    ssrColumns: 0,
    scrollLoadThreshold: 100,
    scrollLoadDisabled: false,
    scrollLoadDebounce: 200,
  },
)

const emit = defineEmits<WaterfallEmits>()

defineSlots<{
  default?: (props: {
    item: T
    column: number
    columnCount: number
    row: number
    index: number
  }) => VNode | VNode[] | Element | Element[]
  scrollLoader?: (props: {
    isLoading: boolean
    hasMore: boolean
    error?: string | undefined
  }) => VNode | VNode[] | Element | Element[]
}>()

const columns = ref<Column[]>([])
const dom = ref<HTMLDivElement>() as Ref<HTMLDivElement>

// 滚动加载状态
const hasMore = ref(true)
const error = ref<string>()

// 滚动加载回调函数
function handleScrollLoad() {
  if (props.scrollLoadDisabled) {
    return
  }

  emit(WF_EVENTS_SCROLL_LOAD)
}

const { getColumnWidthTarget, isLoading } = useWaterfall<T>({
  columns,
  emit,
  nextTick,
  onBeforeUnmount,
  onMounted,
  vue: 3,
  dom,
  watch,
  onScrollLoad: handleScrollLoad,
  ...toRefs(props),
})

// 暴露方法给父组件
defineExpose({
  setHasMore: (value: boolean) => {
    hasMore.value = value
  },
  setError: (value: string) => {
    error.value = value
  },
  triggerScrollLoad: handleScrollLoad,
})
</script>

<template>
  <div
    ref="dom"
    :class="[WF_CLASS_ROOT]"
    :style="{ display: 'flex', gap: `${gap}px` }"
  >
    <div
      v-for="(column, columnIndex) in columns"
      :key="columnIndex"
      :class="[WF_CLASS_COLUMN]"
      :data-index="columnIndex"
      :style="{
        'display': 'flex',
        'flex-basis': `${getColumnWidthTarget(columnIndex)}px`,
        'flex-direction': 'column',
        'flex-grow': 1,
        'gap': `${gap}px`,
        'height': [
          '-webkit-max-content',
          '-moz-max-content',
          'max-content',
        ] as any,
        'min-width': 0,
      }"
    >
      <div
        v-for="(itemIndex, row) in column"
        :key="
          keyMapper?.(items[itemIndex]!, columnIndex, row, itemIndex)
            ?? itemIndex
        "
        :class="[WF_CLASS_ITEM]"
      >
        <slot
          :item="items[itemIndex]!"
          :column="columnIndex"
          :column-count="columns.length"
          :row="row"
          :index="itemIndex"
        >
          {{ items[itemIndex] }}
        </slot>
      </div>
    </div>

    <!-- 滚动加载提示插槽 -->
    <slot
      name="scrollLoader"
      :is-loading="isLoading"
      :has-more="hasMore"
      :error="error || undefined"
    >
      <!-- 默认的加载提示 -->
      <div v-if="isLoading" class="waterfall-scroll-loader loading">
        <div class="waterfall-scroll-loader-spinner" />
        <span>加载中...</span>
      </div>
      <div v-else-if="!hasMore" class="waterfall-scroll-loader no-more">
        <span>没有更多数据了</span>
      </div>
      <div v-else-if="error" class="waterfall-scroll-loader error">
        <span>{{ error }}</span>
      </div>
    </slot>
  </div>
</template>
