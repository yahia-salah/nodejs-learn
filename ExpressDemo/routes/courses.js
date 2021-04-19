const express = require('express');
const router = express.Router();

// Datasource //
const courses = [
    { id: 1, name: "One" },
    { id: 2, name: "Two" },
    { id: 3, name: "Three" }
];

router.get('/', (req, res) => {
    //res.setHeader('Content-Type', 'application/json');
    res.send(courses);
});

router.get('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (course) {
        res.send(course);
    }
    else
        res.status(404).send('Course not found!');
})

router.post('/', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        let errorMessages = error.details.map(x => x.message);
        res.status(400).send(errorMessages);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.setHeader('Content-Type', 'application/json');
    res.send(course);
});

router.put('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course not found!');
        return;
    }

    const { error } = validateCourse(req.body);
    if (error) {
        let errorMessages = error.details.map(x => x.message);
        res.status(400).send(errorMessages);
        return;
    }

    course.name = req.body.name;
    //res.setHeader('Content-Type', 'application/json');
    res.send(course);
});

router.delete('/:id', (req, res) => {
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if (!course) {
        res.status(404).send('Course not found!');
        return;
    }

    let courseIndex = courses.indexOf(course);
    courses.splice(courseIndex, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        id: Joi.number().optional(),
        name: Joi.string().min(3).required()
    });
    return schema.validate(course, { abortEarly: false });
}

module.exports = router;