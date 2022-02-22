import { Page } from "playwright-core";
import { ILogger } from "../_module";

export default async function (page: Page, logger: ILogger) {
    const supported = await page.evaluate(function () {
        return !!document.createElement("video").canPlayType("video/mp4; codecs=avc1.42E01E,mp4a.40.2");
    });

    if (supported) {
        logger.log("支援 MP4");
    } else {
        logger.warn("不支援 MP4");
    }
}
