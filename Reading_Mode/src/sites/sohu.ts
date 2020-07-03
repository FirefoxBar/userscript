import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const sohu: Site = {
  getTitle() {
    return getHtml('.newBlog-title h2 span');
  },
  getContent() {
    return getContent('#main-content');
  }
}

export default sohu;