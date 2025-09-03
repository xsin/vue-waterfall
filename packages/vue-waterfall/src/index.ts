import type { App, Plugin } from 'vue'

import { WF_COMPONENT_NAME } from '~/consts'
import component from '~/waterfall.vue'

export type WaterfallComponent = typeof component

type WaterfallPlugin = WaterfallComponent & Plugin

const Waterfall: WaterfallPlugin
  /* #__PURE__ */ = ((): WaterfallPlugin => {
    const installable = component as unknown as WaterfallPlugin

    installable.install = (app: App) => {
      app.component(WF_COMPONENT_NAME, installable)
    }

    return installable
  })()

declare module 'vue' {
  export interface GlobalComponents {
    Waterfall: WaterfallComponent
  }
}

export * from '~/consts'

export default Waterfall
