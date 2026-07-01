import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import servicesRouter from "./services";
import galleryRouter from "./gallery";
import invoicesRouter from "./invoices";
import productsRouter from "./products";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import testimonialsRouter from "./testimonials";
import photoReviewsRouter from "./photoReviews";

const router: IRouter = Router();

router.use(healthRouter);
router.use(bookingsRouter);
router.use(servicesRouter);
router.use(galleryRouter);
router.use(invoicesRouter);
router.use(productsRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(testimonialsRouter);
router.use(photoReviewsRouter);

export default router;
