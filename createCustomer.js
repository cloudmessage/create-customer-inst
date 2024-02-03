import { updateDatabase } from './data.js';
import * as custClusterApi from './customerClusterApi.js';
import { getRandomUsernameAndVhost, generatePassword } from './utils.js';
import { getKnexEnvOptions } from './knexoptions.js';
import Knex from 'knex';

const createCustomerVhostAndUser = function(channel, msg) {
  (async () => {
    const instanceId = msg.content.toString();
    const knexOptions = getKnexEnvOptions(process.env.NODE_ENV, process.env.FILENAME_OR_DB_URL);
    const knex = Knex(knexOptions);

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
    updateDatabase(knex, instanceId, randomString, password, hostname);

    channel.ack(msg);
  })();

};

export default { createCustomerVhostAndUser };
