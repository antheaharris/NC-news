process.env.NODE_ENV = "test";

const { expect } = require("chai");
const request = require("supertest");
const app = require("../app.js");
const connection = require("../db/connection");

describe("/", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe.only("/api", () => {
    describe("/topics", () => {
      it("GET status:200 - responds with array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.contain.keys("description", "slug");
          });
      });
    });
    describe("/users", () => {
      it("GET /:username - status:200 - responds with user object that corresponds with the given username endpoint", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.eql({
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny"
            });
          });
      });
    });
  });
});
