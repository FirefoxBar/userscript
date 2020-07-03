import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const chinaunix: Site = {
  getTitle() {
    return getHtml('.Blog_tit4 a');
  },
  getContent() {
    return getContent('.Blog_wz1');
  }
}

export default chinaunix;