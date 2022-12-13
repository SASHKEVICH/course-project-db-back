import { Router } from "express";
import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient()
const saltRounds = 10;

router.post("/registration", async (req, res) => {
	console.log("--POST register");
	try {
		const { name, nickname, email, password } = req.body;
		if (!(email && password && name)) {
      return res.status(400).send("All input is required");
    };

		const oldUser = await prisma.user.findUnique({
			where: { email: email }
		});
		if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
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

		const tokenKey = process.env.TOKEN_KEY ?? "";
		const token = jwt.sign(
			{ user_id: user.user_id, email },
			tokenKey,
      { expiresIn: "2h" }
		);
		user.token = token;

		res.status(201).json({userId: user.user_id, token: user.token});
	} catch (error) {
		console.log(error);
	}
});

export default router;
