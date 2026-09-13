import { paginate } from './pagination'

describe('paginate', () => {
  it('slices the given page out of the items', () => {
    const items = [1, 2, 3, 4, 5]

    expect(paginate(items, 2, 2)).toEqual({
      data: [3, 4],
      page: 2,
      limit: 2,
      total: 5,
      totalPages: 3,
    })
  })

  it('returns an empty page when requesting a page beyond the data', () => {
    const items = [1, 2, 3]

    expect(paginate(items, 5, 10)).toEqual({
      data: [],
      page: 5,
      limit: 10,
      total: 3,
      totalPages: 1,
    })
  })

  it('reports at least 1 total page even for an empty list', () => {
    expect(paginate([], 1, 20).totalPages).toBe(1)
  })
})
