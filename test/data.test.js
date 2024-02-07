import { expect } from 'chai';
import sinon from 'sinon';
import Data from '../Data.js';

describe('data, updateDatabase', () => {

  beforeEach(() => {
    sinon.restore();
  });

  it('calls knex with expected argument and chained methods', () => {
    const whereMock = sinon.mock().returnsThis();
    const updateMock = sinon.mock().resolves([]);
    const knexMock = sinon.mock().callsFake(() => {
      return {
        where: whereMock,
        update: updateMock
      }
    });
  
    const data = new Data(knexMock);

    const instanceId = 12345;
    const userAndVirtualHost = "zyxwvu";
    const password = "abc123";
    const hostname = "https://some-url.com";

    data.updateDatabase(instanceId, userAndVirtualHost, password, hostname);

    const expectedUpdateArg = {
      user: userAndVirtualHost,
      virtual_host: userAndVirtualHost,
      password: password,
      hostname: hostname
    };

    expect(knexMock.calledWith('instances')).to.be.true;
    expect(whereMock.calledWith('id', instanceId)).to.be.true;
    expect(updateMock.calledWith(expectedUpdateArg)).to.be.true;
  });

  it('throws error when knex throws error', () => {
    const knexMock = sinon.mock().throwsException('some error');

    const data = new Data(knexMock);

    const instanceId = 12345;
    const userAndVirtualHost = "zyxwvu";
    const password = "abc123";
    const hostname = "https://some-url.com";

    expect(() => { data.updateDatabase(instanceId, userAndVirtualHost, password, hostname) }).throw('some error');
  });
})
