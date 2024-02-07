// import axios from 'axios';
class CustomerClusterApi {
  constructor(axios, managementUserName, managementPassword, custClusterUrl) {
    this.axios = axios;
    this.managementUserName = managementUserName;
    this.managementPassword = managementPassword;
    this.custClusterUrl = custClusterUrl;
  }

getConfig() {
  const managementCredentials = `${this.managementUserName}:${this.managementPassword}`;
  const base64ManagementCredentials = Buffer.from(managementCredentials).toString("base64")
  const config = {
    headers: {
      "content-type": "application/json",
      "Authorization": "Basic " + base64ManagementCredentials
    }
  }

  return config;
}

async createVhost(randomString) {
  try {
    await this.axios.put(
      `${this.custClusterUrl}:15672/api/vhosts/` + randomString,
      null,
      this.getConfig()
    )
    console.log(`host ${randomString} created`)
  } catch(err) {
    console.log("host create error: ", err.message)
    throw err
  }
}

async createUser(randomString, password) {
  try {
    await this.axios.put(
      `${this.custClusterUrl}:15672/api/users/` + randomString,
      {"password": password, "tags": "customer"},
      this.getConfig()
    )
    console.log(`user ${randomString} created`)
  } catch(err) {
    console.log("user create error: ", err.message)
    throw err
  }
}

async grantPermissions(randomString) {
  // grant permissions to user for vhost
  try {
    await this.axios.put(
      `${this.custClusterUrl}:15672/api/permissions/${randomString}/${randomString}`,
      {"configure": ".*", "write": ".*", "read": ".*"},
      this.getConfig()
    )
    console.log(`permissions granted to user ${randomString} on vhost ${randomString}`)
  } catch(err) {
    console.log("permissions grant error: ", err.message)
    throw err
  }
}
}

export default CustomerClusterApi;
