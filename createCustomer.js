import axios from 'axios';
import Data from './data.js';
import { getRandomUsernameAndVhost, generatePassword } from './utils.js';

const createCustomerVhostAndUser = function(channel, msg) {
  (async () => {
  var instanceId = msg.content.toString();

  console.log(" [x] Received %s", instanceId);

  const randomString = getRandomUsernameAndVhost()
  const password = generatePassword()

  console.log("Creating vhost and user")

  const managementCredentials = `${process.env.MANAGEMENT_USERNAME}:${process.env.MANAGEMENT_PASSWORD}`;
  const base64ManagementCredentials = Buffer.from(managementCredentials).toString("base64")
  const config = {
    headers: {
      "content-type": "application/json",
      "Authorization": "Basic " + base64ManagementCredentials
    }
  }

  // creating vhost
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/vhosts/` + randomString,
      null,
      config
    )
    console.log(`host ${randomString} created`)
  } catch(err) {
    console.log("host create error: ", err.message)
    throw err
  }

  // creating user
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/users/` + randomString,
      {"password": password, "tags": "customer"},
      config
    )
    console.log(`user ${randomString} created`)
  } catch(err) {
    console.log("user create error: ", err.message)
    throw err
  }

  // grant permissions to user for vhost
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/permissions/${randomString}/${randomString}`,
      {"configure": ".*", "write": ".*", "read": ".*"},
      config
    )
    console.log(`permissions granted to user ${randomString} on vhost ${randomString}`)
  } catch(err) {
    console.log("permissions grant error: ", err.message)
    throw err
  }

  const url = new URL(process.env.CUSTOMER_CLUSTER_URL);
  const hostname = url.hostname;

  // update database with instance information
  Data.updateDatabase(instanceId, randomString, password, hostname);

  channel.ack(msg);
  })();

};


export default { createCustomerVhostAndUser };
