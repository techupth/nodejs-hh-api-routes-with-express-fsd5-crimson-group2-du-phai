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
  assignmentMockDatabase.push({
    id: assignmentMockDatabase[assignmentMockDatabase.length - 1].id + 1,
    ...req.body,
  });
  return res.json({
    message: "New assignment has been created successfully",
  });
});
