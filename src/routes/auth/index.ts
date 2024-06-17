import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import { RegisterValidator } from "../../validators/registrationValidator";
import { getUserByEmail, createUser } from "../../repositories/userRepository";
import { generatePasswordHash } from "../../utils/security";

const app = new Hono();

app.post("/register", zValidator('json', RegisterValidator), async (c) => {
    try {
        const { name, lastname, email, password, birthday } = await c.req.json();
        const doesUserExist = await getUserByEmail(email);
        if (doesUserExist !== null) {
            c.status(400);
            return c.json({
                message: "email is not avaliable"
            });
        }
        const passwordHash = await generatePasswordHash(password);
        const user = await createUser({
            name: name,
            lastName: lastname,
            email: email,
            passwordHash: passwordHash,
            birthDay: new Date(birthday),
        })
        c.status(201);
        return c.body(null);
    } catch (error) {
        console.log(error)
        throw new HTTPException(500, {
            message: "Internal server error",
            cause: error
        });
    }
});

export default app;