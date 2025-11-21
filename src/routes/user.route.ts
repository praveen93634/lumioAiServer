import { Router } from "express";
import { basicAuth } from "../middleware/auth";
import { getAllUsers, getConnections, getpendingRequests, getUserById, updateUserProfile } from "../controller/user.controller";
const router: Router = Router();

router.put("/getAllUsers",
    basicAuth,
    getAllUsers
)
router.get("/requests/received",
    basicAuth,
    getpendingRequests
)
router.put("/update",
    basicAuth,
    updateUserProfile
)
router.get("/profile",
    basicAuth,
    getUserById
)
router.get("/myconnections",
    basicAuth,
    getConnections
)
export default router;
