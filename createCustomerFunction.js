
const createCustomerFunction = async (data, custClusterApi, utils, custClusterUrl, channel, msg) => {
  const instanceId = msg.content.toString();

  console.log(" [x] Received %s", instanceId);

  const randomString = utils.getRandomUsernameAndVhost()
  const password = utils.generatePassword()

  console.log("Creating vhost and user")

  await custClusterApi.createVhost(randomString);
  await custClusterApi.createUser(randomString, password);
  await custClusterApi.grantPermissions(randomString);

  const url = new URL(custClusterUrl);
  const hostname = url.hostname;

  // update database with instance information
  data.updateDatabase(instanceId, randomString, password, hostname);

  channel.ack(msg);
}

export { createCustomerFunction };
