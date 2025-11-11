const axios = require("axios");
const cheerio = require("cheerio");

exports.codeChef = async (req, res) => {
  try {
    const handler = req.params.handler?.trim();
    if (!handler) {
      return res.status(400).json({
        success: "fail",
        message: "Username (handler) is required",
      });
    }

    const codeChefUrl = `https://www.codechef.com/users/${handler}`;

    let data;
    try {
      const response = await axios.get(codeChefUrl);
      data = response.data;
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return res.status(404).json({
          success: "fail",
          message: "User not found on CodeChef",
        });
      }
      throw err; // let other network errors fall through to the main catch
    }

    const $ = cheerio.load(data);

    // If profile page exists but structure is missing (CodeChef layout change or invalid user)
    if ($(".user-details-container").length === 0) {
      return res.status(404).json({
        success: "fail",
        message: "User not found or invalid CodeChef profile page",
      });
    }

    function extractUserRatings($) {
      const result = {
        username: handler,
        currentRating: 0,
        highestRating: 0,
        division: "",
        globalRank: 0,
        countryRank: 0,
        contestsParticipated: 0,
        ratingsHistory: [],
        contestProblems: [],
        totalProblemsSolved: 0,
      };

      // Extract rating history
      $("script").each((index, element) => {
        if (element.type === "text") {
          const scriptText = $(element).text();
          const ratingMatch = scriptText.match(/var all_rating = (\[.*?\]);/);
          if (ratingMatch) {
            try {
              result.ratingsHistory = JSON.parse(ratingMatch[1]);
            } catch (error) {
              console.error("Error parsing ratings history:", error);
            }
          }
        }
      });

      // Extract current rating
      const ratingText = $(".widget-rating .rating-number").text().trim();
      result.currentRating = parseInt(ratingText.replace("?", "")) || 0;

      // Extract highest rating
      const highestRatingText = $(".widget-rating small").text();
      const highestRatingMatch = highestRatingText.match(/Highest Rating (\d+)/);
      result.highestRating = highestRatingMatch
        ? parseInt(highestRatingMatch[1])
        : 0;

      // Extract division
      const ratingWidget = $(".widget-rating .rating-header");
      result.division =
        ratingWidget.find("div").eq(1).text().trim().replace(/[()]/g, "") || "";

      // Extract ranks
      result.globalRank =
        parseInt($(".rating-ranks a").eq(0).text().trim()) || 0;
      result.countryRank =
        parseInt($(".rating-ranks a").eq(1).text().trim()) || 0;

      // Contests participated
      const contestsText = $(".contest-participated-count b").text().trim();
      result.contestsParticipated = parseInt(contestsText) || 0;

      // Contest problems
      $(".rating-data-section .content").each((index, element) => {
        const $entry = $(element);
        const title = $entry.find("h5 span").text().trim();

        if (title && title.includes("Starters")) {
          const problems = [];
          $entry.find("p span span").each((i, probEl) => {
            problems.push($(probEl).text().trim());
          });
          result.contestProblems.push({ contest: title, problems });
        }
      });

      // Total problems solved
      const problemsText = $(".problems-solved h3").last().text();
      const problemsMatch = problemsText.match(/Total Problems Solved: (\d+)/);
      result.totalProblemsSolved = problemsMatch
        ? parseInt(problemsMatch[1])
        : 0;

      return result;
    }

    const userData = extractUserRatings($);

    return res.status(200).json({
      success: "success",
      message: "CodeChef data fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.error("🔥🔥🔥Error fetching CodeChef data:", error.message);
    return res.status(500).json({
      success: "fail",
      message: "Internal Server Error",
    });
  }
};
