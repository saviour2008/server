import * as express from 'express'
import { Server } from 'ws'
const app = express()
export class Product {
    constructor(public id: number,
        public title: string,
        public price: number,
        public rating: number,
        public desc: string,
        public categories: string[]
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
app.get('/', (Request, Response) => {
    Response.send('hello friday!!!')
})
app.get('/products', (Request, Response) => {
    Response.json(products)
})
app.get('/products/:id', (Request, Response) => {
    Response.json(products.find((Product) => Product.id == Request.params.id))
})
const server = app.listen(4000, 'localhost', () => {
    console.log('服务器已启动,地址是http://localhost:4000')
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