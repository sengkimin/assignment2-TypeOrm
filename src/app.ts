import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/data-source";
import telegramBot from "node-telegram-bot-api";
import { DataSource } from "typeorm";
import { Teacher } from "./entity/Teacher";
import { Student } from "./entity/Student";
import { Class } from "./entity/Class";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3050;

app.get("/", (req: Request, res: Response) => {
  res.send(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  throw new Error("Telegram Bot Token not provided!");
}

const bot = new telegramBot(token, { polling: true });

const commands = [
  { command: "/start", description: "List available bot commands" },
  { command: "/student", description: "Get a list of students" },
  { command: "/teacher", description: "Get a list of teachers" },
  { command: "/class", description: "Get a list of classes" },
];

bot.setMyCommands(commands).then(() => console.log("Commands set successfully"));

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  let response = "Welcome! Here are the available commands:\n\n";
  commands.forEach((cmd) => {
    response += `${cmd.command} - ${cmd.description}\n`;
  });
  bot.sendMessage(chatId, response);
});

bot.onText(/\/student/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const students = await AppDataSource.getRepository(Student).find({ take: 10 });

    if (students.length > 0) {
      let message = "Here are the students:\n\n";
      students.forEach((student, index) => {
        message += `${index + 1}. ${student.firstName} ${student.lastName}\n`;
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
    const teachers = await AppDataSource.getRepository(Teacher).find({ take: 10 });

    if (teachers.length > 0) {
      let message = "Here are the first teachers:\n\n";
      teachers.forEach((teacher, index) => {
        message += `${index + 1}. ${teacher.firstName} ${teacher.lastName}\n`;
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

bot.onText(/\/class/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const classes = await AppDataSource.getRepository(Class).find({ take: 10 });

    if (classes.length > 0) {
      let message = "Here are the available classes:\n\n";
      classes.forEach((cls, index) => {
        message += `${index + 1}. ${cls.className}\n`;
      });
      bot.sendMessage(chatId, message);
    } else {
      bot.sendMessage(chatId, "No classes found.");
    }
  } catch (error) {
    console.error("Error fetching classes:", error);
    bot.sendMessage(chatId, "An error occurred while fetching class data.");
  }
});

AppDataSource.initialize()
  .then(() => {
    console.log("Connection initialized with database...");
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log("Database connection error:", error));

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
