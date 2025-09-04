import type {
  LifecycleHook,
  ScrollLoadCallback,
  VueRef,
  VueVersion,
  Watch,
} from './vue-lib-adapter'
import { ref } from 'vue'
import { debounce } from './debounce'

export type NonEmptyArray<T> = [T, ...T[]]

export type Column = number[]

export const WF_EVENTS_REDRAW = 'redraw'
export const WF_EVENTS_REDRAW_SKIP = 'redrawSkip'
export const WF_EVENTS_SCROLL_LOAD_START = 'scrollLoadStart'
export const WF_EVENTS_SCROLL_LOAD_END = 'scrollLoadEnd'
export const WIN_EVENTS_SCROLL = 'scroll'
export const WF_EVENTS_SCROLL_LOAD = 'scrollLoad'

export type WF_EVENT_TYPE_REDRAW = typeof WF_EVENTS_REDRAW
export type WF_EVENT_TYPE_REDRAW_SKIP = typeof WF_EVENTS_REDRAW_SKIP
export type WF_EVENT_TYPE_SCROLL_LOAD_START = typeof WF_EVENTS_SCROLL_LOAD_START
export type WF_EVENT_TYPE_SCROLL_LOAD_END = typeof WF_EVENTS_SCROLL_LOAD_END
export type WF_EVENT_TYPE_SCROLL_LOAD = typeof WF_EVENTS_SCROLL_LOAD

export interface WaterfallEmits {
  (event: WF_EVENT_TYPE_REDRAW): void
  (event: WF_EVENT_TYPE_REDRAW_SKIP): void
  (event: WF_EVENT_TYPE_SCROLL_LOAD_START): void
  (event: WF_EVENT_TYPE_SCROLL_LOAD_END, error?: string): void
  (event: WF_EVENT_TYPE_SCROLL_LOAD): void
}

export interface WaterfallHookProps<T> {
  columns: VueRef<Column[]>
  columnWidth: VueRef<number | NonEmptyArray<number>>
  emit: WaterfallEmits
  gap: VueRef<number>
  items: VueRef<T[]>
  maxColumns: VueRef<number | undefined>
  minColumns: VueRef<number | undefined>
  nextTick: () => Promise<void>
  onBeforeUnmount: LifecycleHook
  onMounted: LifecycleHook
  rtl: VueRef<boolean>
  scrollContainer: VueRef<HTMLElement | null>
  ssrColumns: VueRef<number>
  vue?: VueVersion
  dom: VueRef<HTMLDivElement>
  watch: Watch
  // 新增：滚动加载相关属性
  scrollLoadThreshold?: VueRef<number>
  scrollLoadDisabled?: VueRef<boolean>
  scrollLoadDebounce?: VueRef<number>
  onScrollLoad?: ScrollLoadCallback
}

