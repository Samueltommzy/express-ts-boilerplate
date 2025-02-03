import { Router } from "express";
import useRoutes from "./user";

const router: Router = Router();
router.use("/user", useRoutes);

export default router;
