const axios = require("axios");

exports.codeForces = async (req, res) => {
  try {
    const handler = req.params.handler;
    const { data } = await axios.get(
      `https://codeforces.com/api/user.info?handles=${handler}`
    );

    const user = data.result[0];

    const result = {
      username: user.handle,
      currentRating: user.rating || "Unrated",
      highestRating: user.maxRating || "N/A",
      rank: user.rank || "N/A", // acts as global rank
      maxRank: user.maxRank || "N/A",
      contribution: user.contribution || 0,
    };

    return res.status(200).json({
      success: "success",
      message: "Codeforces data fetched successfully",
      data: result,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      success: "failed",
      message: "Internal Server Error",
    });
  }
};
