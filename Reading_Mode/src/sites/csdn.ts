import { getContent, trimNewLines } from "../utils";
import { Site } from "./var";

const csdn: Site = {
  getTitle() {
    const c = document.querySelector(".article_title h1");
    if (c) {
      const a = c.querySelector('a');
      if (a) {
        return trimNewLines(a.innerHTML);
      } else {
        return trimNewLines(c.children[0].innerHTML);
      }
    } else {
      const top = document.querySelector(".csdn_top");
      const article = document.querySelector(".title-article");
      if (top) return trimNewLines(top.innerHTML);
      if (article) return trimNewLines(article.innerHTML);
    }
    return '';
  },
  getContent() {
    return getContent('.article_content') || getContent('.markdown_views');
  }
}

export default csdn;