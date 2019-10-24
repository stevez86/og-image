import { launch, Page } from 'puppeteer-core';
import { getOptions } from './options';
import {FileType, ParsedRequest} from './types';
let _page: Page | null;

async function getPage(isDev: boolean) {
    if (_page) {
        return _page;
    }
    const options = await getOptions(isDev);
    const browser = await launch(options);
    _page = await browser.newPage();
    return _page;
}

export async function getScreenshot(url: string, type: FileType, isDev: boolean, options: ParsedRequest) {
    const { width, height } = options;
    const page = await getPage(isDev);
    await page.setViewport({ width, height });
    await page.goto(url);
    return page.screenshot({ type, quality: 85 });
}
