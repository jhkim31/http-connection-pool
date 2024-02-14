import express from "express";

const app = express();

app.use(express.text());    
app.use(express.json());    

app.post("/post", (req, res) => {
  console.log(req.body);
  res.send(req.body);
})

app.get('/test', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, Math.random() * 100);
});

app.get('/timeout', (req, res) => {
  setTimeout(() => {
    res.send("OK")
  }, 10000);
});


if (require.main === module) {
  app.listen(3000);
}

export default app;