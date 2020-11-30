var USE_MOCK = true

if (USE_MOCK) {
    Mock.setup({
            timeout: 500
        }),
        Mock.mock('/carts/count', 'get', {
            "code": 0,
            "data|1-100": 100
        }),
        Mock.mock('/carts', 'get', {
            "code": 0,
            "data": {
                "allChecked": "@boolean",
                "totalCartPrice|1-9999": 1,
                "_id": "@string('lower',24)",
                "cartList|0-10": [{
                    "count|1-10": 1,
                    "totalPrice|1-9999": 9999,
                    "checked": "@boolean",
                    "_id": "@string('lower',24)",
                    "product": {
                        "_id": "@string('lower',24)",
                        "name": "@cword(10, 50)",
                        "mainImage": "@dataImage('200x200','商品')",
                        "price|1-9999": 9999,
                        "stock|1-9999": 9999
                    },
                    "attr": "颜色:白色;"
                }]
            }
        }),
        Mock.mock(/\/products\/search/, 'get', {
            "code": 0,
            "data|0-10": [{
                "_id": "@string('lower',24)",
                "name": "@cword(10, 50)"
            }]
        }),
        Mock.mock('/categories/arrayCategories', 'get', {
            "code": 0,
            "data|10": [{
                "level": 1,
                "isShow": "1",
                "isFloor": "0",
                "order": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(4)",
                "mobileName": "@cword(4)",
                "icon": "@dataImage('200x200','商品')"
            }]
        }),
        Mock.mock(/\/categories\/childArrayCategories/, 'get', {
            "code": 0,
            "data|1-10": [{
                "level": 2,
                "isShow": "1",
                "isFloor": "0",
                "order": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(4)",
                "mobileName": "@cword(4)",
                "icon": "@dataImage('200x200','商品')"
            }]
        }),
        Mock.mock(/\/ads\/positionAds/, 'get', {
            "code": 0,
            "data|3-7": [{
                "position": "1",
                "order": 0,
                "isShow": "1",
                "_id": "@string('lower',24)",
                "name": "@cword(4)",
                "image": "@dataImage('200x200')",
                "link": "http://mall.kuazhu.com/detail.html?productId=5ea68e9e5dbe7a0023712b03"
            }]
        }),
        Mock.mock('/products/hot', 'get', {
            "code": 0,
            "data|4": [{
                "order": 0,
                "isShow": "1",
                "isHot": "1",
                "payNums|1-9999": 0,
                "_id": "@string('lower',24)",
                "name": "@cword(10, 50)",
                "mainImage": "@dataImage('200x200','商品')",
                "price|1-9999": 1
            }]
        }),
        Mock.mock('/floors', 'get', {
            "code": 0,
            "data|4": [{
                "title": "@cword(4)",
                "id": "@string('lower',24)",
                "products|10": [{
                    "status": "1",
                    "order": 0,
                    "isShow": "1",
                    "isHot": "1",
                    "payNums|1-9999": 1,
                    "_id": "@string('lower',24)",
                    "name": "@cword(10, 50)",
                    "mainImage": "@dataImage('200x200','商品')",
                    "price|1-9999": 9999,
                    "stock|1-9999": 9999
                }],
                "order": 0,
                "num|+1": 1
            }]
        })
}