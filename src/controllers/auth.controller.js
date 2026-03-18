import jwt from "jsonwebtoken"
import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * @name registerUserController
 * @description Registera new user with usename , email, password
 * @accessPublic
 */
async function registerUserController(req,res){
    const {username,email,password} = req.body
    if(!username || !email || !password){
      return res.status(400).json({message : "Please provide username,email and password"})
    }
    const isUserAlreadyExists = await userModel.findOne({$or:[
        {username},{email}
    ],
})
    if(isUserAlreadyExists){
        /**
         * isUserAlreadyExists.username == username 
         */
        return res.status(400).json({message:"User alredy exists"})
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username:username,
        email:email,
        password:hash
    })

    const token =  jwt.sign({id:user._id,username:user.username},process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(201).json({message:"User Created Successfully",
        user : {
            id:user._id,
            username:username,
            email:user.email
        }
    })



}

/**
 * @name loginUserController
 * @description Login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req,res){
    const {email,password} = req.body
    const user = await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }

    const isPasswordvalid = await bcrypt.compare(password,user.password)

    if(!isPasswordvalid){
        return res.status(400).json({message : "Invalid email or password"})
    }
    const token = jwt.sign(
    {user:user._id, username:user.username},
        process.env.JWT_SECRET,
    {expiresIn:"1d"}
)
    res.cookie("token",token)
    res.status(200).json({message:"User LoggedIn sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    }  
    )
}


export  {registerUserController,loginUserController}