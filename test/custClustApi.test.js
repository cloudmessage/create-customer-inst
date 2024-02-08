import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import CustomerClusterApi from '../CustomerClusterApi.js';

chai.use(sinonChai);

const { expect } = chai;

describe('CustomerClusterApi', () => {

  beforeEach(() => {
    sinon.restore();
  });

  it('calls axios put with vhosts api call with the passed vhost name appended to url', () => {
  
    const putMock = sinon.mock().resolvesThis("");
    const axiosMock = {
        put: putMock
      };

    const api = new CustomerClusterApi(
      axiosMock,
      "mgmtDummyUsername",
      "mgmtDummyPassword",
      "http://dummy-url.com"
    );

    const managementCredentials = "mgmtDummyUsername:mgmtDummyPassword";
    const base64ManagementCredentials = Buffer.from(managementCredentials).toString("base64");

    const expectedArgs = {
      arg1: "http://dummy-url.com:15672/api/vhosts/myhostname",
      arg2: null,
      arg3: { headers: {
          "content-type": "application/json",
          "Authorization": "Basic " + base64ManagementCredentials
        }
      }
    }

    api.createVhost("myhostname");

    expect(putMock).to.be.calledWith(expectedArgs.arg1, expectedArgs.arg2, expectedArgs.arg3);
  });

})
