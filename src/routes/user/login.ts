import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();
const prisma = new PrismaClient();

router.post("/login", async (req, res) => {
	console.log("--POST login")
	try {
		const { email, password } = req.body;
		if (!(email && password)) {
      res.status(400).send("All input is required");
    };

		const user = await prisma.user.findUnique({
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
		res.status(400).json({message: "Invalid credentials"});
	} catch (error) {
		console.log(error);
	}
});

export default router;

