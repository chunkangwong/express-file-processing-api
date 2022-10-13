import cors from "cors";
import express, { Request, Response } from "express";
import fs from "fs/promises";
import multer from "multer";

const app = express();
const port = 4000;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Hello World!");
});

// Multer middleware for file upload endpoint. Received file will be stored in "./uploads" folder
const upload = multer({ dest: "uploads/" });
app.post(
  "/geojson2shapefile",
  upload.single("file"), // "file" is the name of the file input field in the form, frontend should send the file in this field
  async (req: Request, res: Response) => {
    const { path, originalname } = req.file!;
    const content = await fs.readFile(path, "utf-8"); // Read the file content
    const upperContent = content.toUpperCase(); // Do some processing, in this case, convert the content to uppercase
    const destFile = `toUploads/${originalname}`;
    await fs.writeFile(destFile, upperContent); // Write the processed content to a new file
    res.status(200).download(destFile); // Send the processed file to the client
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
