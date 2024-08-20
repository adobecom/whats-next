
export function printReport(pages) {
    console.log("========== Report ==========");
    const sortedPages = sortPages(pages);
    return sortedPages;
    // for (const sortedPage of sortedPages) {
    //     const url = sortedPage[0];
    //     const hits = sortedPage[1];
    //     console.log(`${url}:${hits}`);
    // }
    // console.log("========== End Report ==========");
}

export function printBrokenLinks(brokenLinks) {
    console.log("========== Broken Links ==========");
    for (const brokenLink of brokenLinks) {
        console.log(brokenLink);
    }
    console.log("========== End Broken Links ==========");
 }



export function sortPages(pages) {
    const pageArray = Object.entries(pages);
    pageArray.sort((a, b) => {
        return b[1] - a[1];
    });
    return pageArray;
}