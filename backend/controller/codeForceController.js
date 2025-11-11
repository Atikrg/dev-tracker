const axios = require("axios");

exports.codeForces = async (req, res) => {
  try {
    const handler = req.params.handler;

    if (!handler) {
      return res.status(400).json({
        success: "failed",
        message: "Handler (username) is required",
      });
    }

    const url = `https://codeforces.com/api/user.info?handles=${handler}`;
    const { data } = await axios.get(url);

    // Codeforces returns status = "FAILED" for invalid usernames
    if (data.status !== "OK") {
      return res.status(400).json({
        success: "failed",
        message: data.comment || "Invalid Codeforces handle",
      });
    }

    const user = data.result[0];
    const result = {
      username: user.handle,
      currentRating: user.rating || "Unrated",
      highestRating: user.maxRating || "N/A",
      rank: user.rank || "N/A",
      maxRank: user.maxRank || "N/A",
      contribution: user.contribution || 0,
    };

    return res.status(200).json({
      success: "success",
      message: "Codeforces data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error("🔥 Error fetching Codeforces data:", error.message);

    // ✅ Handle Axios HTTP errors
    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        return res.status(400).json({
          success: "failed",
          message:
            error.response.data?.comment ||
            "Bad Request — Invalid Codeforces handle",
        });
      }

      if (status === 404) {
        return res.status(404).json({
          success: "failed",
          message: "User not found on Codeforces",
        });
      }

      // Any other status from Codeforces
      return res.status(status).json({
        success: "failed",
        message: `Codeforces API error (status ${status})`,
      });
    }

    // ✅ Handle no response or other errors
    if (error.request) {
      return res.status(503).json({
        success: "failed",
        message: "No response from Codeforces server",
      });
    }

    // ✅ Catch any other unexpected error
    return res.status(500).json({
      success: "failed",
      message: "Internal Server Error",
    });
  }
};
