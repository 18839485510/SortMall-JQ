;
(function($) {
    var cache = {
        data: {},
        addData: function(key, value) {
            this.data[key] = value
        },
        getData: function(key) {
            return this.data[key]
        }
    }

    function Search($elem, options) {
        this.$elem = $elem
        this.$searchBtn = $('.search-btn')
        this.$searchInput = $('.search-input')
        this.$searchLayer = $('.search-layer')
        this.isAutocomplete = options.isAutocomplete
        this.searchTimer = null
        this.jqXHR = null
        this.url = options.url
        this.isSearchLayerEmpty = true
        this.init()
        if (this.isAutocomplete) {
            this.autocomplete()
        }
    }
    Search.prototype = {
        constructor: Search,
        init: function() {
            this.$searchBtn.on('click', $.proxy(this.submitSearch, this))
        },
        submitSearch: function() {
            var keyword = this.$searchInput.val()
            window.location.href = './list.html?keyword=' + keyword
        },
        autocomplete: function() {
            var _this = this
                //自动提示
            this.$searchInput
                .on('input', function() {
                    if (this.searchTimer) {
                        clearTimeout(this.searchTimer)
                    }
                    this.searchTimer = setTimeout(function() {
                        this.getSearchData()
                    }.bind(this), 300)
                }.bind(this))
                //获取焦点时显示搜索提示框
                .on('focus', function() {
                    if (!this.isSearchLayerEmpty) {
                        this.$searchLayer.show()
                    }
                }.bind(this))
                .on('click', function(ev) {
                    ev.stopPropagation()
                })
                //点击页面其他地方隐藏searchLayer
            document.addEventListener('click', function() {
                    this.$searchLayer.hide()
                }.bind(this), false)
                //点击searchLayer提交搜索
            this.$searchLayer.on('click', '.search-item', function() {
                var val = $(this).text()
                _this.$searchInput.val(val)
                _this.submitSearch()
            })

        },
        getSearchData: function() {
            var _this = this
            var keyword = this.$searchInput.val()
            if (!keyword) {
                this.appendSearchLayerHTML('')
                return
            }
            if (cache.getData(keyword)) {
                _this.renderSearchLayer(cache.getData(keyword))
            } else {
                if (this.jqXHR) {
                    this.jqXHR.abort()
                }
                this.jqXHR = utils.ajax({
                    url: this.url,
                    data: {
                        keyword: keyword
                    },
                    success: function(data) {
                        if (data.code == 0) {
                            cache.addData(keyword, data.data)
                            _this.renderSearchLayer(data.data)
                        } else {
                            _this.appendSearchLayerHTML('')
                        }
                    },
                    error: function(status) {
                        _this.appendSearchLayerHTML('')
                    }
                })
                console.log(this.jqXHR)
            }

        },
        renderSearchLayer: function(list) {
            var len = list.length
            var html = ''
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    html += '<li class="search-item">' + list[i].name + '</li>'
                }

            }
            this.appendSearchLayerHTML(html)
        },
        appendSearchLayerHTML: function(html) {
            if (html) {
                this.$searchLayer.show()
                this.$searchLayer.html(html)
                this.isSearchLayerEmpty = false
            } else {
                this.$searchLayer.hide()
                this.$searchLayer.html(html)
                this.isSearchLayerEmpty = true
            }
        },
    }
    $.fn.extend({
        search: function(options) {
            var DEFAULTS = {
                searchBtnSelector: '.search-btn',
                searchInputSelector: '.search-input',
                searchLayerSelector: '.search-layer',
                isAutocomplete: false,
                url: '/products/search',
            }
            options = $.extend({}, DEFAULTS, options)
            this.each(function() {
                var $elem = $(this)
                var search = $elem.data('search')
                if (!search) {
                    search = new Search($elem, options)
                    $elem.data('search', search)
                }
            })
        }
    })
})(jQuery)