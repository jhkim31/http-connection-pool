import express from "express";


const app = express();

app.use(express.text());    
app.use(express.json());    
app.use(express.urlencoded());    

export default app;