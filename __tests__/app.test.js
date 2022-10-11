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
});
