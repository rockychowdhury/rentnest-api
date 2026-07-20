import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { profileService } from "./profile.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const getProfileByUserId = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const publicProfile = await profileService.getProfileById(userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Public Profile fetched",
            data: {
                profile: publicProfile
            }
        });
    }
)


const updateMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const userId = req.user?.id;

        const updatedProfile = await profileService.updateMyProfile(payload, userId as string);
        sendResponse(res,
            {
                success: true,
                statusCode: status.OK,
                message: "profile updated",
                data: updatedProfile
            }
        )
    }
)




export const profileController = {
    getProfileByUserId,
    updateMyProfile
};