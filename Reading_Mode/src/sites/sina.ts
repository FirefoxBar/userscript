import { getContent, getHtml } from "../utils";
import { Site } from "./var";

const sina: Site = {
  getTitle() {
    return getHtml('.articalTitle .titName');
  },
  getContent() {
    return getContent('.articalContent');
  }
}

export default sina;