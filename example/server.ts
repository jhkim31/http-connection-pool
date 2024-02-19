import express from "express";

const app = express();

app.use(express.text());    
app.use(express.json());    

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

app.get('/test/:id', (req, res) => {  
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

if (require.main === module) {
  app.listen(3000);
}

export default app;