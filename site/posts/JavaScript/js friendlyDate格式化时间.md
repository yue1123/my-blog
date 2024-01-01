---
createTime: 2021-05-17 15:23:24
tags:
  - 笔记
---

通常我们时间都是以`YYYY-MM-DD hh:mm`的格式来显示,没什么大问题,但是不太友好.

我们更希望讲时间格式化成多久多久前

**例如:**

现在是`2021.4.25 `要显示`2021.4.22`时间,就可以显示为: `3天前`

**更加精细的时间:**

现在是`2021.4.25 20:00:10 `要显示`2021.4.25 20:00:00`时间,就可以显示为: `10秒前`

**代码:**

小于一个月显示友好时间,反之直接显示某年某月某日

```js
/**
 *
 *
 * @param {Date} timestamp 时间戳
 * @returns
 */
function friendlyDate(timestamp) {
  var formats = {
    year: '%n% 年前',
    month: '%n% 个月前',
    day: '%n% 天前',
    hour: '%n% 小时前',
    minute: '%n% 分钟前',
    second: '%n% 秒前'
  }
  var now = Date.now()
  var seconds = Math.floor((now - timestamp) / 1000)
  var minutes = Math.floor(seconds / 60)
  var hours = Math.floor(minutes / 60)
  var days = Math.floor(hours / 24)
  var months = Math.floor(days / 30)
  var diffType = ''
  var diffValue = 0
  // 超过一个月直接显示日期
  if (months > 0) {
    return `${timestamp.getFullYear()}-${timestamp.getMonth() + 1}-${timestamp.getDate()}`
  } else {
    if (days > 0) {
      diffType = 'day'
      diffValue = days
    } else {
      if (hours > 0) {
        diffType = 'hour'
        diffValue = hours
      } else {
        if (minutes > 0) {
          diffType = 'minute'
          diffValue = minutes
        } else {
          diffType = 'second'
          diffValue = seconds === 0 ? (seconds = 1) : seconds
        }
      }
    }
  }
  return formats[diffType].replace('%n%', diffValue)
}

const date = new Date('2021.3.22') //
```
