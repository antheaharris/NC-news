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
      it("GET topics - status:200 - responds with array of topic objects", () => {
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
      it("status: 404 - when given a username that doesn't exist", () => {
        return request(app)
          .get("/api/users/invalidName")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("username does not exist");
          });
      });
    });
    describe("/articles", () => {
      it("GET /:article_id - status:200 - responds with article object - inc comment_count", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.eql({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 100,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: "13"
            });
          });
      });
      it("status: 404 - when given an article_id that does not exist", () => {
        return request(app)
          .get("/api/articles/943789")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("article does not exist");
          });
      });
      it("status 400 - when given an invalid article_id", () => {
        return request(app)
          .get("/api/articles/notAnId")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal(
              'invalid input syntax for integer: "notAnId"'
            );
          });
      });
    });
  });
});
