import axios from 'axios';

const getConfig = () => {
  const managementCredentials = `${process.env.MANAGEMENT_USERNAME}:${process.env.MANAGEMENT_PASSWORD}`;
  const base64ManagementCredentials = Buffer.from(managementCredentials).toString("base64")
  const config = {
    headers: {
      "content-type": "application/json",
      "Authorization": "Basic " + base64ManagementCredentials
    }
  }

  return config;
}

const createVhost = async (randomString) => {
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/vhosts/` + randomString,
      null,
      getConfig()
    )
    console.log(`host ${randomString} created`)
  } catch(err) {
    console.log("host create error: ", err.message)
    throw err
  }
}

const createUser = async (randomString, password) => {
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/users/` + randomString,
      {"password": password, "tags": "customer"},
      getConfig()
    )
    console.log(`user ${randomString} created`)
  } catch(err) {
    console.log("user create error: ", err.message)
    throw err
  }
}

const grantPermissions = async (randomString) => {
  // grant permissions to user for vhost
  try {
    await axios.put(
      `${process.env.CUSTOMER_CLUSTER_URL}:15672/api/permissions/${randomString}/${randomString}`,
      {"configure": ".*", "write": ".*", "read": ".*"},
      getConfig()
    )
    console.log(`permissions granted to user ${randomString} on vhost ${randomString}`)
  } catch(err) {
    console.log("permissions grant error: ", err.message)
    throw err
  }
}

export { createVhost, createUser, grantPermissions };
