import mongoose from "mongoose";

const connectDB = async () => {
	try {
		await mongoose.connect("mongodb+srv://ogatatsu:dFq4CEt0s8GbKqgV@cluster0.mq7iilc.mongodb.net/appDataBase?retryWrites=true&w=majority");
		console.log("Sucess: Connected to MongoDB");
	} catch (err) {
		console.log("Filure: Unconnected to MongoDB");
		throw new Error();
	}
};

export { connectDB };
