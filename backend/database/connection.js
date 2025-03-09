import mongoose from "mongoose";

console.log("mongo url",process.env.MONGO_URI)
export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "bidding-platform",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};
