import { Request, Response, NextFunction } from "express";
import jwt, { Jwt, JwtPayload } from "jsonwebtoken";

const secret_key = "mern-market";

//declare module "jsonwebtoken" {
//	interface JwtPayload {
//		email: string;
//	}
//};

const auth = async (req: Request, res: Response, next: NextFunction) => {

	if (req.method === "GET") {
		return next();
	}

//	const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im9nYXRhdHN1QHRlc3QuY29tIiwiaWF0IjoxNjgzODY0ODI5LCJleHAiOjE2ODM5NDc2Mjl9.3gyZeabelgGM5W7qCRq8DY7Q7SskZ0LZI_3X6lUFVGA";
	if (!token) {
		return res.status(401).json({ message: "トークンがありません" });
	}

	try {
		const decoded: JwtPayload = jwt.verify(token, secret_key) as JwtPayload;
		req.body.email = decoded.email;
		return next();
	} catch (err) {
		return res.status(401).json({ message: "トークンが不正です" });
	}

};

export default auth;
