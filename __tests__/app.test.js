const request = require("supertest");
const db = require("../db/index");
const app = require("../app");
const data =  require("../db/data/test-data");
const seed = require("../db/seed");


beforeAll(() => seed(data));

afterAll(() => {
  if (db.end) db.end();
});


describe('GET /api/categories', () => {
    test('should respond with status 200 ', () => {
        return request(app).get("/api/categories").expect(200);
    });
    test('an array of category objects, each of which should have the properties: "slug" & "description" ', () => {
        return request(app).get("/api/categories").expect(200);
    });
});