import chalk from "chalk";
import mongoose from "mongoose";
import dns from "node:dns/promises"

dns.setServers(["1.1.1.1","8.8.8.8"])

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!,{dbName:"realestate"})
        console.log(chalk.green(`[+] Connected to ${conn.connection.name}`));
    } catch (error) {
        console.error(chalk.red(`[-] Error: ${error}`));        
    }
}

export default connectDB;