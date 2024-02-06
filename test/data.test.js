import { expect } from 'chai';
import sinon from 'sinon';
import Data from '../Data.js';

describe('data', () => {
  const whereMock = sinon.mock().returnsThis();
  const updateMock = sinon.mock().resolves([]);
  const knexMock = sinon.mock().callsFake(() => {
    return {
      where: whereMock,
      update: updateMock
    }
  });

  const data = new Data(knexMock);

  it('calls knex with expected argument and chained methods', () => {
    const instanceId = 12345;
    const randomString = "zyxwvu";
    const password = "abc123";
    const hostname = "https://some-url.com";

    data.updateDatabase(instanceId, randomString, password, hostname);

    expect(knexMock.calledWith('instances')).to.be.true;
    expect(whereMock.calledWith('id', instanceId)).to.be.true;
  });
})
