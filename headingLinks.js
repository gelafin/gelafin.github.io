/**
 *  Instantly adds links next to all headings on a page,
 *  and handles navigation using the heading links.
 *  Requires an icon file at images/icons/link-icon.svg
 */
// define heading link styling
const headingLinkImgStyle = `height: 1em`;

// define file path of link icon
const iconFilepath = './assets/images/icons/link-icon.svg';

/**
 * loads the link icon
 * @param filepath string path relative to document in which this script is loaded
 */
const canFindFile = (filepath) => {
    try {
        
    } catch (error) {
        console.log(error);
    }
}

/**
 * utility to wrap an element with a new element
 * @param innerElement element to be wrapped
 * @param wrapperElement element with which to wrap
 */
const wrapElement = (innerElement, wrapperElement) => {
    innerElement.parentNode.insertBefore(wrapperElement, innerElement);
    wrapperElement.appendChild(innerElement);
};

/**
 * returns all h1 - h6 elements, unordered
 */
const getAllHeadings = () => {
    // maybe there's a way to select all HTMLHeadingElement elements?
    return document.querySelectorAll('h1, h2, h3, h4, h5, h6');
};

/**
 * wraps headings in a flex horizontal div,
 * so links appear on the left of headings
 * @param skipCondition function returning true if a heading should be skipped
 */
const wrapHeadings = (skipCondition) => {
    const headings = getAllHeadings();

    for (const heading of headings) {
        if (!skipCondition || skipCondition(heading) != true) {
            // create wrapper div to order link and heading horizontally
            const wrapperElement = document.createElement('div');
            wrapperElement.style = 'display: flex; flex-flow: row wrap';
    
            // insert new element and reparent
            wrapElement(heading, wrapperElement);
        }
    }
};

/**
 * creates a new heading link element,
 * compatible with any h1-h6
 * @param headingElement heading element that needs a link
 * @param iconFilepath path to link icon
 */
const createLinkToHeading = (headingElement, iconFilepath, headingLinkImgStyle) => {
    const anchorElement = document.createElement('a');
    anchorElement.href = '#' + headingElement.getAttribute('id');

    const imageElement = document.createElement('img');
    imageElement.src = iconFilepath;
    imageElement.alt = '';
    imageElement.setAttribute('style', headingLinkImgStyle);

    anchorElement.appendChild(imageElement);

    return anchorElement;
};

/**
 * inserts links corresponding to each heading
 * into the DOM just before each heading element
 * @param iconFilepath path to link icon
 * @param headingLinkImgStyle string to set as icon style
 * @param skipCondition function returning true if a heading should be skipped
 */
const addLinksToHeadings = (iconFilepath, headingLinkImgStyle, skipCondition) => {
    const allHeadings = getAllHeadings();

    // create a new link element for each heading and append links
    // as previous siblings to their corresponding headings
    for (const heading of allHeadings) {
        if (!skipCondition || skipCondition(heading) != true) {
            const linkElement = createLinkToHeading(heading, iconFilepath, headingLinkImgStyle);
            heading.parentNode.insertBefore(linkElement, heading);
        }
    }
};

/**
 * adds unique Ids to each heading element
 * credit: select all IDs from https://stackoverflow.com/a/50407737/14257952
 */
const addIdsToHeadings = () => {
    const allHeadings = getAllHeadings();
    const allIds = new Set(document.querySelectorAll('[id]'));
    const uniqueIdPrefix = 'heading-link-id-';
    let uniqueIdSuffix = 0;

    // generate an id and add it to the heading element
    for (const heading of allHeadings) {
        let newId = uniqueIdPrefix + new String(uniqueIdSuffix);

        // if id already exists, add a number to make it unique
        while (allIds.has(newId)) {
            ++uniqueIdSuffix;
            newId += String(uniqueIdSuffix);
        }

        // add the id to the element
        heading.setAttribute('id', newId);
        allIds.add(newId);  // track this new Id
    }
};

const main = (iconFilepath, headingLinkImgStyle) => {
    window.addEventListener('DOMContentLoaded', () => {
        addIdsToHeadings();

        const skipTheseHeadings = (heading) => {
            // skip any descendant of a header element
            if (heading.closest('header')) {
                return true;
            }
        };

        wrapHeadings(skipTheseHeadings);

        addLinksToHeadings(iconFilepath, headingLinkImgStyle, skipTheseHeadings);
    });
};

main(iconFilepath, headingLinkImgStyle);
