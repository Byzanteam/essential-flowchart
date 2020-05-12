import { buildEmptyMatrix } from '@/utils/matrix';

describe('buildEmptyMatrix', () => {
  it('build an empty matrix', () => {
    const matrix = buildEmptyMatrix(100, 100);

    const row = new Array(100).fill(0);

    for (let i = 0; i < 100; i += 1) {
      expect(matrix[i]).toEqual(row);
    }
  });
});
