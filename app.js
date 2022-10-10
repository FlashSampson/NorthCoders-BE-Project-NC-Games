const express = require("express");
const app = express();
const { getCategories } = require("./controllergit ");

app.get('/api/categories', getCategories)