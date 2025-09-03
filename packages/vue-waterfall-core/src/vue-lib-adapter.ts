export interface VueRef<T> {
  value: T
}

export type VueVersion = 3

export type Watch = (
  refs: (VueRef<unknown> | undefined)[],
  callback: () => void,
) => void

export type LifecycleHook = (callback: () => void) => void

// 新增：滚动加载回调类型
export type ScrollLoadCallback = () => void | Promise<void>
