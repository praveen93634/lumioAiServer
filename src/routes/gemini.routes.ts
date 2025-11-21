import { Router } from "express";
import { generateContent } from "../utils/gemini";
import { basicAuth } from "../middleware/auth";
const router:Router=Router()

router.post("/chat",
    basicAuth,
    generateContent
)
export default router;