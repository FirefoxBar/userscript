import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const zhihu: Site = {
  getTitle() {
    return getHtml('.Post-Title');
  },
  getContent() {
    return getContent('.Post-RichTextContainer');
  }
}

export default zhihu;