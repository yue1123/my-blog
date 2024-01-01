---
createTime: 2023-02-27 22:06:07
---

## 在模版渲染中是如何实现的？

我们现在有这样一段代码：

```html
<div id="app">
  {{ a.b.c }}
  <button @click="handleUpdateName">更新</button>
</div>

<script>
  const vm = new Vue({
    el: '#app',
    data() {
      return {
        a: { b: { c: { d: { e: 1 } } } }
      }
    },
    methods: {
      handleUpdateName() {
        this.a.b.c.d.e = Math.random()
      }
    }
  })
</script>
```

我们尝试点击按钮更新数据，发现视图依旧更新了，在控制台输出 `vm` 看看`renderWatcher`收集了哪些依赖

![image1677503997528.png](https://u1talk.com/api/static/upload/images/image1677503997528.png)

可以看到，他把整个每一个 key 都收集到了依赖中，这是为什么？先说答案，当我们在模版中输出对象时，渲染函数最终会通过`JSON.stringtify` 把对象转换为字符串，这个过程中就会深层触发数据`get`，从而被 `renderWatcher`收集为依赖，这是**向下收集**。**向上收集**就简单了，就是访问`c`的过程中，就得先取到 a 和 b 的值，依赖就被收集了

## watch 中是如何实现的？

当我们在 watch 中监听 `a.b.c`的变化时，需要指定`deep` 才能监听到 e 的变化，`deep`在内部又是怎么实现依赖收集的呢？

![image1677506969943.png](https://u1talk.com/api/static/upload/images/image1677506969943.png)

```html
<div id="app">
  <button @click="handleUpdateName">更新</button>
</div>

<script>
  const vm = new Vue({
    el: '#app',
    data () {
      return {
        a: { b: { c: { d: { e: 1 } } } },
      }
    },
    watch: {
      'a.b.c': {
        handler () {
          console.log('更新')
        }
        deep: true,
      }
    },
    methods: {
      handleUpdateName () {
        this.a.b.c.d.e = Math.random()
      }
    }
  })
</script>
```

我们阅读源码就可以发现，他内部是会把`a.b.c`表达式解析成属性访问函数，然后调用他获取属性值，这个阶段就实现了依赖**向上收集**，如果设置的 `deep`，就将访问函数返回值继续通过一个递归来遍历访问所有的子属性子子属性子子子.....，从而触发 `get`实现依赖**向下收集**。

```js
export default class Watcher {
  constructor(vm: Component, expOrFn: string | Function, cb: Function, options?: ?Object, isRenderWatcher?: boolean) {
    // 解析表达式获得 getter 函数
    //  watch 监听expOrFn是一个字符串,所以会走 else 分支,从而得到 getter 函数
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.value = this.lazy ? undefined : this.get()
  }

  /**
   * 计算 getter, 并重新收集依赖
   */
  get() {
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 调用 getter, 访问指定path的值, 实现依赖向上收集
      value = this.getter.call(vm, vm)
    } catch (e) {
      // ...
    } finally {
      // 如果设置了 deep, 则深层遍历,实现依赖向下收集
      if (this.deep) {
        traverse(value)
      }
      popTarget()
      this.cleanupDeps()
    }
    return value
  }
}
```

向上收集核心代码：

```js
/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath(path: string): any {
  if (bailRE.test(path)) {
    return
  }
  const segments = path.split('.')
  // 通过一个函数触发 vm 实例上属性的 get 方法,从而实现依赖收集
  return function (obj) {
    for (let i = 0; i < segments.length; i++) {
      if (!obj) return
      obj = obj[segments[i]]
    }
    return obj
  }
}
```

向下收集核心代码：

```js
const seenObjects = new Set()

export function traverse(val: any) {
  _traverse(val, seenObjects)
  seenObjects.clear()
}

function _traverse(val: any, seen: SimpleSet) {
  let i, keys
  const isA = Array.isArray(val)
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    const depId = val.__ob__.dep.id
    if (seen.has(depId)) {
      return
    }
    seen.add(depId)
  }
  // val[i] 和 val[keys[i]] 这里就会触发`get`，实现依赖收集
  if (isA) {
    i = val.length
    while (i--) _traverse(val[i], seen)
  } else {
    keys = Object.keys(val)
    i = keys.length
    while (i--) _traverse(val[keys[i]], seen)
  }
}
```
