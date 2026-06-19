import chalk from "chalk";
import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!,{dbName:"realestate"})
        console.log(chalk.green(`[+] Connected to ${conn.connection.name}`));
    } catch (error) {
        console.error(chalk.red(`[-] Error: ${error}`));        
    }
}

export default connectDB;