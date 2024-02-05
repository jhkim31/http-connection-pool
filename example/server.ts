import express from "express";

const app = express();

app.use(express.text());    
app.use(express.json());    

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

app.listen(3000);

export default app;