export function useWaterfall<T>({
  columns,
  columnWidth,
  emit,
  gap,
  items,
  maxColumns,
  minColumns,
  nextTick,
  onBeforeUnmount,
  onMounted,
  rtl,
  scrollContainer,
  ssrColumns,
  vue = 3,
  dom,
  watch,
  scrollLoadThreshold,
  scrollLoadDisabled,
  scrollLoadDebounce,
  onScrollLoad,
}: WaterfallHookProps<T>) {
  function countIteratively(
    containerWidth: number,
    gap: number,
    count: number,
    consumed: number,
  ): number {
    const nextWidth = getColumnWidthTarget(count)
    if (consumed + gap + nextWidth <= containerWidth) {
      return countIteratively(
        containerWidth,
        gap,
        count + 1,
        consumed + gap + nextWidth,
      )
    }
    return count
  }

  function getColumnWidthTarget(columnIndex: number): number {
    const widths = Array.isArray(columnWidth.value)
      ? columnWidth.value
      : [columnWidth.value]
    return widths[columnIndex % widths.length] as number
  }

  function columnCount(): number {
    if (!dom.value) {
      return 1
    }

    const count = countIteratively(
      dom.value.getBoundingClientRect().width,
      gap.value,
      0,
      // Needs to be offset my negative gap to prevent gap counts being off by one
      -gap.value,
    )
    const boundedCount = aboveMin(belowMax(count))
    return boundedCount > 0 ? boundedCount : 1
  }

  function belowMax(count: number): number {
    const max = maxColumns?.value
    if (!max) {
      return count
    }
    return count > max ? max : count
  }

  function aboveMin(count: number): number {
    const min = minColumns?.value
    if (!min) {
      return count
    }
    return count < min ? min : count
  }

  if (ssrColumns.value > 0) {
    const newColumns = createColumns(ssrColumns.value)
    items.value.forEach((_: T, i: number) =>
      newColumns[i % ssrColumns.value]!.push(i),
    )
    columns.value = newColumns
  }

  let currentRedrawId = 0

  async function fillColumns(itemIndex: number, assignedRedrawId: number) {
    if (itemIndex >= items.value.length) {
      return
    }
    await nextTick()
    if (currentRedrawId !== assignedRedrawId) {
      // Skip if a new redraw has been requested in parallel,
      // e.g., in an onMounted hook during initial render
      return
    }

    if (!dom.value) {
      return
    }

    const columnDivs = [...dom.value.children] as HTMLDivElement[]
    if (rtl.value) {
      columnDivs.reverse()
    }
    const target = columnDivs.reduce((prev, curr) =>
      curr.getBoundingClientRect().height < prev.getBoundingClientRect().height
        ? curr
        : prev,
    )
    columns.value[+target.dataset.index!]!.push(itemIndex)
    await fillColumns(itemIndex + 1, assignedRedrawId)
  }

  async function redraw(force = false) {
    const newColumnCount = columnCount()
    if (columns.value.length === newColumnCount && !force) {
      if (vue < 2) {
        // We don't support Vue 2 anymore
        return
      }
      emit(WF_EVENTS_REDRAW_SKIP)
      return
    }
    columns.value = createColumns(newColumnCount)
    const scrollTarget = scrollContainer?.value
    const scrollY = scrollTarget ? scrollTarget.scrollTop : window.scrollY
    await fillColumns(0, ++currentRedrawId)
    if (scrollTarget) {
      scrollTarget.scrollBy({ top: scrollY - scrollTarget.scrollTop })
    }
    else {
      window.scrollTo({ top: scrollY })
    }
    emit(WF_EVENTS_REDRAW)
  }

  // 滚动加载相关状态
  const isLoading = ref(false)

  // 滚动加载检测函数
  function checkScrollLoad() {
    if (!onScrollLoad || isLoading.value || scrollLoadDisabled?.value) {
      return
    }

    const container = scrollContainer?.value || window
    const threshold = scrollLoadThreshold?.value || 100

    if (container === window) {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= documentHeight - threshold) {
        triggerScrollLoad()
      }
    }
    else if (container instanceof HTMLElement) {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      const scrollHeight = container.scrollHeight

      if (scrollTop + containerHeight >= scrollHeight - threshold) {
        triggerScrollLoad()
      }
    }
  }

  // 触发滚动加载
  async function triggerScrollLoad() {
    if (!onScrollLoad || isLoading.value || scrollLoadDisabled?.value) {
      return
    }

    isLoading.value = true
    emit(WF_EVENTS_SCROLL_LOAD_START)

    try {
      await onScrollLoad()
      emit(WF_EVENTS_SCROLL_LOAD_END)
    }
    catch (error) {
      console.error('[vue-waterfall-core] Scroll load error:', error)
      emit(WF_EVENTS_SCROLL_LOAD_END, error as string)
    }
    finally {
      isLoading.value = false
    }
  }

  // 防抖的滚动检测
  const debouncedCheckScrollLoad = debounce(
    checkScrollLoad,
    scrollLoadDebounce?.value || 200,
  )

  const resizeObserver
    = typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(debounce(() => redraw()))

  onMounted(() => {
    if (dom.value) {
      redraw()
      resizeObserver?.observe(dom.value)
    }

    // 设置滚动加载检测
    if (onScrollLoad) {
      const container = scrollContainer?.value || window
      container?.addEventListener(WIN_EVENTS_SCROLL, debouncedCheckScrollLoad, { passive: true })
    }
  })

  onBeforeUnmount(() => {
    if (dom.value) {
      resizeObserver?.unobserve(dom.value)
    }

    // 清理滚动加载检测
    if (onScrollLoad) {
      const container = scrollContainer?.value || window
      container?.removeEventListener(WIN_EVENTS_SCROLL, debouncedCheckScrollLoad)
    }
  })

  watch([items, rtl], () => redraw(true))
  watch([columnWidth, gap, minColumns, maxColumns], () => redraw())

  return { getColumnWidthTarget, isLoading }
}

function createColumns(count: number): Column[] {
  return Array.from({ length: count }).map(() => [])
}
