export interface RuntimeStorage {
  codeReviews: Record<string, string[]>;
}

const data: RuntimeStorage = {
  codeReviews: {}
};

export const getItem = <K extends keyof RuntimeStorage>(key: K, defaultValue?: RuntimeStorage[K]): RuntimeStorage[K] | undefined => data[key] || defaultValue;
export const setItem = <K extends keyof RuntimeStorage>(key: K, value: RuntimeStorage[K]): RuntimeStorage[K] => (data[key] = value);

export const addCodeReview = (mrId: number, dateTime: string) => {
  const crs = getItem('codeReviews') || {};
  if (!crs[mrId]) {
    crs[mrId] = [];
  }
  if (!crs[mrId].includes(dateTime)) {
    crs[mrId].push(dateTime);
  }
  setItem('codeReviews', crs);
}

export const codeReviewExists = (mrId: number, dateTime: string): boolean =>
  !!(getItem('codeReviews') || {})?.[mrId]?.includes(dateTime)
