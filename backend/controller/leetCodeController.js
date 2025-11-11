const axios = require("axios");

exports.leetCode = async (req, res) => {
  try {
    const handler = req.params.handler;

    const leetCodeUrl = "https://leetcode.com/graphql";

    const query = `
      query getContestRanking($username: String!) {
        userContestRanking(username: $username) {
          rating
          globalRanking
          totalParticipants
          attendedContestsCount
          topPercentage
        }
      }
    `;

    const variables = { username: handler };
    const { data } = await axios.post(
      leetCodeUrl,
      { query, variables },
      { headers: { "Content-Type": "application/json" } }
    );


    const userContestRatings = data?.data.userContestRanking;

    if (
      !userContestRatings ||
      userContestRatings === null ||
      userContestRatings === undefined
    ) {
      return res.status(404).json({
        success: "fail",
        message: "User Not Found",
      });
    }

    return res.status(200).json({
      success: "success",
      message: "Successfully fetched leetcode user profile",
      data,
    });
  } catch (error) {

    console.error("🔥🔥🔥Error fetching leetCode data:", error.message);
    
    return res.status(500).json({
      success: "fail",
      message: "Internal Server Error",
    });
  }
};
