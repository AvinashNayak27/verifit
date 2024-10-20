const express = require("express");
const { ReclaimClient } = require("@reclaimprotocol/zk-fetch");
const { transformForOnchain } = require("@reclaimprotocol/js-sdk");
const cors = require("cors");

const app = express();
const port = 3000; // You can change this to your preferred port

app.use(cors());

const reclaimClient = new ReclaimClient(
  "0x4f8dfc1aa3793afBe4A9f0d8F18D047c38dC3227",
  "0x6296202bb4c124ddece09f16ce2a8a2e5a4e6af9f2fbe4ff94369150a0d9ebe8"
);

const todayStepProof = async (accessToken) => {
  const endTimeMillis = Date.now();
  const startTimeMillis = new Date().setHours(0, 0, 0, 0); // 12:00 AM on the current date

  const data = {
    aggregateBy: [
      {
        dataTypeName: "com.google.step_count.delta",
        dataSourceId:
          "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
      },
    ],
    bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
    startTimeMillis: startTimeMillis,
    endTimeMillis: endTimeMillis,
  };

  const publicOptions = {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      accept: "*/*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "content-type": "application/json",
    },
  };

  const privateOptions = {
    headers: {
      authorization: accessToken,
    },
  };

  const proof = await reclaimClient.zkFetch(
    "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
    publicOptions,
    privateOptions
  );

  const transformedProof = await transformForOnchain(proof);
  return transformedProof;
};

app.get("/fetch-fitness-data", async (req, res) => {
  try {
    const endTimeMillis = Date.now();
    const startTimeMillis = new Date().setHours(0, 0, 0, 0); // 12:00 AM on the current date
    const accessToken = req.headers.authorization;

    const data = {
      aggregateBy: [
        {
          dataTypeName: "com.google.step_count.delta",
          dataSourceId:
            "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        },
      ],
      bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
      startTimeMillis: startTimeMillis,
      endTimeMillis: endTimeMillis,
    };

    const publicOptions = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json",
      },
    };

    const privateOptions = {
      headers: {
        authorization: accessToken,
      },
    };

    const proof = await reclaimClient.zkFetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      publicOptions,
      privateOptions
    );

    const transformedProof = await transformForOnchain(proof);
    res.json(transformedProof);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching fitness data" });
  }
});

app.get("/get-history", async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(400).json({ error: "Authorization header is missing" });
  }

  const currentDate = new Date();
  const daysToFetch = 7; // Including today

  // Create an array of promises for all proof fetches
  const proofPromises = Array.from({ length: daysToFetch }, async (_, i) => {
    let startTimeMillis, endTimeMillis;

    if (i === 0) {
      // Today: from 00:00 to now
      startTimeMillis = new Date(currentDate).setHours(0, 0, 0, 0);
      endTimeMillis = Date.now();
    } else {
      // Previous days: full 24-hour periods
      endTimeMillis = new Date(currentDate).setHours(0, 0, 0, 0) - (i - 1) * 24 * 60 * 60 * 1000;
      startTimeMillis = endTimeMillis - 24 * 60 * 60 * 1000;
    }

    const data = {
      aggregateBy: [
        {
          dataTypeName: "com.google.step_count.delta",
          dataSourceId:
            "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
        },
      ],
      bucketByTime: { durationMillis: endTimeMillis - startTimeMillis },
      startTimeMillis: startTimeMillis,
      endTimeMillis: endTimeMillis,
    };

    const publicOptions = {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        accept: "*/*",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "content-type": "application/json",
      },
    };

    const privateOptions = {
      headers: {
        authorization,
      },
    };

    const proof = await reclaimClient.zkFetch(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      publicOptions,
      privateOptions
    );

    return transformForOnchain(proof);
  });

  try {
    // Wait for all promises to resolve
    const proofs = await Promise.all(proofPromises);
    return res.json({ proofs });
  } catch (error) {
    console.error("Error fetching proofs:", error);
    return res.status(500).json({ error: "Failed to fetch proofs" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
