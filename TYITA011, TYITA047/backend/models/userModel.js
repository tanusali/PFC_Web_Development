import mongoose from "mongoose";
const userSchmea=mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true,unique:true},
        password:{type:String,required:true,unique:true},
        isAdmin:{type:Boolean,default:false,required:true}
    },
    {
        timestamps:true
    }
)
const User=mongoose.model('User',userSchmea)
export default User