/**
 * @author Mark gelafin.github.io
 * @license MIT
 *  Instantly adds links next to all headings on a page,
 *  and handles navigation using the heading links.
 * 
 *  Requires an icon file at images/icons/link-icon.svg
 * 
 *  Copying heading style to wrappers relies on cascade,
 *  so if you have !important in your heading style,
 *  this feature might not work as expected
 */
// define heading link styling
const headingLinkImgStyle = `height: 0.7em; margin-left: 11px; opacity: 0.2`;

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
 * Credit for appending to style: https://stackoverflow.com/a/5192938/14257952
 */
const wrapHeadings = (skipCondition) => {
    const headings = getAllHeadings();

    for (const heading of headings) {
        if (!skipCondition || skipCondition(heading) != true) {
            // create wrapper div to order link and heading horizontally
            const wrapperElement = document.createElement('div');

            // add wrapper layout styling
            wrapperElement.style['display'] = 'flex';
            wrapperElement.style['flex-flow'] = 'row wrap';

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
 * credit for hover effect: https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseover_event
 */
const createLinkToHeading = (headingElement, iconFilepath, headingLinkImgStyle) => {
    const anchorElement = document.createElement('a');
    anchorElement.href = '#' + headingElement.getAttribute('id');
    anchorElement.name = headingElement.getAttribute('id');

    const imageElement = document.createElement('img');
    imageElement.src = iconFilepath;
    imageElement.alt = '';
    imageElement.setAttribute('style', headingLinkImgStyle);

    // copy current style
    const originalOpacity = imageElement.style['opacity'];
    const originalBorderBottom = imageElement.style['border-bottom'];

    // listener to apply hover style
    imageElement.addEventListener('mouseover', (event) => {
        // apply style
        event.target.style['opacity'] = '1';
        event.target.style['border-bottom']  = '2px solid black';
    });

    // listener to remove hover style
    imageElement.addEventListener('mouseout', (event) => {
        // reset to original style after a short delay
        event.target.style['opacity'] = originalOpacity;
        event.target.style['border-bottom'] = originalBorderBottom;
    });

    anchorElement.appendChild(imageElement);

    return anchorElement;
};

/**
 * inserts links corresponding to each heading
 * into the DOM just before each heading element
 * @param iconFilepath path to link icon
 * @param headingLinkImgStyle string to set as icon style
 * @param skipCondition function returning true if a heading should be skipped
 * @param placement if 
 *                  'before': will insert link as previous sibling of heading
 *                  'child': will insert link as child of heading
 */
const addLinksToHeadings = async (iconFilepath, headingLinkImgStyle, skipCondition, placement) => {
    const allHeadings = getAllHeadings();

    // create a new link element for each heading and append links
    // as previous siblings to their corresponding headings
    for (const heading of allHeadings) {
        if (!skipCondition || skipCondition(heading) != true) {
            const linkElement = createLinkToHeading(heading, iconFilepath, headingLinkImgStyle);
  
            switch (placement) {
                case 'before':
                    // insert link as previous sibling of heading
                    heading.parentNode.insertBefore(linkElement, heading);
                    
                    break;
                case 'child':
                    // insert link as child of heading
                    heading.appendChild(linkElement);
                    
                    break;
            }
        }
    }
};

/**
 * adds unique Ids to each heading element
 * credit: select all IDs from https://stackoverflow.com/a/50407737/14257952
 * credit: encode URI from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
 */
const addIdsToHeadings = () => {
    const allHeadings = getAllHeadings();
    const allIds = new Set(document.querySelectorAll('[id]'));
    let uniqueIdSuffix = 0;

    // generate an id and add it to the heading element
    for (const heading of allHeadings) {
        let uniqueIdPrefix = encodeURI(heading.textContent);
        let newId = uniqueIdPrefix + new String(uniqueIdSuffix);

        // if id already exists, increment number to make it unique
        while (allIds.has(newId)) {
            uniqueIdSuffix = Number(uniqueIdSuffix) + 1;
            newId = uniqueIdPrefix + String(uniqueIdSuffix);
        }

        // add the id to the element
        heading.setAttribute('id', newId);
        allIds.add(newId);  // track this new Id
    }
};

/**
 * scrolls the page to the id taken from the current page URL;
 * does nothing if the id is not present and valid
 */
const scrollToIdInUrl = (redirectTable) => {
    const idInUrl = window.location?.hash;

    if (idInUrl) {
        // remove "#" from before id
        let sectionId = idInUrl.split('#').slice(1)[0];

        // respect redirect Table
        sectionId = Object.keys(redirectTable).includes(sectionId) ?
            redirectTable[sectionId] :
            sectionId;
        
        document.getElementById(sectionId)?.scrollIntoView();
    }
};

const main = (iconFilepath, headingLinkImgStyle) => {
    window.addEventListener('load', async () => {  // use load to wait for CSS
        addIdsToHeadings();

        const skipTheseHeadings = (heading) => {
            // skip any descendant of a header element
            if (heading.closest('header')) {
                return true;
            }
        };

        // This is the place to call wrapHeadings if using that option!

        await addLinksToHeadings(iconFilepath, headingLinkImgStyle, skipTheseHeadings, 'child');

        const redirectTable = {'heading-link-id-4': 'YayReplay%20-%202019-20200'};
        scrollToIdInUrl(redirectTable);
    });
};

main(iconFilepath, headingLinkImgStyle);
