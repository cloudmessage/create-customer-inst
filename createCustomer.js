import Data from './data.js';
import * as custClusterApi from './customerClusterApi.js';
import { getRandomUsernameAndVhost, generatePassword } from './utils.js';

const createCustomerVhostAndUser = function(channel, msg) {
  (async () => {
  var instanceId = msg.content.toString();

  console.log(" [x] Received %s", instanceId);

  const randomString = getRandomUsernameAndVhost()
  const password = generatePassword()

  console.log("Creating vhost and user")

  await custClusterApi.createVhost(randomString);
  await custClusterApi.createUser(randomString, password);
  await custClusterApi.grantPermissions(randomString);

  const url = new URL(process.env.CUSTOMER_CLUSTER_URL);
  const hostname = url.hostname;

  // update database with instance information
  Data.updateDatabase(instanceId, randomString, password, hostname);

  channel.ack(msg);
  })();

};

export default { createCustomerVhostAndUser };
