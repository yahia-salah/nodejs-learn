const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const _ = require("lodash");
const mongoose = require("mongoose");
let server;

describe("/api/genres", () => {
  beforeEach(() => {
    server = require("../../../../index");
  });

  afterEach(async () => {
    if (server) await server.close();
    await Genre.deleteMany({});
  });

  describe("GET /", () => {
    it("should return all genres", async () => {
      const genres = [{ name: "genre1" }, { name: "genre2" }];
      await Genre.insertMany(genres);
      const res = await request(server).get("/api/genres");
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.map((a) => _.pick(a, ["name"]))).toEqual(
        expect.arrayContaining(genres)
      );
    });
  });

  describe("GET /:id", () => {
    it("should return genre with given id", async () => {
      const genre = await Genre.create({ name: "genre1" });
      const res = await request(server).get(`/api/genres/${genre._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe("genre1");
    });

    it("should return 400 for invalid genre id", async () => {
      const res = await request(server).get(`/api/genres/${123}`);
      expect(res.statusCode).toBe(400);
    });

    it("should return 404 for valid genre id but not matching genre", async () => {
      const res = await request(server).get(
        `/api/genres/${new mongoose.Types.ObjectId()._id}`
      );
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path, and then in each test, we change one parameter
    // that clearly aligns with the name of test.
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if user not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.statusCode).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.statusCode).toBe(400);
    });

    it("should return 400 if genre name is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.statusCode).toBe(400);
    });

    it("should save genre if it is valid", async () => {
      const res = await exec();

      const genre = await Genre.find({ name });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.name).toBe(name);
      expect(genre).not.toBeNull();
    });
  });

  describe("PUT /:id", () => {
    let token;
    let id;
    let name;
    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      const genre = await Genre.create({ name: "genreOld" });
      token = new User().generateAuthToken();
      name = "genreNew";
      id = genre._id;
    });

    it("should return 401 if user not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.statusCode).toBe(401);
    });

    it("should return 400 if genre name is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.statusCode).toBe(400);
    });

    it("should return 404 if genre doesn't exist", async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.statusCode).toBe(404);
    });

    it("should update genre", async () => {
      const res = await exec();

      const genre = await Genre.find({ name });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe(name);
      expect(genre).not.toBeNull();
    });
  });

  describe("DELETE /:id", () => {
    let token;
    let id;
    let isAdmin;
    const exec = async () => {
      if (!isAdmin)
        token = new User({
          id: mongoose.Types.ObjectId().toHexString(),
          isAdmin,
        }).generateAuthToken();
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token);
    };

    beforeEach(async () => {
      isAdmin = true;
      const genre = await Genre.create({ name: "genre1" });
      token = new User({
        id: mongoose.Types.ObjectId().toHexString(),
        isAdmin,
      }).generateAuthToken();
      id = genre._id;
    });

    it("should return 401 if user not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.statusCode).toBe(401);
    });

    it("should return 403 if user not admin", async () => {
      isAdmin = false;

      const res = await exec();

      expect(res.statusCode).toBe(403);
    });

    it("should return 404 if genre doesn't exist", async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.statusCode).toBe(404);
    });

    it("should delete genre", async () => {
      const res = await exec();

      const genre = await Genre.findById(id);

      expect(res.statusCode).toBe(200);
      expect(genre).toBeNull();
    });
  });
});
