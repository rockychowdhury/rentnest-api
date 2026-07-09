import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"





const createUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)


const getAllUsers = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)

const getUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
const updateUserStatusById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
const softDeleteUserById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
const updateMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)
const getMyProfile = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {

    }
)

export const userController = {
    getAllUsers,
    getMyProfile,
    getUserById,
    updateUserStatusById,
    updateMyProfile,
    softDeleteUserById,
    createUser
}