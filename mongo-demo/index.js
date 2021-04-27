const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Error", err.message));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    author: "Mosh",
    tags: ["node", "backend"],
    isPublished: false,
  });
  const result = await course.save();
  console.log("Result", result);
}

async function updateCourseWithQuery(id) {
  const course = await Course.findById(id);
  if (!course) return;
  course.author = "Another Author";
  course.isPublished = true;
  const result = await course.save();
  console.log("Result", result);
}

async function updateCourseWithoutQuery(id) {
  const result = await Course.updateOne(
    { _id: id },
    {
      $set: {
        author: "Yahia",
        isPublished: true,
      },
    }
  );
  console.log("Result", result);
}

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log("Result", result);
}

async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function getCourses(author, isPublished) {
  const courses = await Course.find({
    author: author,
    isPublished: isPublished,
  })
    .limit(10) // like top 10
    .sort({ name: 1 }) // 1 asc, -1 desc
    .select({ name: 1, tags: 1 }); // select which columns to return
  // .count()
  console.log(courses);
}

// Comparison Operators
// .find({price:{$gte:10}}) -> price >= 10
// .find({price:{$gt:10}}) -> price > 10
// .find({price:{$lte:10}}) -> price <= 10
// .find({price:{$lt:10}}) -> price < 10
// .find({price:{$eq:10}}) .find({price:10}) -> price = 10
// .find({price:{$ne:10}}) -> price <> 10
// .find({price:{$in:[10,20,30]}}) -> price in (10,20,30)
// .find({price:{$in:[10,20,30]}}) -> price not in (10,20,30)

// Logical Operators
// .find().or([{author:'Mosh'},{author:'Yahia'}])
// .find().and([{author:'Mosh'},{isPublished:true}])
// .find().or(...).and(...)

// Regex
// .find({author:/^Mosh/}) -> like 'Mosh%'
// .find({author:/^Mosh/i}) -> case insensitive
// .find({author:/Hamadani$/}) -> like '%Hamadani'
// .find({author:/.*Mosh.*/}) -> like '%Mosh%'

// createCourse();
// getCourses();
// getCourses("Mosh", false);
// updateCourseWithQuery("607efbe05223ff489c79fd25");
// updateCourseWithoutQuery("607efbe05223ff489c79fd25");
removeCourse("607efbe05223ff489c79fd25");
