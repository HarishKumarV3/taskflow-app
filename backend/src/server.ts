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

app.listen(2020, () => {
  console.log("Server running on http://localhost:2020");
});
