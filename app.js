const express = require("express");
const app = express();
const { getTreasures } = require("./controllers");

app.get('/api/categories', getCategories)