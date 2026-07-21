import express, { Application } from "express";
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import status from "http-status";
import { userRoute } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";
import { profileRoutes } from "./modules/profile/profile.route";
import { amenityRoutes } from "./modules/amenity/amenity.route";
import { categoryRoutes } from "./modules/category/category.route";
import { geoRoutes } from "./modules/geo/geo.route";
import { propertyRoutes } from "./modules/property/property.route";
import { propertyUnitRoutes } from "./modules/propertyUnit/propertyUnit.route";
import { propertyImageRoutes } from "./modules/propertyImage/propertyImage.route";
import { pricingRoutes } from "./modules/pricing/pricing.route";
import { rentalRequestRoutes } from "./modules/rentalRequest/rentalRequest.route";
import { leaseRoutes } from "./modules/lease/lease.route";
import { paymentRoutes } from "./modules/payment/payment.route";
import { reviewRoutes } from "./modules/review/review.route";



const app: Application = express();

//middlewares
app.use(cors(
    {
        origin: config.app_url,
        credentials: true,
    }
));

app.post("/api/subscription/webhook",express.raw({type: 'application/json'}),()=>{
    
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(status.OK).send(
        {
            message: "Server is Healthy",
            from: "Prisma Press",
            author: "Rocky Chowdhury",
            time: new Date(),
        }
    )
})



app.use('/api/auth', authRoutes);
app.use('/api/users', userRoute);
app.use('/api/profile', profileRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', geoRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/property-units', propertyUnitRoutes);
app.use('/api/property-images', propertyImageRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/rental-requests', rentalRequestRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;