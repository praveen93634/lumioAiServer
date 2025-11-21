import  * as mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
    UserId?:string;
    email?:string;
    name?:string;
    password?:string;
    Avatar?:string;
    location:string;
    mobile?:Number;
    bio:string;
    createdAt:Date;
    isDeleted?:boolean;
    picture?:string;
}

const userSchema=new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId, required:true,auto:true}, 
    UserId:{type:String, required:false},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:false},
    Avatar:{type:String,required:false},
    mobile:{type:Number,required:false},
    location:{type:String,required:false},
    bio:{type:String,required:false},
    name:{type:String,required:true},
    isDeleted:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now},
    picture:{type:String,required:false}
})
const User = mongoose.model("User", userSchema);
export default User;
