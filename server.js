const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const express = require("express");
const app = express();
const  bodyParser = require('body-parser')
app.use(cors());



async function scrapeWebpage(url) {
  try {
    
   
      const response = await axios.get(url);
   
      
    
    const html = response.data;
     
    const $ = cheerio.load(html);

    const Problemsolved = [];
    const headlines = $(".tab");
    const profile_name = $(".profile_name")
    // name 
    const name = $(profile_name).text();
    headlines.each((index, element) => {
      const text = $(element).text();
      const numbers = text.match(/\d+/g);
      Problemsolved.push(numbers);
    });

    const school = Number(Problemsolved[0]);
    const basic = Number( Problemsolved[1]);
    const easy = Number(Problemsolved[2]);
    const medium = Number(Problemsolved[3]);
    const hard = Number(Problemsolved[4]);

    // weightage
    const schoolWeightage = 1;
    const basicWeightage = 2;
    const easyWeightage = 10;
    const mediumWeightage = 30;
    const hardWeightage = 50;

    // total

    const totalValue =
      school * schoolWeightage +
      basic * basicWeightage +
      easy * easyWeightage +
      medium * mediumWeightage +
      hard * hardWeightage;

    const resultData = {
      easy: easy,
      medium: medium,
      hard: hard,
      value: totalValue,
      name : name
    };

    return resultData;
  }
  
  catch (error) {
   console.log("error found  !! ");
   const resultData = {
      err: 500
    }
    return resultData
  }
}

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }))
app.get("/", (req, res) => {
  res.json({ Response: "Connected" });
});


app.post("/", async (req, res) => {
  const URL = req.body.url;
  const Data = await scrapeWebpage(URL)

  console.log( "Data sent -"+Data);

  res.json(Data)
});

const PORT = 5600;

app.listen(PORT, () => {
  console.log("server Running on Port " + PORT);
});