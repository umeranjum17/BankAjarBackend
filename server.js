const express =require('express');
const routes=require("./routes")
const cors=require('cors')
// const bodyParser=require("body-parser")
//import routes from './routes';

class Index {
  constructor() {
    this.server = express();
    this.baseUrl="/api/v1"
    this.middlewares();
   
    process.env.BALANCE=process.env.BALANCE||50000
    this.routes();
  }

  middlewares() {
    this.server.use(cors({origin:"*"}))
    this.server.use(express.json());
    // this.server.use(bodyParser.json())
  }

  routes() {
    this.server.use(this.baseUrl,routes);
  }
}
new Index().server.listen(2400);


