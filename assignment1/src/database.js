const { promises } = require("supertest/lib/test");

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./paper_management.db", (err) => {
  if (err) {
    console.error("Error connecting to database:", err);
  } else {
    console.log("Connected to SQLite database");

    db.run(
      `CREATE TABLE IF NOT EXISTS papers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        published_in TEXT NOT NULL,
        year INTEGER NOT NULL CHECK (year > 1900),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      (err) => {
        if (err) {
          console.error("Error creating papers table:", err);
        } else {
          console.log("Papers table ready");
        }
      }
    );
  }
});

// TODO: Implement these database operations
const dbOperations = {
  createPaper: async (paper) => {
    try {
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO papers (title, authors, published_in, year) VALUES (?, ?, ?, ?)`,
          [paper.title, paper.authors, paper.published_in, paper.year],
          function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
          }
        );
      });

      // Fetch the newly created paper to include timestamps
      return await new Promise((resolve, reject) => {

        db.get("SELECT * FROM papers WHERE id = ?", [result], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } catch (error) {
      throw error;
    }
  },

  getAllPapers: async (filters = {}) => {
    // Your implementation here
    // Remember to handle filters (year, published_in)
    try {
      let query = "SELECT * FROM papers WHERE 1=1";
      const params = [];

      if (filters.year) {
        query += " AND year = ?";
        params.push(filters.year);
      }

      if (filters.published_in) {
        // Force case-insensitive partial match
        query += " AND LOWER(published_in) LIKE LOWER(?)";
        params.push(`%${filters.published_in}%`);
      }

      query += " LIMIT ? OFFSET ?";
      params.push(filters.limit, filters.offset);

      const result = await new Promise((resolve, reject) => {

        db.all(query, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      return result;
    } catch (error) {
      throw error;
    }
  },

  getPaperById: async (id) => {
    // Your implementation here
    // Hint: Use await with a new Promise that wraps the db.get() operation
    try {
      const result =  await new Promise((resolve, reject) => {
        db.get("SELECT * FROM papers WHERE id = ?", [id], (err, row) => {
          if (err)
            reject(err);
          else
            resolve(row);
        });
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  updatePaper: async (id, paper) => {
    // Your implementation here
    try {
      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE papers
            SET title = ?, authors = ?, published_in = ?, year = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?;`,
          [paper.title, paper.authors, paper.published_in, paper.year, id],
          function (err) {
            if (err)
              reject(err);
            else
              resolve(this.changes);
          }
        );
      });

      // Get the updated paper
      const result =  await new Promise((resolve, reject) => {
        db.get("SELECT * FROM papers WHERE id = ?", [id], (err, row) => {
          if (err)
            reject(err);
          else
            resolve(row);
        });
      });
      return result;
    } catch (error) {
      throw error;
    }
  },

  deletePaper: async (id) => {
    // Your implementation here
  },
};

module.exports = {
  db, // export the database instance
  ...dbOperations, // spreads all operations as individual exports
};
