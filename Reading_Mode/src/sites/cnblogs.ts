import { getContent } from "../utils";
import { Site } from "./var";

const cnblogs: Site = {
  getTitle() {
    const a = document.querySelector(".postTitle a");
    const b = document.getElementById('cb_post_title_url');
    if (a) return a.innerHTML;
    if (b) return b.innerHTML;
    return '';
  },
  getContent() {
    return getContent('#cnblogs_post_body');
  }
}

export default cnblogs;