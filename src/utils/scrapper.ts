import { load } from "cheerio";
import { request } from "obsidian";
import { Course } from "src/models/courseModel";

export async function getByUrl(url: string): Promise<Course []> {
}