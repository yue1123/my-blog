---
createTime: 2022-10-16 22:38:24
tags:
  - 随笔
---

## 何种场景需要这样的判断

我们知道，vue 响应式数据在触发 set 时，他会做一次新旧值的浅比较。也就是说两个对象，即使里面的属性值相同，内存地址变了，vue 也会调用 watch 回调，这在封装组件或实现某些功能时是没有必要的

举例：

比如说现在我们有个组件`Map`:

```html
<template>{{ props.center }}</template>

<script setup lang="ts">
  import { defineProps } from 'vue'

  export interface Props {
    center: {
      lat: number
      lng: number
    }
  }
  const props = defineProps<Props>()

  watch(() => props.center, setCenter, { deep: true })

  function setCenter() {
    console.log('set center')
  }
</script>
```

用户使用的时候是通过字面量传进来的 `center` 值：

```html
<map :center="{lat: 123, lng: 123}" />
```

这事就会出现问题了：由于`center`是字面量声明，每一次**视图更新**或者**hmr 开发热更新**，`center`都是新创建的内存地址不同，但是属性值相同的一个对象，对于 `watch`监听来说，是没有必要执行回调的，这时我们就需要对新旧值做一次深层比较，从而来判断是否需要执行回调

**注意：**

vue3 中 `watch` 如果监听的是一个对象或数组，vue 不会在内部保存旧值。对象发生改变时，回调函数参数新值与旧值将会是一样的，因为对象/数组的内存地址没有发生改变。

所以我们需要在代码中加上如果新值与旧值相等也执行回调的情况

> [vue3 watch 文档](https://cn.vuejs.org/api/reactivity-core.html#watch)
>
> 当使用 getter 函数作为源时，回调只在此函数的返回值变化时才会触发。如果你想让回调在深层级变更时也能触发，你需要使用 `{ deep: true }` 强制侦听器进入深层级模式。在深层级模式时，如果回调函数由于深层级的变更而被触发，那么新值和旧值将是同一个对象。

## 上代码

一个组件可能有大量的 watch 需要判断, 我们利用函数柯里化对该功能进行封装，不仅可以降低代码重复还可以减少代码耦合

> 不了解柯里化的小伙伴可以先看看我以前的文章： [函数柯里化](https://u1talk.com/dh/post/d30503ece0ef41f59e2e9624500c6e12)或者[JavaScript Info 对函数柯里化的讲解](https://zh.javascript.info/currying-partials)

```ts
/**
 * watch 回调辅助前置判断
 * @param cal watch 处理函数
 * @returns (nv: T, ov: T) => void
 */
export function callWhenDifferentValue<T>(cal: (v: T, ov: T) => void): (nv: T, ov: T) => void {
  return (nv: T, ov: T) => {
    if (nv === ov || (nv !== ov && JSON.stringify(nv) !== JSON.stringify(ov))) cal(nv)
  }
}
```

使用：

```ts
watch(() => props.center, callWhenDifferentValue(setCenter), { deep: true })
```

这样，只有在 `center` 深度比较不一样的时候，才会执行 `setCenter`

## 最后

这个问题是我在开源[vue3-baidu-map-gl](https://github.com/yue1123/vue3-baidu-map-gl)组件库开发过程中遇到的问题，在这里和小伙伴分享一下。推荐一下，这个组件库一个基于百度地图 GL 版 API 封装的 Vue3 组件库，项目上有需求的的小伙伴可以试试，也欢迎 star 提 pr 和 issue。
