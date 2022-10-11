const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");

beforeAll(() => seed(data));

afterAll(() => {
  if (db.end) db.end();
});

describe("Error handling - invalid endpoint", () => {
  describe("Error handling - invalid input", () => {
    test("should respond with 400 error if invalid input recieved", () => {
      return request(app)
        .get("/api/reviews/bananas")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid input");
        });
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

    test("response should be a review object which should have the properties: review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at", () => {
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
          expect(users).toEqual([
            {
              username: 'mallionaire',
              name: 'haz',
              avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
            },
            {
              username: 'philippaclaire9',
              name: 'philippa',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            },
            {
              username: 'bainesface',
              name: 'sarah',
              avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
            },
            {
              username: 'dav3rid',
              name: 'dave',
              avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
            }
          ]);
        });
    });
  });
});
