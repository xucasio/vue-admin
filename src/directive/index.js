import Vue from 'vue'
Vue.directive('resize', {
    bind(el, binding) {
        let width = ''; let height = ''; function get() {
            const style = document.defaultView.getComputedStyle(el); if (width !== style.width || height !== style.height) {
                binding.value({ width, height })
            }
            width = style.width
            height = style.height
        }

        el.__vueReize__ = setInterval(get, 200)
    },
    unbind(el) {
        clearInterval(el.__vueReize__)
    }
})

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
    bind(el, binding, vnode) {
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ''
        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function() {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr]
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr]
            }
        })()
        dialogHeaderEl.onmousedown = (e) => {
            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.pageX - dialogHeaderEl.offsetLeft
            const disY = e.pageY - dialogHeaderEl.offsetTop
            const dragDomWidth = dragDom.offsetWidth
            const dragDomHeight = dragDom.offsetHeight
            const screenWidth = document.body.clientWidth
            const screenHeight = document.body.clientHeight
            const minDragDomLeft = dragDom.offsetLeft
            const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
            const minDragDomTop = dragDom.offsetTop
            const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

            // 获取到的值带px 正则匹配替换
            let styL = getStyle(dragDom, 'left')
            let styT = getStyle(dragDom, 'top')

            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
            } else {
                styL = +styL.replace(/\px/g, '')
                styT = +styT.replace(/\px/g, '')
            }
            document.onmousemove = function(e) {
                // 通过事件委托，计算移动的距离
                let left = e.pageX - disX
                let top = e.pageY - disY
                // 边界处理
                if (-(left) > minDragDomLeft) {
                    left = -minDragDomLeft
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }
                if (-(top) > minDragDomTop) {
                    top = -minDragDomTop
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop
                }
                // 移动当前元素
                dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
                // emit onDrag event
                vnode.child.$emit('dragDialog')
            }
            document.onmouseup = function(e) {
                document.onmousemove = null
                document.onmouseup = null
            }
        }
    }
})
// 只能输入数字
Vue.directive('numberOnly', {
    bind(el) {
        const element = el.getElementsByTagName('input')[0]
        element.handler = function() {
            element.value = element.value.replace(/[^\d]/g, '')
        }
        element.addEventListener('input', element.handler)
    },
    update: function(el) {
        const element = el.getElementsByTagName('input')[0]
        element.handler = function() {
            // element.value = element.value.replace(/[^\d]/g, '')
            element.value = element.value.replace(/[^\d]/g, '')
        }
        element.addEventListener('input', element.handler)
    },
    unbind(el) {
        const element = el.getElementsByTagName('input')[0]
        element.removeEventListener('input', element.handler)
    }
})
// 限制特定特殊字符和中文输入
Vue.directive('namedStr', {
    bind(el) {
        const element = el.getElementsByTagName('input')[0]
        element.handler = function() {
            element.value = element.value.replace(/[^0-9A-z_-]/g, '')
        }
        element.addEventListener('input', element.handler)
    },
    update: function(el) {
        const element = el.getElementsByTagName('input')[0]
        element.handler = function() {
            element.value = element.value.replace(/[^0-9A-z_-]/g, '')
        }
        element.addEventListener('input', element.handler)
    },
    unbind(el) {
        const element = el.getElementsByTagName('input')[0]
        element.removeEventListener('input', element.handler)
    }
})

// title提示框
Vue.directive('tip', {
    inserted: function(el, binding) {
        const oTip = document.createElement('div')
        const body = document.getElementsByTagName('body')[0]
        oTip.innerHTML = `<div>${binding.value}</div>`
        oTip.className = 'v-tooltip__content'
        oTip.id = 'tooltipId' + Math.random().toString().slice(3, 8)
        el.style.position = 'relative'
        el.setAttribute('tipid', oTip.id)
        body.appendChild(oTip)
        const getXY = (pageX, pageY) => {
            let x, y
            if ((pageX + 20) > document.body.offsetWidth) {
                x = pageX - 20
            } else {
                x = pageX + 20
            }
            if ((pageY + 20) > document.body.offsetHeight) {
                y = pageY - 20
            } else {
                y = pageY + 20
            }
            return { x, y }
        }
        el.onmousemove = function(ev) {
            const of = getXY(ev.pageX, ev.pageY)
            if (oTip.children[0].innerHTML) {
                oTip.style.cssText = 'left: ' + of.x + 'px; top: ' + of.y + 'px;'
                oTip.style.opacity = 1
            } else {
                oTip.style.opacity = 0
            }
        }
        el.onmouseout = function() {
            oTip.style.opacity = 0
        }
    },
    componentUpdated: function(el, binding) {
        const tipid = el.getAttribute('tipid')
        const dom = document.getElementById(tipid)
        if (tipid) {
            if (binding.value !== '') {
                dom.children[0].innerHTML = binding.value
            } else {
                dom.children[0].innerHTML = binding.value
            }
        }
    },
    unbind: function(el, binding, vnode) {
        const tipid = el.getAttribute('tipid')
        const dom = document.getElementById(tipid)
        dom.remove()
    }
})
