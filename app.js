// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsMockDatabase = assignments;
let commentsMockDatabase = comments;

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignments = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignments,
  });
});

app.get("/assignments/:assignmentId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  let assignmentData = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );
  return res.json({
    data: assignmentData[0],
  });
});

app.post("/assignments", function (req, res) {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});

app.delete("/assignments/:assignmentId", function (req, res) {
  let assignmentIdFromClient = Number(req.params.assignmentId);
  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.status(401).json({
      message: "Cannot delete, No data available!",
    });
  }

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });
  assignmentsMockDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient} has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentsId", function (req, res) {
  const assignmentIdFromClient = Number(req.params.assignmentsId);

  const updateAssignmentData = {
    ...req.body,
  };

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.status(401).json({
      message: "Cannot update, No data available!",
    });
  }

  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...updateAssignmentData,
  };

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
  });
});

app.get("/assignments/:assignmentId/comments", function (req, res) {
  let commentIdFromClient = Number(req.params.assignmentId);
  let commentData = commentsMockDatabase.filter(
    (item) => item.id === commentIdFromClient
  );
  return res.json({
    message: "Complete fetching comments",
    data: commentData[0],
  });
});

app.post("/assignments/:assignmentId/comments", function (req, res) {
  commentsMockDatabase.push({
    id: commentsMockDatabase[commentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New comment has been created successfully",
  });
});
