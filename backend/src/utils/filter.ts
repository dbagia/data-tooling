import { RawRecentFilings } from '../types/submissions'
import { fieldIndexMaps } from '../usecases/getSubmissionsWithoutTransform'

// Call this to create a Map of value -> [idx]
// When filtering by a specific field, the indexMap created by this function will 
// return all the indices matching the filter in O(1) lookup
export const createIndexMap = (fieldName: keyof RawRecentFilings, arr: any[]) => {
  for(const key of Object.keys(fieldIndexMaps)) {
  const indexMap = fieldIndexMaps[key as keyof RawRecentFilings]
  if(!indexMap) {
    throw new Error('Attempted to fetch index map for an undefined Filings field. Check fieldIndexMaps.')
  }
    
  }
  const indexMap = fieldIndexMaps[fieldName]
  if(!indexMap) {
    throw new Error('Attempted to fetch index map for an undefined Filings field. Check fieldIndexMaps.')
  }

  arr.forEach((value, idx) => {
    const valueIndexes = indexMap.get(value)

    if(valueIndexes) {
      valueIndexes.push(idx)
    } else {
      indexMap.set(value, [idx])
    }
  })
}
