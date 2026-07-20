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
app.use("/api/profile",profileRoutes);

app.use(notFound);

app.use(globalErrorHandler);

export default app;