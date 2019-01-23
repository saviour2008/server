import * as express from 'express'
import { Server } from 'ws'
import { dbConfig, querySQL } from './db'

const app = express();

let mysql = require('mysql');
let str = "";
let pool = mysql.createPool(dbConfig);
pool.getConnection(function (err, connection) {

    //var params = req.query || req.params;        //前端传的参数（暂时写这里，在这个例子中没用）

    connection.query(querySQL, function (err, result) {
        if (err) {
            console.log('[SELECT ERROR]:', err.message);
        }
        //将结果以json形式返回到前台

        str = JSON.stringify(result);

        //释放链接

        connection.release();

    })
})
export class Product {
    constructor(public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: string[]
    ) { }
}
export class Order {
    constructor(
        public status: number,
        public orderNumber: number,
        public address: string,
        public submitTime: number,
        public serviceTime: number,
        public servicePrice: number,
        public totalPrice: number,
        public serviceItems: string[],
        public report: object
    ) { }
}
const products: Product[] = [
    new Product(1, '第一个商品', 10.99, 3, '超市', ['图书', '视频']),
    new Product(2, '第二个商品', 11.29, 4, '商场', ['音乐', '视频']),
    new Product(3, '第三个商品', 10.99, 5, '公司', ['图书', '视频']),
    new Product(4, '第四个商品', 13.99, 6, '超市', ['音乐', '视频']),
    new Product(5, '第五个商品', 10.99, 7, '公司', ['图书', '视频']),
    new Product(6, '第六个商品', 15.99, 8, '超市', ['音乐', '视频']),
    new Product(7, '第七个商品', 16.99, 9, '公司', ['图书', '视频'])
]
const orders: Order[] = [
    new Order(1, 9001, "上海市中山小区601", 1545954337224, 1545964337224, 200, 200, ["检查居家安全", "检查狗狗安全", "查看门锁"], { clientDemonds: [{ question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }], pics: ['https://placekitten.com/210/100', 'https://placekitten.com/210/100', 'https://placekitten.com/210/100'] }),
    new Order(2, 9002, "上海市中山小区602", 1545954337224, 1545964337224, 200, 200, ["检查居家安全", "检查狗狗安全", "查看门锁"], { clientDemonds: [{ question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }], pics: ['https://placekitten.com/210/100', 'https://placekitten.com/210/100', 'https://placekitten.com/210/100'] }),
    new Order(3, 9003, "上海市中山小区603", 1545854337224, 1545964337224, 200, 200, ["检查居家安全", "检查狗狗安全", "查看门锁"], { clientDemonds: [{ question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }], pics: ['https://placekitten.com/210/100', 'https://placekitten.com/210/100', 'https://placekitten.com/210/100'] }),
    new Order(4, 9004, "上海市中山小区604", 1545554337224, 1545664337224, 200, 200, ["检查居家安全", "检查狗狗安全", "查看门锁"], { clientDemonds: [{ question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }, { question: "门窗是否关好", answer: "报告XXXXXX" }], pics: ['https://placekitten.com/210/100', 'https://placekitten.com/210/100', 'https://placekitten.com/210/100'] })
]

app.get('/', (Request, Response) => {
    Response.send(str);
})
app.get('/api/products', (Request, Response) => {
    Response.json(products)
})
app.get('/orders', (Request, Response) => {
    Response.json(orders)
})
app.get('/products/:id', (Request, Response) => {
    Response.json(products.find((Product) => Product.id == Request.params.id))
})
app.get('/orders/:id', (Request, Response) => {
    Response.json(orders.find((order) => order.orderNumber == Request.params.id))
})
app.get('/orders/:id/report', (Request, Response) => {
    Response.json(orders.find((order) => order.orderNumber == Request.params.id))
})

const server = app.listen(4000, 'localhost', () => {
    console.log('服务器已启动,地址是http://localhost:4000!')
})
const wsServer = new Server({ port: 8085 });
wsServer.on('connection', websocket => {
    websocket.send('这个消息是服务器主动推送的');
    websocket.on('message', message => {
        console.log('接收到消息' + message)
    })
})
setInterval(() => {
    if (wsServer.clients) {
        wsServer.clients.forEach(client => {
            client.send('这时定时推送!')
        })
    }
}, 2000)