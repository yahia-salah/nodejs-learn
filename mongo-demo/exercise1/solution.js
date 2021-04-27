const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/mongo-exercises")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Error", err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function getCoursesOfExercise1() {
  return await Course.find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function getCoursesOfExercise2() {
  return await Course.find({
    isPublished: true,
    tags: { $in: ["backend", "frontend"] },
  })
    .sort({ price: -1 })
    .select({ name: 1, author: 1, price: 1 });
}

async function getCoursesOfExercise3() {
  return await Course.find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort("-price")
    .select("name author price");
}

async function run() {
  console.log("Solution1:\n", await getCoursesOfExercise1());
  console.log("Solution2:\n", await getCoursesOfExercise2());
  console.log("Solution3:\n", await getCoursesOfExercise3());
}

run();
