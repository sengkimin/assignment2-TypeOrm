import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source"
import telegramBot from "node-telegram-bot-api";
import { DataSource } from "typeorm";
import { Teacher } from "./entity/Teacher";
import { Student } from "./entity/Student";


// Load environment variables
dotenv.config();

const app = express();
AppDataSource.initialize()
.then(()=>{
  console.log("Data Source has been initialized")
}
)
.catch((err)=>{
  console.error("Error during Data Source initialization", err)
  })


// Middleware
app.use(express.json());

// Default Route
app.get("/", (req: Request, res: Response) => {
  res.send(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Start Server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error("Telegram Bot Token not provided!");
}

const bot = new telegramBot(token, { polling: true });

// Define the command list
const commands = [
  { command: "/start", description: "Start the bot and get command list" },
  { command: "/student", description: "Get help and usage instructions" },
  { command: "/teacher", description: "Get contact information" },
  { command: "/class", description: "See current promotions" },
 
];

// Set bot commands in Telegram
bot
  .setMyCommands(commands)
  .then(() => console.log("Commands set successfully"));

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  let response = "Welcome! Here are the available commands:\n\n";
  commands.forEach((cmd) => {
    response += `${cmd.command} - ${cmd.description}\n`;
  });
  bot.sendMessage(chatId, response);
});

// Handle other commands
bot.onText(/\/student/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const students = await AppDataSource.getRepository(Student).find({
      take: 10, // Limit to 10 students
    });

    if (students.length > 0) {
      let message = "Here are the first 10 students:\n\n";
      students.forEach((student, index) => {
        message += `${index + 1}. ${student.firstName} ${student.lastName} (${student.email})\n`;
      });

      bot.sendMessage(chatId, message);
    } else {
      bot.sendMessage(chatId, "No students found.");
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    bot.sendMessage(chatId, "An error occurred while fetching student data.");
  }
});

bot.onText(/\/teacher/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const teachers = await AppDataSource.getRepository(Teacher).find({
      take: 10, // Limit to 10 teachers
    });

    if (teachers.length > 0) {
      let message = "Here are the first 10 teachers:\n\n";
      teachers.forEach((teacher, index) => {
        message += `${index + 1}. ${teacher.firstName} ${teacher.lastName} (${teacher.email})\n`;
      });

      bot.sendMessage(chatId, message);
    } else {
      bot.sendMessage(chatId, "No teachers found.");
    }
  } catch (error) {
    console.error("Error fetching teachers:", error);
    bot.sendMessage(chatId, "An error occurred while fetching teacher data.");
  }
});

bot.onText(/\/class/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "This bot allows you to access various features. Use /start to see available commands."
  );
});

const PORT = process.env.PORT || 3050;

AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000): Promise<DataSource> => {
  if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (AppDataSource.isInitialized) resolve(AppDataSource);
      else reject("Failed to create connection with database");
    }, delay);
  });
};

export default app;


