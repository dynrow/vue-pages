/**
 * @class 回到顶部工具类
 */
class ToTop{
    constructor(el ,option){
        let totop_img = require('@/components/loadmore/mescroll-totop.png');
        this.scrollDom = el;
        this.option = Object.assign({
            offset: 1000,
            duration: 300,
            onScroll: null,
            src: totop_img,
            warpClass: 'mescroll-totop',
            showClass: 'mescroll-fade-in',
            hideClass: 'mescroll-fade-out',
        } ,option || {});
        this.addEvevt();
    }
    addEvevt(){
        let _this = this;
        _this.scrollDom.addEventListener("scroll", function () {
            //列表内容顶部卷去的高度(含列表边框)
            var scrollTop = _this.scrollDom.scrollTop;
            //顶部按钮的显示隐藏
            if (scrollTop >= _this.option.offset) {
                _this.showTopBtn();
            } else {
                _this.hideTopBtn();
            }
            //滑动监听
            _this.option.onScroll && _this.option.onScroll(scrollTop);
        });
    }
    /*--------回到顶部的按钮--------*/
    showTopBtn () {
        if (!this.topBtnShow) {
            this.topBtnShow = true; //标记显示
            var _this = this;
            if (_this.toTopBtn == null) {
                //未加入按钮,则加入
                _this.toTopBtn = document.createElement("img");
                _this.toTopBtn.className = _this.option.warpClass;
                _this.toTopBtn.src = _this.option.src;
                _this.toTopBtn.onclick = function () {
                    _this.scrollTo(0, _this.option.duration); //置顶
                }
                document.body.appendChild(_this.toTopBtn); //加在body上,避免加在me.scrollDom在使用硬件加速样式时会使fixed失效
            }
            //显示--淡入动画
            _this.toTopBtn.classList.remove(_this.option.hideClass);
            _this.toTopBtn.classList.add(_this.option.showClass);
        }
    }
    /*隐藏回到顶部的按钮*/
    hideTopBtn () {
        let _this = this;
        if (_this.topBtnShow && _this.toTopBtn) {
            _this.topBtnShow = false;
            _this.toTopBtn.classList.remove(_this.option.showClass);
            _this.toTopBtn.classList.add(_this.option.hideClass);
        }
    }
    /*滑动列表到指定位置--带缓冲效果 (y=0回到顶部;如果要滚动到底部可以传一个较大的值,比如99999);t时长,单位ms,默认300*/
    scrollTo (y, t) {
        let _this = this;
        t = t || 300; //时长 300ms
        let rate = 20; //周期 20ms
        let count = t / rate; //次数
        let maxY = _this.scrollDom.scrollHeight - _this.scrollDom.clientHeight; //y的最大值
        if (y < 0) y = 0; //不可小于0
        if (y > maxY) y = maxY; //不可超过最大值
        let diff = _this.scrollDom.scrollTop - y; //差值 (可能为负值)
        if (diff == 0) return;
        let step = diff / count; //步长
        _this.isScrollTo = true; //标记在滑动中,阻止列表的触摸事件
        let i = 0; //计数
        let scrollTimer = window.setInterval(function () {
            if (i < count) {
                if (i == count - 1) {
                    _this.scrollDom.scrollTop = y; //最后一次直接设置y,避免计算误差
                } else {
                    _this.scrollDom.scrollTop -= step;
                }
                i++;
            } else {
                _this.isScrollTo = false;
                window.clearInterval(scrollTimer);
            }
        }, rate);
    }
}

export default ToTop;