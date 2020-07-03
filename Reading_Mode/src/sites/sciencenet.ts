import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const sciencenet: Site = {
  getTitle() {
    return getHtml('.vw h1');
  },
  getContent() {
    return getContent('#blog_article');
  }
}

export default sciencenet;