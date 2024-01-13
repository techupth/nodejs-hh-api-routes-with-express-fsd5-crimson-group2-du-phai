import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentMockDatabase = [...assignments];
let commentsMockDatabase = [...comments];

const app = express();
const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Server is running at ${port}`));

// ระบบที่จะดูข้อมูล assignment ทั้งหมด แต่ลิมิตไม่เกิน 10
app.get("/assignments", (req, res) => {
  const limit = req.query.limit;
  if (limit > 10) {
    return res.status(401).json({
      message: `Invalid request: limit must not exceed 10 assignments`,
    });
  }

  const assignmentsDatabase = assignmentMockDatabase.slice(0, limit);
  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsDatabase,
  });
});

// ระบบที่ไว้เรียกดู assignment ด้วย id
app.get("/assignments/:assignmentId", (req, res) => {
  // เอา id จากผู้ใช้มาก่อน
  let assignmentIdFromclient = Number(req.params.assignmentId);

  // เอามากรองใหม่
  let assignmentById = assignmentMockDatabase.filter((item) => {
    return item.id == assignmentIdFromclient;
  });
  // ถ้าหาไอดีไม่เจอ ให้แสดง
  if (!assignmentById[0]) {
    return res.json({
      massage: `Not found data`,
    });
  }

  // ส่ง respond id นั้นกลับไปให้ ผู้ใช้
  return res.json({
    data: assignmentById[0],
  });
});

// ระบบที่ไว้สร้าง assignment
app.post("/assignments", function (req, res) {
  // สร้าง variable มาเก็บข้อมูล body ที่ client จะสร้าง
  let newAssignmentFromClient = req.body;
  assignmentMockDatabase.push({
    id: assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1,
    ...newAssignmentFromClient,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});

// ระบบไว้ลบ assignment ด้วย id
app.delete("/assignments/:assignmentId", function (req, res) {
  // เก็บ id ที่ผู้ใช้ต้องการลบ
  let assignmentIdFromClient = Number(req.params.assignmentId);

  // เช็คก่อนว่ามี id ที่จะลบไหม
  const hasFound = assignmentMockDatabase.find(
    (item) => item.id === assignmentIdFromClient
  );
  // ใส่เงื่อนไขเข้าไป ถ้าไม่มี
  if (!hasFound) {
    return res.json({
      message: "no data found",
    });
  }
  // เอามาคัดกรอง
  const newAssignments = assignmentMockDatabase.filter((item) => {
    // return ที่ไม่ใช่ id ที่กรอกเข้ามา ด้วย !==
    return item.id !== assignmentIdFromClient;
  });
  // เอามา reassign ใหม่ เพื่อ update ข้อมูล
  assignmentMockDatabase = newAssignments;
  // response กลับไปหาผู้ใช้
  return res.json({
    message: "Assignment has been deleted successfully",
  });
});

// ระบบAPI ที่เอาไว้แก้ไขโพสต์
app.put("/assignments/:assignmentId", (req, res) => {
  // เก็บ id ที่user ส่งเข้ามา จะได้รู้ว่า update id ไหน
  let assignmentIdFromClient = Number(req.params.assignmentId);

  // พอได้id แล้วต่อไปต้องหา Index เพราะใน data มันเป็น Array
  const assignmentIndex = assignmentMockDatabase.findIndex(
    (item) => item.id === assignmentIdFromClient
  );

  // ทำการ Reassign Index นั้นๆ
  assignmentMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...req.body,
  };

  // Response ข้อความกลับไปหา Client
  res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
  });
});

// ระบบหา comment ด้วย id ของ assignment
app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let commentIdFromClient = Number(req.params.assignmentsId);

  const commentData = commentsMockDatabase.find(
    (item) => item.id === commentIdFromClient
  );

  return res.json({
    data: commentData,
  });
});

// ระบบเพิ่ม comment เข้าไปใน Assignment
app.post("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentIdFromclient = Number(req.params.assignmentsId);

  const commentData = {
    id: commentsMockDatabase[commentsMockDatabase.length - 1].id + 1,
    ...req.body,
  };

  //validate ก่อนว่ามี Assignment นั้นไหม
  const hasAssignment = assignmentMockDatabase.find(
    (item) => item.id === assignmentIdFromclient
  );
  // ถ้าไม่มี
  if (!hasAssignment) {
    return res.json({
      message: "No assignment to add comment",
    });
  }

  // เพิ่มcomment ใหม้เข้าไป
  commentsMockDatabase.push(commentData);

  return res.json({
    message: `New comment of assignment id ${assignmentIdFromclient} has been created successfully`,
  });
});
