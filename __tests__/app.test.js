const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeAll(() => seed(data));

afterAll(() => {
  if (db.end) db.end();
});

describe("Error handling", () => {
  describe("POST error handling - invalid data type", () => {
    test("should respond with 400 error if empty input recieved", () => {
      const newComment = {
        username: 21,
        body: 69,
      };
      return request(app)
        .post("/api/reviews/:review_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
    });

    test("should respond with 400 error if empty input recieved", () => {
      const newComment = {
        username: "",
        body: "",
      };
      return request(app)
        .post("/api/reviews/:review_id/comments")
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
    });
  });

  describe("PATCH error handling - invalid data type", () => {
    test("should respond with 400 error if invalid input recieved", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "bananas" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
    });

    test("should respond with an error if empty object passed in", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("no input detected");
        });
    });

    test("should respond with an error non existent ID provided", () => {
      return request(app)
        .patch("/api/reviews/1000")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });

    describe("GET comments err handling", () => {
      test("should check review exists before invoking model", () => {
        return request(app)
          .get("/api/reviews/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("review not found");
          });
      });

      test("should respond 404 not found if no comments exist", () => {
        return request(app)
          .get("/api/reviews/14/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.msg).toBe("no comment found");
          });
      });

      test("should respond with err code if 400 invalid review_id provided", () => {
        return request(app)
          .get("/api/reviews/fish/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid input");
          });
      });
    });

    describe("GET reviews query error handling", () => {
      test("should respond with no matching results if category doesnt exist", () => {
        return request(app)
          .get("/api/reviews?category=non_existent")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("no matching results");
          });
      });
    });

    describe("GET error handling", () => {
      test("should respond with 400 error if invalid input recieved", () => {
        return request(app)
          .get("/api/reviews/bananas")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("invalid input");
          });
      });

      test("should respond with 404 server error if incomplete path recieved", () => {
        return request(app)
          .get("/notARoute")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("route not found");
          });
      });
    });
  });
});
describe("API happy path testing", () => {
  describe("GET /api/categories", () => {
    test("should respond with status 200 ", () => {
      return request(app).get("/api/categories").expect(200);
    });
    test('an array of category objects, each of which should have the properties: "slug" & "description" ', () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: categories }) => {
          expect(typeof categories).toBe("object");
          categories.forEach((category) => {
            expect(Object.keys(category)).toHaveLength(2);
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    describe(" GET /api/reviews/:review_id", () => {
      test("return an object ", () => {
        return request(app)
          .get("/api/reviews/1")
          .then(({ body: review }) => {
            expect(typeof review).toBe("object");
          });
      });

      test(`The response should be a review object which should have the properties: review_id, title, review_body, designer, review_img_url, votes, 
      category, owner, created_at and comment_count`, () => {
        return request(app)
          .get("/api/reviews/1")
          .then(({ body: review }) => {
            expect(typeof review).toBe("object");
            expect(review).toEqual({
              review_id: 1,
              title: "Agricola",
              category: "euro game",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_body: "Farmyard fun!",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              created_at: "2021-01-18T10:00:20.514Z",
              votes: 1,
              comment_count: 0,
            });
          });
      });
    });

    describe("GET /api/users", () => {
      test("should respond with an array of objects ", () => {
        return request(app)
          .get("/api/users")
          .then(({ body: users }) => {
            expect(Array.isArray(users)).toBe(true);
          });
      });
      test("should respond with an array of objects with the properties: username, name and avatar_url ", () => {
        return request(app)
          .get("/api/users")
          .then(({ body: users }) => {
            expect(users.length).toBe(4);
            expect(users).toEqual([
              {
                username: "mallionaire",
                name: "haz",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "philippaclaire9",
                name: "philippa",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "bainesface",
                name: "sarah",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "dav3rid",
                name: "dave",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ]);
          });
      });
    });

    describe(" GET /api/reviews/:review_id/comments", () => {
      test.only (`Should respond with an array of comments for the given review_id of which each comment should have the following 
      properties:
      -comment_id
      - votes
      - created_at
      - author which is the username from the users table
      - body
      - review_id `, () => {
        return request(app)
          .get(`/api/reviews/3/comments`)
          .expect(200)
          .then(({ body: comment }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                review_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
      });
    });

    describe("GET /api/reviews", () => {
      test(`Should respond with a reviews array of review objects, each of which should have the following properties:
      owner, title, review_id, category, review_img_url, created_at, votes, designer, comment count`, () => {
        return request(app)
          .get(`/api/reviews`)
          .expect(200)
          .then(({ body: reviews }) => {
            expect(Array.isArray(reviews)).toBe(true);
            reviews.forEach((review) => {
              expect(Object.keys(review)).toHaveLength(10);
              expect(review).toEqual(
                expect.objectContaining({
                  owner: expect.any(String),
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  category: expect.any(String),
                  designer: expect.any(String),
                  review_body: expect.any(String),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                  comment_count: expect.any(String),
                })
              );
            });
          });
      });

      test("Reviews should be sorted by date in descending order", () => {
        return request(app)
          .patch("/api/reviews/3")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body }) => {
            expect(body[0].votes).toBe(6);
          });
      });

      test(`should accept category query, which filters the reviews by the category value specified in the query. If the query is omitted the endpoint should respond with all reviews.`, () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body: reviews }) => {
            expect(reviews).toEqual([
              {
                owner: "philippaclaire9",
                review_id: 2,
                title: "Jenga",
                category: "dexterity",
                designer: "Leslie Scott",
                review_body: "Fiddly fun for all the family",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                comment_count: "3",
              },
            ]);
          });
      });
    });

    describe("PATCH /api/reviews/:review_id", () => {
      test("request body accepts object in correct format and should respond with updated review object", () => {
        return request(app)
          .patch("/api/reviews/13")
          .send({ inc_votes: 6 })
          .expect(200)
          .then(({ body }) => {
            expect(body[0].votes).toBe(22);
          });
      });
    });

    test("should accept negative numbers and decrement reviews by input value  ", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: -100 })
        .expect(200)
        .then(({ body }) => {
          expect(body[0]).toEqual({
            review_id: 3,
            title: "Ultimate Werewolf",
            category: "social deduction",
            designer: "Akihisa Okui",
            owner: "bainesface",
            review_body: "We couldn't find the werewolf!",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            created_at: "2021-01-18T10:01:41.251Z",
            votes: -94,
          });
        });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    test(`Request body accepts an object with the properties username and body`, () => {
      const newComment = {
        username: "bainesface",
        body: "What a next level game, best thing since Metal Gear Solid",
      };
      return request(app)
        .post("/api/reviews/4/comments")
        .expect(201)
        .send(newComment)
        .then(({ body: comment }) => {
          expect(Array.isArray(comment)).toBe(true);
          comment.forEach((comment) => {
            expect(Object.keys(comment)).toHaveLength(6);
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                review_id: expect.any(Number),
                author: expect.any(String),
                votes: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });
  });
});
