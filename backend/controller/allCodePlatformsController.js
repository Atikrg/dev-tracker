const axios = require("axios");

const BACKEND_URL = process.env.BACKEND_URL;

exports.allCodePlatforms = async (req, res) => {
  try {
    const handler = req.params.handler;

    if (!handler) {
      return res.status(401).json({
        success: "fail",
        message: " Invalid User",
      });
    }


    const results = await Promise.allSettled([
      axios.get(`${BACKEND_URL}/api/leetcode/${handler}`),
      axios.get(`${BACKEND_URL}/api/codeforces/${handler}`),
      axios.get(`${BACKEND_URL}/api/codechef/${handler}`),
    ]);

    const leet =
      results[0].status === "fulfilled" ? results[0].value.data : null;
    const codeforces =
      results[1].status === "fulfilled" ? results[1].value.data : null;
    const codechef =
      results[2].status === "fulfilled" ? results[2].value.data : null;

    const data = {
      leetcode: leet?.data,
      codeforces: codeforces?.data,
      codechef: codechef?.data,
    };


    return res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({
      success: "fail",
      message: "Internal Server Error",
    });
  }
};
