import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createCustomer from '../createCustomer.js';

chai.use(sinonChai);
const { expect } = chai;

describe('createCustomer', () => {

  beforeEach(() => {
    sinon.restore();
  });

  it.skip('calls axios put with vhosts api call with the passed vhost name appended to url', async () => {

    //
    // arrange
    //

    // mock data Object
    const mockUpdateDatabase = sinon.stub().returns();
    const mockData = {
      updateDatabase: mockUpdateDatabase
    }

    // mock api Object
    const mockCreateVhost = sinon.stub();
    const mockCreateUser = sinon.stub();
    const mockGrantPermissions = sinon.stub();
    const mockApi = {
      createVhost: async() => { mockCreateVhost },
      createUser: async() => { mockCreateUser() },
      grantPermissions: async() => { mockGrantPermissions() }
    }

    // mock utils
    const mockGetRandomUsernameAndVhost = sinon.stub().returns("myUserAndHost");
    const mockGeneratePassword = sinon.stub().returns("secret-password");
    const mockUtils = {
      getRandomUsernameAndVhost: mockGetRandomUsernameAndVhost,
      generatePassword: mockGeneratePassword
    }

    // supply customer cust url
    const custClusterUrl = "https://dummy-url.com";

    // mock channel
    const mockAck = sinon.stub();
    const mockChannel = {
      ack: mockAck
    }

    // supply message
    const instanceId = 12345;
    const message = {
      content: instanceId
    }

    //
    // act
    //

    // make call to createCustomer.createCustomerVhostAndUser
    
    createCustomer.createCustomerVhostAndUser(
      mockData,
      mockApi,
      mockUtils,
      custClusterUrl,
      mockChannel,
      message
    )

    //
    // assert
    //

    // console.log("getCall", mockGrantPermissions.getCall(0));
    expect(mockGetRandomUsernameAndVhost).to.be.calledOnce;
    expect(mockGeneratePassword).to.be.calledOnce;
    expect(mockCreateVhost).to.be.calledWith("myUserAndHost");
    expect(mockCreateUser).to.be.calledWith("myUserAndHost", "secret-password");
    expect(mockGrantPermissions).to.be.calledWith("myUserAndHost");
  });

})
