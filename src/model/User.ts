import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document{ // here we define typescript  #yaha humne apne model ka datatype define kiya hai 
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})



export interface User extends Document{ // here we define typescript  #yaha humne apne model ka datatype define kiya hai 
    username: string;
    email: string;
    password: string;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[]
}


const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username  is required"],
        trim: true,
        unique: true,
    },

    email: {
        type: String,
        required: [true,"Email  is required"],
        unique: true,
        match: [/.+\@.+\..+/,'please use a valid email address']
    },

    password: {
        type: String,
        required: [true,"Password  is required"],
    },

    isVerified: {
        type: Boolean,
        default: true,
    },

    isAcceptingMessages: {
        type: Boolean,
        default: true,
    },

    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", UserSchema))

export default UserModel;