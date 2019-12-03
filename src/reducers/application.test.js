import reducer from 'reducers/application';

describe('throws an error with an unsupported type', () => {
  it('throws an error with an unsupported type', () => {
    expect(() => reducer({}, { type: null })).toThrowError(/tried to reduce with unsupported action of type null./i);
  });
});