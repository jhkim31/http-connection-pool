import express, { Express } from "express";
import bodyParser from "body-parser";

class Server {
  app: Express;
  server: any;
  constructor() {
    this.app = express();    
    this.app.use(express.text());    
    this.app.use(express.json());    
    this.app.use(express.urlencoded());    

    this.app.use((err: any, req: any, res: any, next: any) => {
      console.log(err);
      next();
    })

    this.app.get('/get', (req, res) => {
      res.json({ message: 'GET request received' });
    });

    this.app.get('/get_query', (req, res) => {
      res.json(req.query);
    });

    this.app.post('/post', (req, res) => {      
      res.json({ message: 'POST request received' });
    });

    this.app.post('/post_body', (req, res) => {      
      console.log(req.body);
      res.json({ message: req.body });
    });
  }

  start() {
    this.server = this.app.listen(3000, () => {
      console.log('Test server is running on port 3000');
    });
  }

  stop() {
    this.server.close();
  }
}

// new Server().start();

export default Server;