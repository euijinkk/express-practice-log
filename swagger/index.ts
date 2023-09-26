import express from "express";
import swaggerUi from "swagger-ui-express";

const YAML = require("yamljs");
const swaggerDocument = YAML.load(__dirname + "/openapi.yaml");
const router = express.Router();

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default router;
