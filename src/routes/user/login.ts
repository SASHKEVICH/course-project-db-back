import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { LoginError } from "../../types/errors/loginErrors"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	console.log("--POST login")
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
			throw new LoginError("All input is required");
    };

		const user = await prisma.user.findUniqueOrThrow({
			where: { email: email }
		});
		
		const isPasswordsCompared = await bcrypt.compare(password, user?.password ?? "");
		if (user && isPasswordsCompared) {
			const tokenKey = process.env.TOKEN_KEY ?? "";
			const token = jwt.sign(
				{ user_id: user.user_id, email },
				tokenKey,
				{ expiresIn: "2h" }
			);
			user.token = token;

			return res.status(200).json({
				message: "success",
				userId: user.user_id,
				token: user.token
			});
		};
	} catch (error) {
		sendError(res, error as Error);
		console.log(error);
	}
});

function sendError(res: Response, error: LoginError | PrismaClientKnownRequestError) {
	type someLoginError = LoginError | PrismaClientKnownRequestError;
	const sendingMessage: string = error as someLoginError ? error.message : "Something went wrong"
	res.status(400).json({
		error: "failure",
		message: sendingMessage
	});
}

export default router;

