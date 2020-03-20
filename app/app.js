const express = require("express");
const promBundle = require("express-prom-bundle");
const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  promClient: {
    // collectDefaultMetrics: {
    //   timeout: 1000
    // }
  }
});

const app = express();

/** Prometheus Metrics */
// const totalHttpRequestCount = new Counter({
//   name: 'nodejs_http_total_count',
//   help: 'total request number',
//   labelNames: httpMetricsLabelNames
// });

// const totalHttpRequestDuration = new Gauge({
//   name: 'nodejs_http_total_duration',
//   help: 'the last duration or response time of last request',
//   labelNames: httpMetricsLabelNames
// });

/** Express Middlewares/Routes */
app.use(express.json());
app.use(metricsMiddleware);

app.get("/api", (req, res) => {
  return res.status(200).json({ status: "Message received" });
});

app.get("/slow", (req, res) => {
  setTimeout(() => {
    return res.status(200).send("Slow response...");
  }, 1000);
});

app.get("/error", (req, res) => {
  try {
    throw new Error("Something broke...");
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/** Listening definition */
app.listen(5000, () => console.log("Express is listening on port 5000"));
