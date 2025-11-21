import * as mongoose from "mongoose";
export interface ConnectionRequestDocument extends mongoose.Document{
    fromuserid?:mongoose.Types.ObjectId;
    toUserid?:mongoose.Types.ObjectId;
    status?:string;
    createdAt?:Date;
    updatedAt?:Date;
}
const connectionReqSchema=new mongoose.Schema({ 
    fromuserid:{type:mongoose.Types.ObjectId,ref:'User'},
    toUserid:{type:mongoose.Types.ObjectId,ref:'User'},
    status:{type:String,enum:{
      values:['ignore','connect','accepted','rejected'],
      message:"{VALUE} is incorrect status type"
    }},
  },{
    timestamps:true
  })
  connectionReqSchema.pre("save",function(next){
    const connectionReq=this;
    if(String(connectionReq.fromuserid) === String(connectionReq.toUserid)){
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
  })

  const ConnectionRequest=mongoose.model("ConnectionRequest",connectionReqSchema);
  export default ConnectionRequest;