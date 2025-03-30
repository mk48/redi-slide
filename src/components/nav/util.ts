import type { TreeLink } from "./types";

const findLinkInTree = (activeUrl: string, links: TreeLink[]): TreeLink | undefined => {
  for (const link of links) {
    if (link.url === activeUrl) {
      return link;
    }

    if (link.children && link.children.length > 0) {
      const foundLink = findLinkInTree(activeUrl, link.children);
      if (foundLink) {
        return foundLink;
      }
    }
  }
  return undefined;
};

const findUrlIndex = (activeUrl: string, links: TreeLink[]): number => {
  for (let i = 0; i < links.length; i++) {
    const link = links[i];

    if (link.url === activeUrl) {
      return i;
    }

    if (link.children && link.children.length > 0) {
      const childIndex = findUrlIndex(activeUrl, link.children);
      if (childIndex !== -1) {
        return childIndex;
      }
    }
  }
  return -1;
};

export const moveNext = (activeUrl: string, links: TreeLink[]): string | undefined => {
  const foundLink = findLinkInTree(activeUrl, links);
  if (!foundLink) {
    return undefined;
  }

  if (foundLink.children && foundLink.children.length > 0) {
    return foundLink.children[0].url;
  }

  const index = findUrlIndex(activeUrl, links);
  if (index !== -1 && index + 1 < links.length) {
    const nextLink = links[index + 1];
    if (nextLink.url) {
      return nextLink.url;
    } else if (nextLink.children && nextLink.children.length > 0) {
      return nextLink.children[0].url;
    }
  }

  return undefined;
};

export const movePrevious = (activeUrl: string, links: TreeLink[]): string | undefined => {
  const index = findUrlIndex(activeUrl, links);
  if (index !== -1 && index - 1 >= 0) {
    const prevLink = links[index - 1];
    if (prevLink.url) {
      return prevLink.url;
    } else if (prevLink.children && prevLink.children.length > 0) {
      return prevLink.children[prevLink.children.length - 1].url;
    }
  }
  return undefined;
};
