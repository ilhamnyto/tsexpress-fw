import express from "express";
import {
  CustomError,
  UpdateUserRequest,
  DataResponse,
  UpdatePasswordRequest,
  CustomRequest,
} from "../schema";
import {
  allUserServices,
  getUserByUsernameServices,
  myProfileServices,
  searchUserServices,
  updatePasswordServices,
  updateProfileServices,
} from "../services/users";
import { redisClient } from "../config";

export const allUserController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const cursor = req.query.cursor;
    let users;
    if (typeof cursor == "string") {
      users = await allUserServices(cursor);
    } else {
      users = await allUserServices("");
    }
    const resp: DataResponse = {
      code: 203,
      data: { users: users.data },
      paging: users.paging,
    };

    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};

export const userByUsernameController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const user = await getUserByUsernameServices(req.params.username);

    const resp: DataResponse = {
      code: user ? 203 : 404,
      data: {
        user,
      },
    };

    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};

export const searchUserController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    let keyword = req.query.query;
    let cursor = req.query.cursor;
    let users;
    if (typeof keyword != "string") {
      keyword = "";
    }
    if (typeof cursor != "string") {
      cursor = "";
    }

    users = await searchUserServices(keyword, cursor);
    const resp: DataResponse = {
      code: 203,
      data: { users: users.data },
      paging: users.paging,
    };

    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};

export const myProfileController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    let user = await redisClient.get(`profile:${req.userId}`);

    if (!user) {
      user = await myProfileServices(req.userId);
      await redisClient.set(`profile:${req.userId}`, JSON.stringify(user));
      await redisClient.expire(`profile:${req.userId}`, 180);
    } else {
      user = JSON.parse(user);
    }

    const resp: DataResponse = {
      code: user ? 203 : 404,
      data: {
        user,
      },
    };

    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};

export const updateProfileController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const updateReq: UpdateUserRequest = {
      firstName: req.body.first_name,
      lastName: req.body.last_name,
      phoneNumber: req.body.phone_number,
      location: req.body.location,
    };

    await updateProfileServices(req.userId, updateReq);
    const resp: DataResponse = {
      code: 203,
      data: {
        message: "Profile updated successfully.",
      },
    };

    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};

export const updatePasswordController = async (
  req: CustomRequest,
  res: express.Response
) => {
  try {
    const updateReq: UpdatePasswordRequest = {
      password: req.body.password,
      confirmPassword: req.body.confirm_password,
    };

    await updatePasswordServices(req.userId, updateReq);
    const resp: DataResponse = {
      code: 203,
      data: {
        message: "Password updated successfully.",
      },
    };
    
    return res.status(resp.code).json(resp);
  } catch (error) {
    const custErr: CustomError = {
      code: 500,
      message: "INTERNAL SERVER ERROR",
      additionalInfo: error.message,
    };

    return res.status(custErr.code).json(custErr);
  }
};
