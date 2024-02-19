import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(express.text());    
app.use(express.json());    
app.use(bodyParser.text({type: "application/xml"}));
app.use(bodyParser.text({type: "text/xml"}));

export default app;