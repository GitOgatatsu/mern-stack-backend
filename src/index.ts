import express, { Request, Response } from "express";
const app = express();
import session from "express-session";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: "secret_key",
	resave: false,
	saveUninitialized: false,
	cookie: { httpOnly: true, secure: false, maxAge: 1000 * 60 * 30 }
}));
declare module "express-session" {
	interface Session {
		email: string;
	}
};
import cors from "cors";
app.use(cors());
import jwt from "jsonwebtoken";

import { connectDB } from "./utils/database";
import { ItemModel, UserModel } from "./utils/schemaModels";
import auth from "./utils/auth";

const secret_key = "mern-market";





//// ItemFunctions
// CreateItem
app.post("/item/create", auth, async (req: Request, res: Response) => {
	try {
		await connectDB();
//		console.log(req.body.title);
		await ItemModel.create(req.body);
		return res.status(200).json({ message: "アイテム作成成功" });
	} catch (err) {
		return res.status(500).json({ message: "アイテム作成失敗" });
	}
});



// ReadAllItems
app.get("/", async (req: Request, res: Response) => {
	console.log(req.session.email);
	try {
		await connectDB();
		const allItems = await ItemModel.find();
		return res.status(200).json({ message: "アイテム取得成功 (All)", allItems: allItems });
	} catch (err) {
		return res.status(500).json({ message: "アイテム取得失敗 (All)" });
	}
});



// ReadItem
app.get("/item/read/:id", async (req: Request, res: Response) => {
	try {
		await connectDB();
		const singleItem = await ItemModel.findById(req.params.id);
		return res.status(200).json({ message: "アイテム取得成功 (Single)", singleItem: singleItem });
	} catch (err) {
		return res.status(500).json({ message: "アイテム取得失敗 (Single)" });
	}
});



// UpdateItem
app.put("/item/update/:id", auth, async (req: Request, res: Response) => {
	try {
		await connectDB();
		const singleItem = await ItemModel.findById(req.params.id);
		if (singleItem && singleItem.email === req.body.email) {
			await ItemModel.updateOne({ _id: req.params.id }, req.body);
			return res.status(200).json({ message: "アイテム更新成功" });
		} else {
			throw new Error();
		}
	} catch (err) {
		return res.status(500).json({ message: "アイテム更新失敗" });
	}
});



// DeleteItem
app.delete("/item/delete/:id", auth, async (req: Request, res: Response) => {
	try {
		await connectDB();
		const singleItem = await ItemModel.findById(req.params.id);
		if (singleItem && singleItem.email === req.body.email) {
			await ItemModel.deleteOne({ _id: req.params.id });
			return res.status(200).json({ message: "アイテム削除成功" });
		} else {
			throw new Error();
		}
	} catch (err) {
		return res.status(500).json({ message: "アイテム削除失敗" });
	}
});



//// UserFunctions
// RegisterUser
app.post("/user/register", async (req: Request, res: Response) => {
	try {
		await connectDB();
		await UserModel.create(req.body);
		return res.status(200).json({ message: "ユーザ登録成功" });
	} catch (err) {
		return res.status(500).json({ message: "ユーザ登録失敗" });
	}
});


// LoginUser
app.post("/user/login", async (req: Request, res: Response) => {
	try {
		await connectDB();
		const savedUserData = await UserModel.findOne({ email: req.body.email });
		if (savedUserData) {
			if (savedUserData.password === req.body.password) {
//				req.session.email = req.body.email;
				const payload = {
					email: req.body.email
				};
				const token = jwt.sign(payload, secret_key, { expiresIn: "23h" });
				console.log(token);
				return res.status(200).json({ message: "ログイン成功", token: token });
			} else {
				return res.status(401).json({ message: "ログイン失敗: パスワードが違います" });
			}
		} else {
			return res.status(401).json({ message: "ログイン失敗: ユーザが存在しません" });
		}
	} catch (err) {
		return res.status(500).json({ message: "ログイン失敗" });
	}
});



//// CheckLogin
//app.get("/user/islogin", async (req: Request, res: Response) => {
//	if (req.session.email) {
//		return res.status(200).json({ result: true, email: req.session.email });
//	} else {
//		return res.status(200).json({ result: false });
//	}
//});



// Listen
app.listen(5000, () => {
	console.log("ポート5000番で起動しました。");
});
