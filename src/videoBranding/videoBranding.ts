import { replaceThumbnail } from "../thumbnails/thumbnailRenderer";
import { replaceTitle } from "../titles/titleRenderer";

export type VideoID = string & { videoIDBrand : never };

export function replaceBranding(element: HTMLElement): Promise<[boolean, boolean]> {
    const link = element.querySelector("#thumbnail") as HTMLAnchorElement;

    if (link) {
        // todo: fastest would be to preload via /browser request
        const videoID = link.href?.match(/\?v=(.{11})/)?.[1] as VideoID;

        return Promise.all([replaceThumbnail(element, videoID),
            replaceTitle(element, videoID)]) as Promise<[boolean, boolean]>;
    }

    return new Promise((resolve) => resolve([false, false]));
}

export function startThumbnailListener(): void {
    // hacky prototype
    const elementsDealtWith = new Set<Element>();
    // let stop = 0;
    setInterval(() => {
        // if (stop > 8) return;
        const newElements = [...document.querySelectorAll("ytd-rich-grid-media, ytd-compact-video-renderer")].filter((element) => !elementsDealtWith.has(element));
        for (const element of newElements) {
            elementsDealtWith.add(element);

            void replaceBranding(element as HTMLElement);

            // stop++;
            return;
        }
    }, 10);
}