import { flushPromises, mount } from '@vue/test-utils'
import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import { defineComponent } from 'vue'

import { WF_CLASS_COLUMN, WF_CLASS_ITEM, WF_CLASS_ROOT } from '~/consts'
import Waterfall from '~/index'

let observeMock = vi.fn()
let unobserveMock = vi.fn()

function mockResizeObserver() {
  observeMock = vi.fn()
  unobserveMock = vi.fn()
  const resizeObserverMock = vi.fn().mockImplementation(() => ({
    disconnect: vi.fn(),
    observe: observeMock,
    unobserve: unobserveMock,
  }))
  window.ResizeObserver = window.ResizeObserver || resizeObserverMock
}

const TestComponent = defineComponent({
  template: '<waterfall :items="[1, 2, 3]" />',
})

describe('waterfall', () => {
  beforeAll(() => {
    console.warn = function (message) {
      throw message
    }
  })

  beforeEach(() => {
    mockResizeObserver()
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('can be installed', async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [Waterfall],
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>(`.${WF_CLASS_ROOT}`)
    expect(wall.element).toBeDefined()
    const items = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`)
    expect(items.length).toEqual(3)
  })

  it('creates SSR columns', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
        ssrColumns: 1,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>(`.${WF_CLASS_ROOT}`)
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_COLUMN}`)
    expect(columns.length).toEqual(1)
    const items = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`)
    expect(items.length).toEqual(2)
  })

  it('reacts to item changes', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>(`.${WF_CLASS_ROOT}`)
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_COLUMN}`)
    expect(columns.length).toEqual(1)
    expect(wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`).length).toEqual(2)
    await wrapper
      .setProps({
        items: [1, 2, 3],
      })
      .then(flushPromises)
    expect(wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`).length).toEqual(3)
    await wrapper
      .setProps({
        items: [1],
      })
      .then(flushPromises)
    expect(wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`).length).toEqual(1)
  })

  it('unobserves the ResizeObserver', async () => {
    expect(observeMock.mock.calls.length).toEqual(0)
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(observeMock.mock.calls.length).toEqual(1)
    expect(unobserveMock.mock.calls.length).toEqual(0)
    wrapper.unmount()
    expect(unobserveMock.mock.calls.length).toEqual(1)
  })

  it('reacts to column-width prop changes', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redrawSkip')).toBeUndefined()
    await wrapper
      .setProps({
        items: [1, 2],
        columnWidth: 300,
      })
      .then(flushPromises)
    expect(wrapper.emitted('redraw')?.length).toEqual(2)
    expect(wrapper.emitted('redrawSkip')?.length).toEqual(1)
  })

  it('reacts to gap prop changes', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    expect(wrapper.emitted('redrawSkip')).toBeUndefined()
    await wrapper
      .setProps({
        items: [1, 2],
        gap: 42,
      })
      .then(flushPromises)
    expect(wrapper.emitted('redraw')?.length).toEqual(2)
    expect(wrapper.emitted('redrawSkip')?.length).toEqual(1)
  })

  it('reacts to rtl prop changes', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
      },
    })
    await flushPromises()
    expect(wrapper.emitted('redraw')?.length).toEqual(1)
    await wrapper
      .setProps({
        items: [1, 2],
        rtl: true,
      })
      .then(flushPromises)
    expect(wrapper.emitted('redraw')?.length).toEqual(2)
  })

  it('adds items to the smallest column', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [],
        columnWidth: 100,
        gap: 0,
      },
    })
    await flushPromises()
    const wall = wrapper.find(`.${WF_CLASS_ROOT}`)
    wall.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 300,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    await wrapper
      .setProps({
        items: [1, 2],
      })
      .then(flushPromises)

    const [first, second, third] = wall.findAll(`.${WF_CLASS_COLUMN}`)
    expect(first?.element.childElementCount).toEqual(2)
    expect(second?.element.childElementCount).toEqual(0)
    expect(third?.element.childElementCount).toEqual(0)

    first!.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 500,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    third!.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 200,
      left: 0,
      right: 0,
      top: 0,
      width: 0,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })

    await wrapper
      .setProps({
        items: [1, 2, 3],
      })
      .then(flushPromises)
    const [firstNew, secondNew, thirdNew] = wall.findAll(`.${WF_CLASS_COLUMN}`)
    expect(firstNew?.element.childElementCount).toEqual(0)
    expect(secondNew?.element.childElementCount).toEqual(3)
    expect(thirdNew?.element.childElementCount).toEqual(0)
  })

  it('coerces with regards to minColumns', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
        minColumns: 3,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>(`.${WF_CLASS_ROOT}`)
    expect(wall.element).toBeDefined()
    const columns = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_COLUMN}`)
    expect(columns.length).toEqual(3)
    const items = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`)
    expect(items.length).toEqual(2)
  })

  it('coerces with regards to maxColumns', async () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [1, 2],
        columnWidth: 100,
      },
    })
    await flushPromises()
    const wall = wrapper.find<HTMLDivElement>(`.${WF_CLASS_ROOT}`)
    expect(wall.element).toBeDefined()
    wall.element.getBoundingClientRect = (): DOMRect => ({
      bottom: 0,
      height: 0,
      left: 0,
      right: 0,
      top: 0,
      width: 1000,
      x: 0,
      y: 0,
      toJSON(): string {
        return ''
      },
    })
    await wrapper
      .setProps({
        items: [1, 2],
        maxColumns: 20,
      })
      .then(flushPromises)
    const unconstrainedColumns
      = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_COLUMN}`)
    expect(unconstrainedColumns.length).toEqual(10)

    await wrapper
      .setProps({
        items: [1, 2],
        maxColumns: 1,
      })
      .then(flushPromises)
    const columns = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_COLUMN}`)
    expect(columns.length).toEqual(1)
    const items = wrapper.findAll<HTMLDivElement>(`.${WF_CLASS_ITEM}`)
    expect(items.length).toEqual(2)
  })
})
