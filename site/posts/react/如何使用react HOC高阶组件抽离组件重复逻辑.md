---
createTime: 2021-05-17 15:21:41
tags:
  - 笔记
coverImg: https://cdn.jsdelivr.net/gh/yue1123/yue1123@1.1.1/images/gradients_3.png
---

## 什么是高阶组件

高阶组件（HOC）是 React 中用于**复用组件逻辑**的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

具体而言，**高阶组件是参数为组件，返回值为新组件的函数。**

上面两句话,是 react 文档中描述的高阶组件概念,不是很通俗易懂。如果你从来没有接触过高阶组件,你可能读完了会很懵逼。

这都不重要，让我们通过一个例子来认识高阶组件

## 使用高阶组件来实现组件逻辑抽离

假如我们现在有一个需求，多个组件都需要用到`window.innerWidth`和`window.innerHeight`两个属性,并且需要随屏幕大小变化而改变

> 注: 我这里用到是函数组件和 hooks 写法,不熟悉的朋友可以先移步学习下 hooks

不用 HOC 的情况,我们的代码可能是这样的:

```js
// 组件A
const ComA = () => {
  const [size, setSize] = useState({
    w: 0,
    h: 0
  })
  // 响应窗口大小处理函数
  const handleResize = () => {
    let w = window.innerWidth,
      h = window.innerHeight
    setSize({
      w,
      h
    })
  }
  useEffect(() => {
    // 初始化数据
    handleResize()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    // 组件销毁时,清除监听
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div>
        w:{size.w}
        h:{size.h}
      </div>
    </>
  )
}
```

同样的逻辑,组件 B 也需要

```js
// 组件B
const ComB = () => {
  const [size, setSize] = useState({
    w: 0,
    h: 0
  })
  // 响应窗口大小处理函数
  const handleResize = () => {
    let w = window.innerWidth,
      h = window.innerHeight
    setSize({
      w,
      h
    })
  }
  useEffect(() => {
    // 初始化数据
    handleResize()
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
    // 组件销毁时,清除监听
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return (
    <>
      <div>
        w:{size.w}
        h:{size.h}
      </div>
    </>
  )
}
```

显然,这样的代码过于耦合,不是一份合格的代码。所以我们现在利用**HOC**,来抽离组件重复逻辑代码

```js
// HOC高阶组件
// 自己本身是一个组件
function withSize(Component) {
  // 返回的也是一个组件
  return () => {
    // --------复用的逻辑---------
    const [size, setSize] = useState({
      w: 0,
      h: 0
    })
    const handleResize = () => {
      let w = window.innerWidth,
        h = window.innerHeight
      setSize({
        w,
        h
      })
    }
    useEffect(() => {
      handleResize()
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }, [])
    // ------------------------
    // 视图内容，显示的的是高阶组件调用时，传递的组件，size数据通过组件props来传递
    return <Component {...size} />
  }
}
```

高阶组件的使用：

```js
const SizeCom1 = ({ w, h }) => {
  return (
    <div>
      <p>w:{w}</p>
      <p>h:{h}</p>
    </div>
  )
}
const SizeCom2 = ({ w, h }) => {
  return (
    <div>
      <p>w:{w}</p>
      <p>h:{h}</p>
    </div>
  )
}
const ComA = withSize(SizeCom1)
const ComB = withSize(SizeCom2)

function App() {
  return (
    <>
      <ComA />
      <ComB />
    </>
  )
}
```

![image1619884742252.png](/image1619884742252.png)
