import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const tianya: Site = {
  getTitle() {
    return getHtml('.article a');
  },
  getContent() {
    return getContent('.articletext');
  }
}

export default tianya;