/** Ids that are unique across a build, for elements that point at each other (popovers, ticket 509). */
let count = 0;
export const nextId = (prefix: string) => `${prefix}-${++count}`;
