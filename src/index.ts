import express from "express";

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./utils/database");

// mongodb+srv://ogatatsu:Passw0rd@cluster0.mq7iilc.mongodb.net/appDataBase?retryWrites=true&w=majority



app.post("/item/create", (req: express.Request, res: express.Response) => {
	connectDB();
	console.log(req.body.title);
	res.status( 200 ).json("Goodbye");
});

app.listen(5000, () => {
	console.log("ポート5000番で起動しました。");
});
