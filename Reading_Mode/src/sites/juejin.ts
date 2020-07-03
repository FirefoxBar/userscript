import { getHtml } from "../utils";
import { Site } from "./var";

const juejin: Site = {
  getTitle() {
    return getHtml('.entry-content-box > h1');
  },
  getContent() {
    const html = getHtml('.article-content');
    return html.replace(/data\-src="(.*?)"(.*?)src="(.*?)"/g, 'data-src="$1"$2src="$1"');
  }
}

export default juejin;