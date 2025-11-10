const axios = require("axios");

const URL = process.env.URL;

exports.allCodePlatforms = async (req, res) => {
  try {
    const handler = req.params.handler;

    if (!handler) {
      return res.status(401).json({
        success: "fail",
        message: " Invalid User",
      });
    }

    const [leet, codeforces, codechef] = await Promise.all([
      axios.get(`${URL}/api/leetcode/${handler}`),
      axios.get(`${URL}/api/codeforces/${handler}`),
      axios.get(`${URL}/api/codechef/${handler}`),
    ]);

    const data = {
      leetcode: leet.data,
      codeforces: codeforces.data,
      codechef: codechef.data,
    };

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
