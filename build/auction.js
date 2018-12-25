"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var products = [
    new Product(1, '第一个商品', 10.99, 3, '超市', ['图书', '视频']),
    new Product(2, '第二个商品', 11.29, 4, '商场', ['音乐', '视频']),
    new Product(3, '第三个商品', 10.99, 5, '公司', ['图书', '视频']),
    new Product(4, '第四个商品', 13.99, 6, '超市', ['音乐', '视频']),
    new Product(5, '第五个商品', 10.99, 7, '公司', ['图书', '视频']),
    new Product(6, '第六个商品', 15.99, 8, '超市', ['音乐', '视频']),
    new Product(7, '第七个商品', 16.99, 9, '公司', ['图书', '视频'])
];
app.get('/', function (Request, Response) {
    Response.send('hello friday!!!');
});
app.get('/products', function (Request, Response) {
    Response.json(products);
});
app.get('/products/:id', function (Request, Response) {
    Response.json(products.find(function (Product) { return Product.id == Request.params.id; }));
});
var server = app.listen(4000, 'localhost', function () {
    console.log('服务器已启动,地址是http://localhost:4000');
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    websocket.send('这个消息是服务器主动推送的');
    websocket.on('message', function (message) {
        console.log('接收到消息' + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send('这时定时推送');
        });
    }
}, 2000);
