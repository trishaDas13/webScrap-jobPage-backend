const axios = require("axios");
const cheerio = require("cheerio");
const xlsx = require("xlsx");

let jobArr = [];

async function getJobs() {
  try {
    const res = await axios.get(
      "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35",
      {
        headers: {
          "content-type": "text/html",
        },
      }
    );
    const $ = cheerio.load(res.data);
    const card = $("li.clearfix.job-bx.wht-shd-bx").each((idx, item) => {
      const job_role = $(item).find("h2 > a").text();
      const co_name = $(item).find("h3.joblist-comp-name").text();
    //   const experience = $(item).find("ul.top-jd-dtl clearfix").children('li').text();
    //   const salary = $(item).find("ul.top-jd-dtl clearfix").children('li').text();
    //   const location = $(item).find("ul.top-jd-dtl clearfix").children('li').text();
      const key_skill = $(item).find("span.srp-skills").text();
      jobArr.push({
        job_role,
        co_name,
        // experience,
        // salary,
        // location,
        key_skill,
      });
      const workbook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.json_to_sheet(jobArr);
      xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");
      xlsx.writeFile(workbook, "output.xlsx");
    });
  } catch (err) {
    console.log("error occured : " + err);
  }
}
getJobs();
