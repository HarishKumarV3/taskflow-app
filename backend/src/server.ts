import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.static(
    path.join(__dirname, "../../frontend")
  )
);

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 2020;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

