import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";


const loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;
        const { accessToken, refreshToken } = await authService.login(payload);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Login Successful",
            data: {
                accessToken, refreshToken
            }
        });
    }
)

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    const { accessToken } = await authService.tokenRefresh(refreshToken);
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000 //1d
    });

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Token refresh successful",
        data: { accessToken }
    })
});

const logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Logout Success",
        data: {}
    })
}

const changeMyPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const payload = req.body;
        await authService.changeMyPassword(payload, userId as string);
        sendResponse(res, {
            success: true,
            statusCode: status.OK,
            message: "Password updated",
            data: {}
        })
    }
)
export const authController = {
    loginUser,
    refreshToken,
    logout,
    changeMyPassword
}