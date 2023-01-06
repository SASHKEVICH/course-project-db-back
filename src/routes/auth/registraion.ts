import { Router, Response } from "express";
import { PrismaClient } from '@prisma/client';
import sendError from "../../helpers/sendError";
import { AuthError, AuthErrorCodes } from "../../types/errors/auth/authError";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient()
const saltRounds = 10;

router.post("/", async (req, res) => {
	console.log("--POST register");
	try {
		const { name, nickname, email, password } = req.body;
		if (!(email && password && name)) {
			throw new AuthError("All input is required", AuthErrorCodes.allInputRequired);
    };

		const oldUser = await prisma.user.findUnique({
			where: { email: email }
		});

		if (oldUser) {
			throw new AuthError("User already exists. Please login.", AuthErrorCodes.userAlreadyExists);
    };
		
		const encryptedPassword = await bcrypt.hash(password, saltRounds);
		const user = await prisma.user.create({
			data: {
				name: name,
				nickname: nickname,
				email: email.toLowerCase(),
				password: encryptedPassword
			}
		});

		const tokenKey = process.env.TOKEN_KEY ?? "odfjgkdnfuhasidj";
		const token = jwt.sign(
			{ user_id: user.user_id, email },
			tokenKey,
      { expiresIn: "2h" }
		);
		user.token = token;

		res.status(201).json({userId: user.user_id, token: user.token});
	} catch (error) {
		sendError(res, error as AuthError);
		console.log(error);
	}
});

export default router;
