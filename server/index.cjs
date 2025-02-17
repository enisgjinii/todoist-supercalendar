
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Server error:", err);

  // Handle Axios errors
  if (err.isAxiosError) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || "An error occurred with the external service";
    return res.status(status).json({
      error: message,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7)
    });
  }

  // Handle other errors
  res.status(500).json({
    error: err.message || "Internal server error",
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(7)
  });
};

app.get("/api/notion/search", async (req, res, next) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error("Notion token is not configured");
    }

    const response = await axios.post("https://api.notion.com/v1/search", {
      filter: {
        value: "database",
        property: "object"
      },
      sort: {
        direction: "descending",
        timestamp: "last_edited_time"
      },
      page_size: 100
    }, {
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    console.log("Notion API response status:", response.status);
    res.json(response.data);
    
  } catch (error) {
    next(error);
  }
});

app.get("/api/notion/database/:id", async (req, res, next) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      throw new Error("Notion token is not configured");
    }

    const databaseId = req.params.id;
    if (!databaseId) {
      throw new Error("Database ID is required");
    }

    console.log(`[Notion API] Attempting to fetch database with ID: ${databaseId}`);
    console.log(`[Notion API] Request timestamp: ${new Date().toISOString()}`);

    const response = await axios.get(`https://api.notion.com/v1/databases/${databaseId}`, {
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
    });

    console.log("[Notion API] Response Status:", response.status);
    console.log("[Notion API] Response Headers:", JSON.stringify(response.headers, null, 2));
    console.log("[Notion API] Database Data:", JSON.stringify(response.data, null, 2));

    res.status(response.status).json(response.data);
    
  } catch (error) {
    console.error("[Notion API] Error Details:");
    console.error("- Status:", error.response?.status);
    console.error("- Status Text:", error.response?.statusText);
    console.error("- Error Message:", error.message);
    console.error("- Request URL:", error.config?.url);
    console.error("- Request Method:", error.config?.method);
    console.error("- Response Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("- Stack Trace:", error.stack);

    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
