import knexEnvOptions from './knexoptions.js';
import Knex from 'knex';

const updateDatabase = (instanceId, userAndVirtualHost, password, hostname) => {
  const knexOptions = knexEnvOptions[process.env.NODE_ENV];
  const knex = Knex(knexOptions);

  knex('instances')
  .where('id', instanceId)
  .update({
    user: userAndVirtualHost,
    virtual_host: userAndVirtualHost,
    password,
    hostname
  })
  .catch((err) => { console.log(err); throw err });
}

export default { updateDatabase };
