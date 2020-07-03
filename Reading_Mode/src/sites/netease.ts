import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const netease: Site = {
  getTitle() {
    return getHtml('.title .tcnt');
  },
  getContent() {
    return getContent('.nbw-blog');
  }
}

export default netease;