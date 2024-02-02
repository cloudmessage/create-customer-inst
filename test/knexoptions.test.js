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
  });

  it('returns expected object when env is production', () => {
    const env = "production";
    const fileNameOrUrl = "postgres://someurl.com";
    const expectedObject = {
      client: 'pg',
      connection: fileNameOrUrl
    };

    const knexOptions = getKnexEnvOptions(env, fileNameOrUrl);

    expect(knexOptions).to.deep.equal(expectedObject);
  });

  it('throws an error when environment arg is not a valid env', async () => {
    const env = "invalid-env";
    const fileNameOrUrl = "does-not-matter";

    expect(() => { getKnexEnvOptions(env, fileNameOrUrl) }).throw("Invalid value for environment");
  });

})
