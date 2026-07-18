import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";





const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const user = await userService.createUser(payload);
        sendResponse(res, {
            success: true,
            statusCode: status.CREATED,
            message: "User Created Successfully",
            data: { user }
        });
    }
)

const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const users = await userService.getAllUsers();

        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Fetched all users",
            data: { users }
        })
    }
)

const getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "User data fetched",
            data: {
                user
            }
        });
    }
)

const updateUserStatusById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const userId = req.user?.id;
        const updatedUser = await userService.updateUserStatusById(payload, userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "user status updated",
            data: {
                updatedUser
            }
        });
    }
)
const deleteMyAccount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const response = await userService.deleteMyAccount(userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "account deleted successfully. You can restore your account within 7 days.",
            data: response
        });
    }
)
const restoreUserAccount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const user = await userService.restoreUserAccount(payload);
        sendResponse(res,
            {
                success: true,
                statusCode: status.OK,
                message: "Account Restore Successfully",
                data: {
                    user
                }
            }
        );

    }
)
const updateMyAccount = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const userId = req.user?.id;
        const user = await userService.updateMyAccount(payload, userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "profile updated",
            data: {
                user
            }
        })
    }
)
const getMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const profile =await userService.getMyProfile(userId as string);
        sendResponse(
            res,
            {
                success: true,
                statusCode: status.OK,
                message: "Profile fetched success",
                data: profile
            }
        )
    }
)

export const userController = {
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUserStatusById,
    updateMyAccount,
    deleteMyAccount,
    createUser,
    restoreUserAccount
}