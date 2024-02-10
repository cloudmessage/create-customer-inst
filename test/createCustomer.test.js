import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createCustomerFunction } from '../createCustomerFunction.js';

chai.use(sinonChai);
const { expect } = chai;

describe('createCustomer', () => {

  beforeEach(() => {
    sinon.restore();
  });

  it('calls axios put with vhosts api call with the passed vhost name appended to url', async () => {

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
      createVhost: mockCreateVhost,
      createUser: mockCreateUser,
      grantPermissions: mockGrantPermissions
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
    
    await createCustomerFunction(
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
