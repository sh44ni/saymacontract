require("dotenv").config();
const fs = require("fs");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const puppeteer = require("puppeteer");
const { log, error } = require("console");
const { Pool } = require("pg");
const app = express();

const bodyParser = require("body-parser");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

// Change connection to Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.MONGO_URL, 
  ssl: {
    rejectUnauthorized: false // Neon requires SSL
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  console.log("Connected to PostgreSQL (Neon)");
  
  // Automatically create the usersData table
  client.query(`
    CREATE TABLE IF NOT EXISTS users_data (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255),
      date TIMESTAMP,
      alRaqaam NUMERIC,
      alHafza VARCHAR(255),
      raqamMadavnia VARCHAR(255),
      walad VARCHAR(255),
      hataf VARCHAR(255),
      aamla VARCHAR(255),
      jins VARCHAR(255),
      mastaqdam NUMERIC,
      khaldil VARCHAR(255),
      yadfa NUMERIC,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `, (err, result) => {
    release()
    if (err) {
      return console.error('Error creating table', err.stack)
    }
    console.log("users_data table is ready.");
  })
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/form", async (req, res) => {
  try {
    const query = `
      INSERT INTO users_data (name, date, alRaqaam, alHafza, raqamMadavnia, walad, hataf, aamla, jins, mastaqdam, khaldil, yadfa)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;
    `;
    const values = [
      req.body.naam,
      req.body.date ? new Date(req.body.date) : null,
      req.body.raqam ? Number(req.body.raqam) : null,
      req.body.hafza,
      req.body.madvia,
      req.body.walid,
      req.body.hatif,
      req.body.aamil,
      req.body.jins,
      req.body.mastaqdam ? Number(req.body.mastaqdam) : null,
      req.body.khaldal,
      req.body.yadfa ? Number(req.body.yadfa) : null,
    ];

    const result = await pool.query(query, values);
    const savedUserId = result.rows[0].id;

    // Trigger auto-delete after exactly 1 minute (60,000 milliseconds)
    setTimeout(async () => {
      try {
        await pool.query('DELETE FROM users_data WHERE id = $1', [savedUserId]);
        console.log(`Auto-deleted contract with ID: ${savedUserId}`);
      } catch (delErr) {
        console.error('Failed to auto-delete contract:', delErr);
      }
    }, 60000);

    return res.redirect(`/download-pdf/${savedUserId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/success/:pdfId", async (req, res) => {
  const pdfParamsId = req.params.pdfId;

  try {
    const result = await pool.query('SELECT * FROM users_data WHERE id = $1', [pdfParamsId]);
    const user = result.rows[0];
    if (user) {
      user._id = user.id; // Map id to _id so EJS views aren't broken
      res.render("submit-success", { user: user });
    } else {
      res.status(404).send("No user found or the contract has already expired (deleted).");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

app.get("/pdf/:pdfId", async (req, res) => {
  const pdfId = req.params.pdfId;

  try {
    const result = await pool.query('SELECT * FROM users_data WHERE id = $1', [pdfId]);
    const user = result.rows[0];
    if (user) {
      user._id = user.id; // Map id to _id so EJS views aren't broken
      res.render("html-to-pdf-download-btn", { user: user });
    } else {
      res.status(404).send("No user found or the contract has already expired (deleted).");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error: " + err.message);
  }
});

app.get("/download-pdf/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query('SELECT * FROM users_data WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).send("No user found or the contract has already expired (deleted).");
    }
    user._id = user.id; // Map id to _id so EJS views aren't broken

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
      ],
    });
    const page = await browser.newPage();
    
    await page.goto(`${process.env.BASE_URL}pdf/${userId}`, {
      waitUntil: "networkidle2",
    });

    const templatePath = path.join(__dirname, "views", "html-to-pdf.ejs");
    const html = ejs.render(fs.readFileSync(templatePath, "utf8"), {
      user: user, // user._id works properly in the EJS thanks to the mapping
    });

    await page.setContent(html);
    await page.emulateMediaType("screen");
    await page.evaluateHandle("document.fonts.ready");

    const pdfOptions = {
      printBackground: true,
      format: "A4",
    };

    const pdfBuffer = await page.pdf(pdfOptions);

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=user_${userId}.pdf`
    );
    res.send(pdfBuffer);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error: " + err.message);
  }
});

app.use((req, res) => {
  res.render("404");
});

app.listen(8089, () => {
  console.log("run on port 8089");
});
