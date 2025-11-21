import { Router } from "express";
import authRoutes from './auth.routes';
import userRoutes from './user.route';
import geminiRoutes from './gemini.routes'
import { request } from "http";
const route = Router();
route.use('/auth',authRoutes)
route.use('/user',userRoutes)
route.use('/Ai',geminiRoutes)
export default route;