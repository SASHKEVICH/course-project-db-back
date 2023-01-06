import { Router, Response } from "express";
import { PrismaClient } from "@prisma/client";
import sendError from "../../helpers/sendError";
import { AuthError, AuthErrorCodes } from "../../types/errors/auth/authError"

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
	console.log("--POST login")
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
			throw new AuthError("All input is required", AuthErrorCodes.allInputRequired);
    };

		const user = await prisma.user.findUnique({
			where: { email: email }
		});

		if (!user) {
			throw new AuthError("No user found", AuthErrorCodes.invalidCredentials);
		}
		
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
		sendError(res, error as AuthError);
		console.log(error);
	}
});

export default router;

