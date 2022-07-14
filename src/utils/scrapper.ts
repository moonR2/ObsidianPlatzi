import { load } from "cheerio";
import { request } from "obsidian";
import { Course } from "src/models/courseModel";


export async function getByUrl(url: string): Promise<Course> {
const defaultCourse: Course = {
  title: "Not Found",
  author: "Not Found",
  url: url,
  coverUrl: "Not Found",
  status: "in progress",
  rating: 5,
}
  const res = await request({
    url: url,
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0',
    },
  })
  // load cheerio
  const $ = load(res);

  // scrap all the script tags
  const scrappedScript = $('script').map((idx, el) => $(el).html()).toArray()[68] || false;

  if (scrappedScript) {
  // scrapped to JSON
  const data = JSON.parse(scrappedScript);
  const course: Course = {
    title: data.name,
    author: data.review.author.name,
    url: url,
    coverUrl: data.image,
    status: "in progress",
    rating: data.review.reviewRating.ratingValue,
  }

  console.log(course)
  return course;

  }
  
   return defaultCourse
}


