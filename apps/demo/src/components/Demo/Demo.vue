<script setup lang="ts">
import Waterfall from '@xsin/vue-waterfall'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { generateMockList } from './mock'

// 定义数据类型
interface MockItem {
  id: string
  imgs: string[]
  content: string
  index: number
  timestamp: number
  category: string
  author: string
  likes: number
  views: number
}

const dataSource = ref<MockItem[]>(generateMockList(0, 10))
const loadCount = ref(1)
const maxLoads = 5

const canLoadMore = computed(() => loadCount.value < maxLoads)
const remainingLoads = computed(() => maxLoads - loadCount.value)

function loadDataSource() {
  if (canLoadMore.value) {
    const currentIndex = dataSource.value.length
    dataSource.value = [...dataSource.value, ...generateMockList(currentIndex, 10)]
    loadCount.value++
  }
}

function addManualData() {
  if (canLoadMore.value) {
    const currentIndex = dataSource.value.length
    dataSource.value = [...dataSource.value, ...generateMockList(currentIndex, 10)]
    loadCount.value++
  }
}

function onItemClick() {
  console.warn('onItemClick')
}

function resetData() {
  dataSource.value = generateMockList(0, 10)
  loadCount.value = 1
}

// 监听滚动到底部，自动加载更多
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight >= documentHeight - 100) {
    loadDataSource()
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- 顶部导航栏 -->
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                @xsin/vue-waterfall
              </h1>
              <p class="text-xs text-slate-500">
                Vue 3 Waterfall Layout Component
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <a
              href="https://github.com/xsin/vue-waterfall"
              target="_blank"
              class="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-all duration-200 hover:scale-105 group"
            >
              <svg class="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span class="font-medium">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-6 py-8">
      <!-- 项目介绍卡片 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/50 shadow-xl">
        <div class="text-center mb-8">
          <h2 class="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Vue Waterfall Layout
          </h2>
          <p class="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            一个现代化的 Vue 3 瀑布流布局组件，支持 TypeScript，提供流畅的滚动加载体验和响应式设计。
          </p>
        </div>

        <!-- 特性展示 -->
        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">
              响应式布局
            </h3>
            <p class="text-sm text-slate-600">
              自动适应不同屏幕尺寸，支持多列配置
            </p>
          </div>

          <div class="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
            <div class="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">
              TypeScript 支持
            </h3>
            <p class="text-sm text-slate-600">
              完整的类型定义，提供优秀的开发体验
            </p>
          </div>

          <div class="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <h3 class="font-semibold text-slate-800 mb-2">
              高性能
            </h3>
            <p class="text-sm text-slate-600">
              虚拟滚动优化，流畅的加载体验
            </p>
          </div>
        </div>

        <!-- 安装说明 -->
        <div class="bg-slate-900 rounded-xl p-6 text-center">
          <h3 class="text-white font-semibold mb-3">
            快速开始
          </h3>
          <div class="bg-slate-800 rounded-lg p-4 font-mono text-sm text-green-400">
            <span class="text-slate-400">$</span> pnpm add @xsin/vue-waterfall
          </div>
        </div>
      </div>

      <!-- 瀑布流演示区域 -->
      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-slate-800 mb-2">
            瀑布流演示
          </h3>
          <p class="text-slate-600">
            点击卡片查看交互效果，滚动到底部自动加载更多内容
          </p>
        </div>

        <!-- 控制按钮区域 -->
        <div class="flex flex-wrap items-center justify-center gap-4 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-slate-700">加载次数:</span>
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              {{ loadCount }}/{{ maxLoads }}
            </span>
          </div>

          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-slate-700">剩余次数:</span>
            <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
              {{ remainingLoads }}
            </span>
          </div>

          <div class="flex items-center space-x-3">
            <button
              :disabled="!canLoadMore"
              class="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 hover:scale-105 disabled:hover:scale-100 group"
              @click="addManualData"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">手动添加</span>
            </button>

            <button
              class="flex items-center space-x-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-all duration-200 hover:scale-105 group"
              @click="resetData"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
              </svg>
              <span class="font-medium">重置数据</span>
            </button>
          </div>

          <!-- 状态提示 -->
          <div v-if="!canLoadMore" class="w-full text-center">
            <div class="inline-flex items-center space-x-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="text-sm font-medium">已达到最大加载次数限制</span>
            </div>
          </div>
        </div>

        <!-- 使用最新的 Waterfall 组件 API -->
        <Waterfall
          :items="dataSource"
          :column-width="400"
          :gap="16"
          :min-columns="1"
          :max-columns="6"
          :key-mapper="(item: MockItem) => item.id"
          @redraw="() => console.log('Waterfall redrawn')"
          @redraw-skip="() => console.log('Waterfall redraw skipped')"
        >
          <template #default="{ item, column, columnCount, row, index }">
            <div
              class="group bg-white rounded-xl shadow-soft hover:shadow-glow transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden border border-slate-100 hover:border-blue-200"
              @click="onItemClick"
            >
              <!-- 图片区域 -->
              <div v-if="item.imgs.length" class="relative">
                <div v-if="item.imgs.length > 1" class="grid grid-cols-3 gap-1 p-1">
                  <img
                    v-for="(img, iIndex) in item.imgs.slice(0, 9)"
                    :key="iIndex"
                    class="w-full h-20 object-cover rounded-lg"
                    :src="img"
                    :alt="`Image ${iIndex + 1}`"
                  >
                </div>
                <img
                  v-else
                  :src="item.imgs[0]"
                  class="w-full h-48 object-cover"
                  :alt="`Image ${index + 1}`"
                >

                <!-- 图片数量徽章 -->
                <div v-if="item.imgs.length > 9" class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  +{{ item.imgs.length - 9 }}
                </div>
              </div>

              <!-- 内容区域 -->
              <div class="p-4">
                <!-- 作者和分类信息 -->
                <div class="flex items-center justify-between mb-2 text-xs">
                  <span class="text-slate-500">{{ item.author }}</span>
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">{{ item.category }}</span>
                </div>

                <div class="text-slate-700 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-900 transition-colors duration-200">
                  {{ item.content }}
                </div>

                <!-- 底部信息栏 -->
                <div class="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <div class="flex items-center space-x-2">
                    <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span class="text-xs text-slate-500">Live</span>
                  </div>

                  <div class="flex items-center space-x-2">
                    <div class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                      #{{ item.index + 1 }}
                    </div>
                    <div class="text-xs text-slate-400">
                      Col:{{ column }}/{{ columnCount }} Row:{{ row }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Waterfall>
      </div>
    </div>

    <!-- 底部计数器 -->
    <div class="fixed left-[50%] translate-x-[-50%] bottom-6 bg-white/90 backdrop-blur-md rounded-full shadow-xl px-6 py-3 border border-white/50 z-40">
      <div class="flex items-center space-x-3">
        <div class="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        <span class="text-lg font-semibold text-slate-700">{{ dataSource.length }}</span>
        <span class="text-sm text-slate-500">items loaded</span>
        <div class="w-px h-6 bg-slate-200" />
        <span class="text-sm text-slate-500">{{ loadCount }}/{{ maxLoads }} loads</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 确保图片加载时的平滑过渡 */
img {
  transition: opacity 0.3s ease-in-out;
}

img:not([src]) {
  opacity: 0;
}

img[src] {
  opacity: 1;
}
</style>
