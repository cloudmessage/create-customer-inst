import { getKnexEnvOptions } from '../knexoptions.js';
import { expect } from 'chai';

describe('knexOptions', () => {
  it('returns expected object when env is development', () => {
    const env = "development";
    const fileNameOrUrl = "../someDirectory/mydb.sqlite";
    const expectedObject = {
      client: 'sqlite3',
      connection: {
        filename: fileNameOrUrl
      },
      useNullAsDefault: true
    };

    const knexOptions = getKnexEnvOptions(env, fileNameOrUrl);

    expect(knexOptions).to.deep.equal(expectedObject);
  })
})
