import express from 'express'
import routes from './routes'
import cors from 'cors'
import {expressjwt} from 'express-jwt';
import {userApiRoute, userGetRoute, userPostRoute} from './routes/user';
import {showCode} from './niuBCode';
import {random} from 'lodash';

const app = express();

app.use(express.static("./ui/build"))
// 中间件

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

export const secretKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIwMDAwMDAiLCJpYXQiOjE2NjYwMDc5ODYsImV4cCI6MTY2NjAwODAxNn0.cET7lTpObUyIQNbE78_Cl7z02EZcYoL4UJeo26OpXWw";
app.use(expressjwt({
  secret    : secretKey,
  algorithms: ["HS256"]
}).unless({path: [/^\/api\//]}));//配置那些接口不需要访问权限

app.use('/api',userApiRoute);
app.use('/get',userGetRoute);
app.use('/post',userPostRoute);

app.use((err, req , res, next)=>{
  if(err.name ==='UnauthorizedError'){
    return  res.send({
      status:401,
      msg:'无效的token'
    })
  }
  console.error(err.message);
  res.send({
    status: 500,
    msg   : err
  })
})

//

const port: any = process.env.PORT as unknown | 8080;

app.listen(port, async () => {
  console.log(`App is running at http://localhost:${port}`)
  console.log(showCode[random(0, showCode.length - 1)])
  
  routes(app)
})