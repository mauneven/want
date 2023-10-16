const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const reportRoutes = require("./routes/reportRoutes");
const User = require("./models/user");
const offerRoutes = require("./routes/offerRoutes");
const docxRoutes = require("./routes/docxRoutes.js");
const authController = require("./controllers/authController");
const https = require("https");
const http = require("http");
const fs = require("fs");
const schedule = require("node-schedule");
const Report = require("./models/report");
const Post = require("./models/post");
const postController = require("./controllers/postController");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { getWss } = require("./controllers/webSocket");
const { initializeWss } = require("./controllers/webSocket");

app.use(
  cors({
    origin: ["https://want.com.co", "http://localhost:3000", "http://localhost:8081"],
    credentials: true,
  })
);

app.use("/uploads", express.static("uploads"));
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://mauneven:admin123@want.oik7qz6.mongodb.net/want?retryWrites=true&w=majority",
      autoRemove: "native",
      touchAfter: 24 * 3600,
      ttl: 14 * 24 * 60 * 60,
      autoRemoveInterval: 10,
      crypto: {
        secret: "squirrel",
        algorithm: "aes256",
        encoding: "hex",
      },
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "None" : "None", // Cambio aquí
      secure: process.env.NODE_ENV === "production", // Asegura la cookie en producción
    },
  })
);

app.use(async (req, res, next) => {
  const userId = req.session.userId;
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      req.user = user;
    } else {
      delete req.session.userId;
    }
  }
  next();
});

app.use("/api", userRoutes);
app.use("/api", postRoutes);
app.use("/api", offerRoutes);
app.use("/api", docxRoutes);
app.use("/api", reportRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(500).send("Something broke!");
  }
});

// Tarea para eliminar los reportes antiguos
schedule.scheduleJob("0 */12 * * *", async () => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Establecer el día al 1 para evitar problemas con diferentes días del mes
    sixMonthsAgo.setDate(1);

    const oldReports = await Report.find({ createdAt: { $lt: sixMonthsAgo } });

    // Elimina los reportes encontrados
    for (const report of oldReports) {
      await Report.deleteOne({ _id: report._id });
    }
  } catch (err) {
    console.error("Error al eliminar los reportes antiguos:", err);
  }
});

// Tarea para eliminar los posts después de 30 días
schedule.scheduleJob("0 */12 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldPosts = await Post.find({ createdAt: { $lt: thirtyDaysAgo } });

    // Elimina los posts encontrados
    for (const post of oldPosts) {
      await postController.deletePostById(post._id);
    }
  } catch (err) {
    console.error("Error al eliminar los posts antiguos:", err);
  }
});

// Tarea para eliminar las cuentas después de 30 días
schedule.scheduleJob("0 */12 * * *", async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usersToDelete = await User.find({
      isDeleted: true,
      putUpForElimination: { $lt: thirtyDaysAgo },
    });

    for (const user of usersToDelete) {
      await authController.deletionPass(user._id);
    }
  } catch (err) {
    console.error("Error al eliminar las cuentas de usuario:", err);
  }
});

// para main
/*const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/want.com.co/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/want.com.co/fullchain.pem')
};

const server = https.createServer(options, app);
initializeWss(server);

server.listen(4000, () => {
  console.log('Server started on port 4000');
});

*/

// para development

const server = http.createServer(app);

initializeWss(server);

server.listen(4000, () => {
  console.log("Server started on port 4000");
});
