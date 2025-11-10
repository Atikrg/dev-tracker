const axios = require("axios");
const cheerio = require("cheerio");

exports.codeChef = async (req, res) => {
  try {
    const handler = req.params.handler;
    const codeChefUrl = `https://www.codechef.com/users/${handler}`;
    const { data } = await axios.get(codeChefUrl);

    const $ = cheerio.load(data);

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

      const ratingText = $(".widget-rating .rating-number").text().trim();
      result.currentRating = parseInt(ratingText.replace("?", "")) || 0;

      // Extract highest rating
      const highestRatingText = $(".widget-rating small").text();
      const highestRatingMatch =
        highestRatingText.match(/Highest Rating (\d+)/);
      result.highestRating = highestRatingMatch
        ? parseInt(highestRatingMatch[1])
        : 0;

      // FIXED: Extract division properly
      // The division is in the div after rating number and before the star
      const ratingWidget = $(".widget-rating .rating-header");
      result.division =
        ratingWidget.find("div").eq(1).text().trim().replace(/[()]/g, "") || "";

      // Extract ranks
      result.globalRank =
        parseInt($(".rating-ranks a").eq(0).text().trim()) || 0;
      result.countryRank =
        parseInt($(".rating-ranks a").eq(1).text().trim()) || 0;

      // Extract contests participated
      const contestsText = $(".contest-participated-count b").text().trim();
      result.contestsParticipated = parseInt(contestsText) || 0;

      // Extract contest problems
      $(".rating-data-section .content").each((index, element) => {
        const $entry = $(element);
        const title = $entry.find("h5 span").text().trim();

        if (title && title.includes("Starters")) {
          const problems = [];
          $entry.find("p span span").each((i, probEl) => {
            problems.push($(probEl).text().trim());
          });

          result.contestProblems.push({
            contest: title,
            problems: problems,
          });
        }
      });

      // Extract total problems solved
      const problemsText = $(".problems-solved h3").last().text();
      const problemsMatch = problemsText.match(/Total Problems Solved: (\d+)/);
      result.totalProblemsSolved = problemsMatch
        ? parseInt(problemsMatch[1])
        : 0;

      return result;
    }

    // Extract the data
    const userData = extractUserRatings($);

    return res.status(200).json({
      success: "success",
      message: "CodeChef data fetched successfully",
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching CodeChef data:", error);
    return res.status(500).json({
      success: "fail",
      message: "Internal Server Error",
    });
  }
};
