import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname = '/', query = {} } = parse(req.url || '', true);
    const { fontSize, images, widths, heights, theme, md, width, height, text } = query;

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    const extension = pathname.slice(1).split('.').pop();

    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: !text || text === 'none' ? '' : decodeURIComponent(text.toString()),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        fontSize: fontSize || '96px',
        images: getArray(images),
        widths: getArray(widths),
        heights: getArray(heights),
        width: width ? parseInt(width.toString()) : 2048,
        height: height ? parseInt(height.toString()) : 1024,
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string): string[] {
    return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}

function getDefaultImages(images: string[]): string[] {
    if (images.length > 0 && images[0] && images[0].startsWith('https://rocket-resume.com')) {
        return images;
    }
    return [];
}