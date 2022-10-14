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

    describe('Get comments err handling', () => {
      test('should respond with 404 err results if review doesnt exist', () => {
        return request(app)
          .get("/api/reviews/1000/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
      });

      test('should respond with err code if 400 invalid review_id provided', () => {
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

    describe("GET /api/reviews", () => {
      test(`Should respond with a reviews array of review objects, each of which should have the following properties:
      owner, title, review_id, category, review_img_url, created_at, votes, designer, comment count`, () => {
        return request(app)
          .get(`/api/reviews`)
          .expect(200)
          .then(({ body: reviews }) => {
            expect(reviews.length).toBe(13);
            expect(Array.isArray(reviews)).toBe(true);
            expect(reviews[0]).toEqual({
              owner: "mallionaire",
              review_id: 7,
              title: "Mollit elit qui incididunt veniam occaecat cupidatat",
              category: "social deduction",
              designer: "Avery Wunzboogerz",
              review_body:
                "Consectetur incididunt aliquip sunt officia. Magna ex nulla consectetur laboris incididunt ea non qui. Enim id eiusmod irure dolor ipsum in tempor consequat amet ullamco. Occaecat fugiat sint fugiat mollit consequat pariatur consequat non exercitation dolore. Labore occaecat in magna commodo anim enim eiusmod eu pariatur ad duis magna. Voluptate ad et dolore ullamco anim sunt do. Qui exercitation tempor in in minim ullamco fugiat ipsum. Duis irure voluptate cupidatat do id mollit veniam culpa. Velit deserunt exercitation amet laborum nostrud dolore in occaecat minim amet nostrud sunt in. Veniam ut aliqua incididunt commodo sint in anim duis id commodo voluptate sit quis.",
              review_img_url:
                "https://images.pexels.com/photos/278888/pexels-photo-278888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
              created_at: "2021-01-25T11:16:54.963Z",
              votes: 9,
              comment_count: "0",
            });
          });
      });
      test("Reviews should be sorted by date in descending order", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body: reviews }) => {
            expect(reviews).toBeSortedBy("created_at", { descending: true });
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

    describe("GET /api/reviews/:review_id/comments", () => {
      test(`Should respond with array of an array of comments for the given review_id of which each comment 
  should have the following properties: comment_id, votes, created_at, author, body, review_id`, () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .then(({ body: comments }) => {
            comments.forEach((comment) => {
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

      test("Comments should be served with the most recent comments first ", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .expect(200)
          .then(({ body: comments }) => {
            expect(comments).toBeSortedBy("created_at", { descending: true });
          });
      });
    });

    describe("PATCH /api/reviews/:review_id", () => {
      test("request body accepts object in correct format and should respond with updated review object", () => {
        return request(app)
          .patch("/api/reviews/3")
          .send({ inc_votes: 1 })
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
              votes: 6,
            });
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
});
