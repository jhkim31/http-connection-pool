import express, {Request, Response} from "express";
import multer from "multer";

const app = express();

app.use(express.text());    
app.use(express.json());    
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // 파일이 저장될 경로
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // 파일명은 원본 파일명 그대로 사용
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.send(200);
})

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