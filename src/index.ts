import express from "express";

const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { connectDB } from "./utils/database";
import { ItemModel } from "./utils/schemaModels";



app.post("/item/create", async (req: express.Request, res: express.Response) => {
	try {
		await connectDB();
//		console.log(req.body.title);
		await ItemModel.create(req.body);
		return res.status(200).json({ message: "アイテム作成成功" });
	} catch (err) {
		return res.status(500).json({ message: "アイテム作成失敗" });
	}
});



app.get("/", async (req: express.Request, res: express.Response) => {
	try {
		await connectDB();
		const allItems = await ItemModel.find();
		return res.status(200).json({ message: "アイテム取得成功 (All)", allItems: allItems });
	} catch (err) {
		return res.status(500).json({ message: "アイテム取得失敗 (All)" });
	}
});



app.listen(5000, () => {
	console.log("ポート5000番で起動しました。");
});
