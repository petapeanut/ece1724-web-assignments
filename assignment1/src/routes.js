const express = require("express");
const router = express.Router();
const db = require("./database");
const { validatePaper } = require("./middleware");

// GET /api/papers
router.get("/papers", async (req, res, next) => {
  try {
    const filters = {
      year: req.query.year ? parseInt(req.query.year) : null,
      published_in: req.query.published_in,
      limit: req.query.limit ? parseInt(req.query.limit) : 10,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    };

    // Your implementation here
    // 1. Input validation
    const errors = [];

    if (filters.year !== null && (isNaN(filters.year) || filters.year <= 1900)) {
      errors.push("Year must be an integer greater than 1900");
    }

    // Validate limit (default: 10, max: 100)
    if (filters.limit !== null && (isNaN(filters.limit) || filters.limit <= 0 || filters.limit > 100)) {
      errors.push("Limit must be a positive integer (max: 100)");
    }

    // Validate offset (default: 0)
    if (filters.offset !== null && (isNaN(filters.offset) || filters.offset < 0)) {
      errors.push("Offset must be a non-negative integer");
    }

    if (errors.length > 0) {
      return res.status(400).json({ error: "Validation Error", messages: errors });
    }

    const papers = await db.getAllPapers(filters);
    res.status(200).json(papers);
  } catch (error) {
    next(error);
  }
});

// GET /api/papers/:id
router.get("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// POST /api/papers
router.post("/papers", async (req, res, next) => {
  try {
    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }

    // Your implementation here
    const newPaper = await db.createPaper(req.body);
    res.status(201).json(newPaper);
  } catch (error) {
    next(error);
  }
});

// PUT /api/papers/:id
router.put("/papers/:id", async (req, res, next) => {
  try {
    const errors = validatePaper(req.body);
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ error: "Validation Error", messages: errors });
    }

    // Your implementation here
  } catch (error) {
    next(error);
  }
});

// DELETE /api/papers/:id
router.delete("/papers/:id", async (req, res, next) => {
  try {
    // Your implementation here
  } catch (error) {
    next(error);
  }
});

module.exports = router;
