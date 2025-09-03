import type { App, Plugin } from 'vue'

import { WF_COMPONENT_NAME } from '~/consts'
import Waterfall from '~/waterfall.vue'

export type WaterfallComponent = typeof Waterfall

export const WaterfallPlugin: Plugin = {
  install: (app: App) => {
    app.component(WF_COMPONENT_NAME, Waterfall)
  },
}

declare module 'vue' {
  export interface GlobalComponents {
    Waterfall: WaterfallComponent
  }
}

export * from '~/consts'

export default Waterfall
