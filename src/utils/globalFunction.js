export default {

  /**
     * 函数防抖
     * 触发事件后在n秒后执行，如果n秒内又触发事件，则重新计算时间
     */
  debounce(fn, wait = 1000) {
    let timer
    return function() {
      const context = this
      const args = arguments
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(context, args)
      }, wait)
    }
  },

  /**
     * 函数节流
     * 触发事件立即执行，但在n秒内连续触发则不执行
     */
  throttle(fn, wait = 1000) {
    let timer
    return function() {
      if (timer != null) return
      const context = this
      const args = arguments
      fn.apply(context, args)
      timer = setTimeout(() => {
        timer = null
      }, wait)
    }
  }
}
