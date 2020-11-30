var beseUrl = 'http://127.0.0.1:3000'

var utils = {
    ajax: function (options) {
        options.url = beseUrl + options.url
        return $.ajax(options)
    },
    isvisibility: function ($elem) {
        var $win = $(window)
        return $elem.offset().top < $win.scrollTop() + $win.height() && $win.scrollTop() < $elem.offset().top + $elem.height()
    },
    debounce: function (fn, delay) {
        var timer = 0;
        //返回一个函数
        return function () {
            if (timer) {
                //每次事件被触发时,清除之前的旧定时器
                clearTimeout(timer);
            }
            //开启一个新的定时器从新开始等待
            timer = setTimeout(fn, delay)
        }
    },
    loadImage: function (imgSrc, success) {
        var image = new Image()

        image.onload = function () {
            typeof success === 'function' && success()
        }
        image.src = imgSrc
    }
}