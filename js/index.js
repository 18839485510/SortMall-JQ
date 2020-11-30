;
(function(w, d) {
    var page = {
        init: function() {
            this.$cartCount = $('.cart-count')
            this.$cartBox = $('.cart-box')
            this.$cartContent = $('.cart-content')
            this.$categories = $('.categories')
            this.$parentCategories = $('.parent-categories')
            this.$childCategories = $('.child-categories')
            this.$productList = $('.product-list')
            this.$floorContainer = $('.floor .container')
            this.$elevator = $('#elevator')
            this.childCategoriesCache = {}
            this.cartTimer = null
            this.categoriesTimer = null
            this.handleCart()
            this.handleSearch()
            this.handleCategories()

            this.$swiper = $('#swiper')
            this.handleCarousel()
            this.$win = $(w)
            this.handleProductList()

            this.handleFloor()
            this.handleElevator()
                /*
            this.categories = d.querySelector('.categories')
            this.parentCategories = d.querySelector('.parent-categories')
            this.childCategories = d.querySelector('.child-categories')
        
            this.floorContainer = d.querySelector('.floor .container')
            this.elevator = d.getElementById('elevator')
            this.parentCategoriesItem = null
            this.lastActiveIndex = 0
            this.searchTimer = null
            this.categoriesTimer = null
            this.elevatorTimer = null
            this.isSearchLayerEmpty = true
            this.floors = null
            this.elevatorItem = null
            this.handleCart()
            this.handleSearch()
            this.handleCategories()
            this.handleProductList()
            this.handleFloor()
            this.handleElevator()
            this.handleCarousel()
            */
        },
        loadCartsCount: function() {
            var _this = this
            utils.ajax({
                url: '/carts/count',
                success: function(data) {
                    _this.$cartCount.html(data.data)
                }
            })
        },
        handleCart: function() {
            var _this = this
            this.loadCartsCount()
            this.$cartBox.on('mouseenter', function() {
                if (_this.cartTimer) {
                    clearTimeout(_this.cartTimer)
                }
                _this.cartTimer = setTimeout(function() {
                    _this.$cartContent.show()
                    _this.$cartContent.html('<div class="loader"></div>')
                    utils.ajax({
                        url: '/carts',
                        success: function(data) {
                            if (data.code == 0) {
                                _this.renderCart(data.data.cartList)
                            } else {
                                _this.$cartContent.html('<span class="empty-cart">获取购物车失败，请稍后重试！</span>')
                            }
                        },
                        error: function() {
                            _this.$cartContent.html('<span class="empty-cart">获取购物车失败，请稍后重试！</span>')
                        }
                    })
                }, 500)

            })
            this.$cartBox.on('mouseleave', function() {
                if (_this.cartTimer) {
                    clearTimeout(_this.cartTimer)
                }
                _this.$cartContent.hide()
            })
        },
        renderCart: function(list) {
            var len = list.length
            if (len > 0) {
                var html = ''
                html += '<span class="cart-tip" > 最近加入的宝贝</span>'
                html += '<ul>'
                for (var i = 0; i < len; i++) {
                    html += '<li class="cart-item clearfix">'
                    html += '<a href="#" target="_blank">'
                    html += '<img src="' + list[i].product.mainImage + '" alt="">'
                    html += '<span class="text-ellipsis">' + list[i].product.name + '</span>'
                    html += '</a>'
                    html += '<span class="product-count">x ' + list[i].count + ' </span><span class="product-price">' + '&yen;' + list[i].product.price + '</span>'
                    html += '</li>'
                }
                html += '</ul>'
                html += '<span class="line"></span>'
                html += '<a href="/cart.html" class="btn cart-btn">查看我的购物车</a>'
                this.$cartContent.html(html)
            } else {
                this.$cartContent.html('<span class="empty-cart">购物车中还没有商品,赶紧来购买吧!</span>')
            }
        },
        handleSearch: function() {
            $('.search-box').search({
                searchBtnSelector: '.search-btn',
                searchInputSelector: '.search-input',
                searchLayerSelector: '.search-layer',
                isAutocomplete: true
            })
        },
        //分类
        handleCategories: function() {
            var _this = this
                //获取父级分类
            this.getParentCategoriesData()
                //用事件委托的方式处理父级分类的项目切换事件
            this.$categories.on('mouseover', '.parent-categories-item', function() {
                    if (_this.categoriesTimer) {
                        clearTimeout(_this.categoriesTimer)
                    }
                    var $elem = $(this)
                    $elem.addClass('active').siblings().removeClass('active')
                    _this.categoriesTimer = setTimeout(function() {
                        if (!_this.$parentCategoriesItem) {
                            return
                        }
                        _this.$childCategories.show()
                        var pid = $elem.data('id')
                        if (_this.childCategoriesCache[pid]) {
                            _this.renderChildCategories(_this.childCategoriesCache[pid])
                        } else {
                            _this.getChildcategoriesData(pid)
                        }
                    }, 300)
                })
                //鼠标离开隐藏子级别分类
            this.$categories.on('mouseleave', function() {
                if (!_this.$parentCategoriesItem) {
                    return
                }
                if (_this.categoriesTimer) {
                    clearTimeout(_this.categoriesTimer)
                }
                _this.$childCategories.html('')
                _this.$childCategories.hide()
                _this.$parentCategoriesItem.removeClass('active')
            })
        },
        getParentCategoriesData: function() {
            var _this = this
            utils.ajax({
                url: '/categories/arrayCategories',
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderParentCategories(data.data)
                    }
                }
            })
        },
        getChildcategoriesData: function(pid) {
            var _this = this
            this.$childCategories.html('<div class="loader"></div>')
            utils.ajax({
                url: '/categories/childArrayCategories',
                data: {
                    pid: pid
                },
                success: function(data) {
                    if (data.code == 0) {
                        _this.childCategoriesCache[pid] = data.data
                        _this.renderChildCategories(data.data)
                    }
                }
            })
        },
        renderParentCategories: function(list) {
            var len = list.length
            if (len > 0) {
                var html = '<ul>'
                for (var i = 0; i < len; i++) {
                    html += '<li class="parent-categories-item" data-id="' + list[i]._id + ' " data-index="' + i + '">' + list[i].name + '</li>'
                }
                html += '</ul>'
                this.$parentCategories.html(html)
            }
            this.$parentCategoriesItem = $('.parent-categories-item')
        },
        renderChildCategories: function(list) {
            var len = list.length
            if (len > 0) {
                var html = '<ul>'
                for (var i = 0; i < len; i++) {
                    html += `<li class="child-item">
                                <a href="#">
                                  <img src="${list[i].icon}" alt="">
                                  <p>${list[i].name}</p>
                                </a>
                           </li>`
                }
                html += '</ul>'
                this.$childCategories.html(html)
            }
        },
        //轮播图
        handleCarousel: function() {
            var _this = this
            utils.ajax({
                url: '/ads/positionAds',
                data: {
                    position: 1
                },
                success: function(data) {
                    if (data.code == 0) {
                        _this.renderCarousel(data.data)
                    }
                }
            })

        },
        renderCarousel: function(list) {
            var imgs = list.map(function(item) {
                return item.imageUrl
            })
            this.$swiper.carousel({
                imgs: imgs,
                width: 862,
                height: 440,
                playInterval: 0,
                type: 'slide'
            })
        },

        //热销商品
        handleProductList: function() {
            var _this = this
            this.$productList.debounceFn = utils.debounce(function() {

                if (utils.isvisibility(_this.$productList)) {
                    utils.ajax({
                        url: '/products/hot',
                        success: function(data) {
                            if (data.code == 0) {
                                _this.renderProductList(data.data)
                            }
                        }
                    })
                }
            }, 300)
            this.$win.on('scroll load resize', this.$productList.debounceFn)
                /*
                this.$win.on('scroll', function () {
                    if (_this.$productList.data('isLoaded')) {
                        return
                    }
                    if (utils.isvisibility(_this.$productList)) {
                        console.log(111)
                        utils.ajax({
                            url: '/products/hot',
                            success: function (data) {
                                if (data.code == 0) {
                                    _this.renderProductList(data.data)
                                }
                            }
                        })
                    }
                })
                */

        },
        renderProductList: function(list) {
            var len = list.length
            var html = ''
            for (var i = 0; i < len; i++) {
                html += `<div class="product-item col-1 col-gap">
                 <a href="#">
                     <img data-src="${list[i].mainImage}" src="./images/loading.gif">
                     <p class="product-name">${list[i].name}
                     </p>
                     <div class="product-price-paynums">
                         <span class="product-price">&yen;&nbsp;${list[i].price}</span>
                         <span class="product-paynums">${list[i].payNums}人已购买</span>
                     </div>
                 </a>
             </div>`
            }
            this.$productList.html(html)

            //是否加载过
            // this.$productList.data('isLoaded', true)

            //加载后移除滚动事件
            this.$win.off('scroll load resize', this.$productList.debounceFn)

            //加载图标引入
            this.$productList.find('.product-item img').each(function() {

                var $img = $(this)
                var imgSrc = $img.data('src')
                utils.loadImage(imgSrc, function() {
                    $img.attr('src', imgSrc)
                })

                /*
                var $img = $(this)
                var imgSrc = $img.data('src')
                var image = new Image()
                image.onload = function () {
                    $img.attr('src', imgSrc)
                }
                image.src = imgSrc
                */
            })
        },

        //楼层
        handleFloor: function() {
            var _this = this
            this.$floorContainer.debounceFn = utils.debounce(function() {

                if (utils.isvisibility($('.floor .container'))) {
                    utils.ajax({
                        url: '/floors',
                        success: function(data) {
                            if (data.code == 0) {
                                _this.renderFloorContainer(data.data)
                            }
                        }
                    })
                }
            }, 300)
            this.$win.on('scroll load resize', this.$floorContainer.debounceFn)

            /*
            if (utils.isvisibility(this.$floorContainer)) {
                utils.ajax({
                    url: '/floors',
                    success: function(data) {
                        if (data.code == 0) {
                            _this.renderFloorContainer(data.data)
                        }
                    }
                })
            }
            */

        },
        renderFloorContainer: function(list) {
            var _this = this
            var html = ''
            var elevatorHTML = ''
            for (var i = 0, len1 = list.length; i < len1; i++) {
                html += `<div class="floor-wrap clearfix">
                <div class="floor-title">
                    <a href="#">
                        <h4>F${list[i].num} ${list[i].title}</h4>
                    </a>
                </div>
                <div class="product-list">`
                for (var j = 0, len2 = list[i].products.length; j < len2; j++) {
                    var product = list[i].products[j]
                    html += `<div class="product-item col-1 col-gap">
                                   <a href="#">
                                     <img data-src="${product.mainImage}" src="./images/loading.gif">
                                     <p class="product-name">${product.name}</p>
                                     <div class="product-price-paynums">
                                       <span class="product-price">&yen;&nbsp;${product.price}</span>
                                       <span class="product-paynums">${product.payNums}人已购买</span>
                                    </div>
                                  </a>
                            </div>`
                }

                html += `</div>
                  </div>`
                elevatorHTML += `<a href="javascript:;" class="elevator-item">
                  <span class="elevator-item-num">F${list[i].num}</span>
                  <span class="elevator-item-text text-ellipsis" data-num="${i}">${list[i].title}</span>
               </a>`
            }
            elevatorHTML += ` <a href="javascript:;" class="backToTop">
                                <span class="elevator-item-num"><i class="iconfont icon-arrow-up"></i></span>
                                <span class="elevator-item-text text-ellipsis" id="backToTop">顶部</span>
                              </a>`
            this.$floorContainer.html(html)
            this.$elevator.html(elevatorHTML)

            /*
            记录加载状态
            this.$floorContainer.attr('isLoad', true)
            */

            //加载后移除滚动事件
            this.$win.off('scroll load resize', this.$floorContainer.debounceFn)

            //懒加载
            this.handleFloorImg()

            /*
            this.floors = d.querySelectorAll('.floor-wrap')
            this.elevatorItem = d.querySelectorAll('.elevator-item')
            */
        },
        handleFloorImg: function() {
            var _this = this
            var $floors = $('.floor .floor-wrap')

            //已加载楼层个数
            var totalLoadFloorNum = 0

            //楼层的个数
            var floorNum = $floors.length

            var debounceFn = utils.debounce(function() {
                $floors.each(function() {
                    var $floor = $(this)
                    if ($floor.data('isLoaded')) {
                        return
                    }
                    if (utils.isvisibility($floor)) {
                        var $imgs = $floor.find('.product-item img')
                        $imgs.each(function() {
                            var $img = $(this)
                            var imgSrc = $img.data('src')
                            utils.loadImage(imgSrc, function() {
                                $img.attr('src', imgSrc)
                            })
                        })
                        $floor.data('isLoaded', true)
                        totalLoadFloorNum++
                        if (totalLoadFloorNum == floorNum) {
                            $floors.trigger('allLoad')
                        }
                    }
                })
            }, 300)
            _this.$win.on('scroll resize load', debounceFn)
            $floors.on('allLoad', function() {
                _this.$win.off('scroll resize load', debounceFn)
            })
        },

        //电梯
        handleElevator: function() {
            var _this = this
            this.$elevator.on('click', '.elevator-item-text', function() {
                var $elem = $(this)
                if ($elem.attr('id') == 'backToTop') {

                    $('html,body').animate({
                        scrollTop: 0
                    })
                } else {
                    $('html,body').animate({
                        scrollTop: $('.floor .floor-wrap').eq($elem.data('num')).offset().top
                    })
                }
            })

            //根据楼层显示电梯层数
            var betterSrtElevator = utils.debounce(function() {
                _this.setElevator()
            }, 300)
            this.$win.on('scroll resize load', betterSrtElevator)
        },
        setElevator: function() {
            //获取楼层号
            var num = this.getFloorNum()
            if (num == -1) {
                this.$elevator.hide()
            } else {
                this.$elevator
                    .show().find('.elevator-item')
                    .removeClass('elevator-active')
                    .eq(num).addClass('elevator-active')
            }
        },
        getFloorNum: function() {
            var _this = this
                //设置一个默认楼层号
            var num = -1

            $('.floor .floor-wrap').each(function(index) {
                num = index
                var $floor = $(this)
                if ($floor.offset().top > _this.$win.scrollTop() + _this.$win.height() / 2) {
                    num = index - 1
                    return false
                }
            })
            return num
        }
    }
    page.init()
})(window, document)