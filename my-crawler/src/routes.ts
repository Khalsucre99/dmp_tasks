import { Dataset, createPlaywrightRouter } from "crawlee";
import {promises as fs} from "fs";

//@ts-nocheck

export const router = createPlaywrightRouter();
const allData: any[] = [];

let totalItems: any = 0;

router.addDefaultHandler(async ({ request, enqueueLinks, log, page }) => {
  if (request.userData.label === "start") {
    // TODO : click cookie banner
    console.log("clicking cookie banner");
    await page
      .waitForSelector(".cookie-consent button")
      .then(() => console.log("found cookie banner"));
    await page.click(".cookie-consent button");
    await page
      .waitForSelector(".cookie-alert button")
      .then(() => console.log("found cookie banner"));
    await page.click(".cookie-alert button");
    // ----------------------------------
  }

  // TODO: navigate on all pagination links
  log.info(`enqueueing new URLs`);
  const infos = await enqueueLinks({
    selector: ".pagination-wrapper .num a",
    label: "pagination",
  });

  // TODO: get on all references
  await page.waitForSelector(".list-item-wrapper.list-item-reference");
  const data = await page.$$eval(
    ".list-item-wrapper.list-item-reference",
    ($posts) => {
      const scrapedData: {
        name: any;
        annotation: any;
        content: any;
        image: any;
        link: any;
      }[] = [];
      // We're getting the infos of each card on the website.
      $posts.forEach(($post) => {
        scrapedData.push({
          name: $post.querySelector(".list-item-heading")?.textContent,
          annotation: $post.querySelector(".list-item-anotation")?.textContent,
          content: $post.querySelector(".overlay-txt.ddd")?.textContent,
          image: $post
            .querySelector(".list-item-image")
            ?.getAttribute("data-src"),
          link: $post.querySelector(".overlay-link a")?.getAttribute("href"),
        });
      });
      return scrapedData;
    }
  );
  allData.push(...data);
  // TODO: merge all in one file
  await Dataset.pushData(data);
  totalItems += data.length;
  console.log("total : ", totalItems);
  console.log("data", allData);
  const finalObject = {
    "TotalItems": totalItems,
    "Clients": allData
};
  async function saveData() {
    await fs.writeFile('C:\\Users\\SAIF\\Downloads\\my-crawler\\my-crawler\\storage\\datafinal.json', JSON.stringify(finalObject, null, 2));
}
 
saveData().catch(console.error);
  if (infos.processedRequests.length === 0) {
   
  }
  
});
