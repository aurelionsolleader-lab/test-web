import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/waitlist", (req, res) => {
    const { email, lang } = req.body;
    if (!email) {
      return res.status(400).json({ status: "error", message: "Email is required" });
    }

    const waitlistPath = path.join(process.cwd(), "waitlist.json");
    let waitlist = [];
    
    if (fs.existsSync(waitlistPath)) {
      try {
        const data = fs.readFileSync(waitlistPath, "utf8");
        waitlist = JSON.parse(data);
      } catch (e) {
        console.error("Error reading waitlist:", e);
      }
    }

    waitlist.push({
      email,
      lang,
      timestamp: new Date().toISOString()
    });

    try {
      fs.writeFileSync(waitlistPath, JSON.stringify(waitlist, null, 2));
      res.json({ status: "ok", message: "Successfully joined the waitlist" });
    } catch (e) {
      console.error("Error writing to waitlist:", e);
      res.status(500).json({ status: "error", message: "Failed to save to waitlist" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
