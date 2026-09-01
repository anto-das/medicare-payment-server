import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 5000;

function main() {
  try {
    prisma.$connect();
    console.log("medi store server connected successfully...");
    app.listen(PORT, () => {
      console.log("this server is running on port: ", PORT);
    });
  } catch (err) {
    console.error("error occurred", err);
    prisma.$disconnect();
    process.exit(1);
  }
}

main();


