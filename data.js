
const updateDatabase = (knex, instanceId, userAndVirtualHost, password, hostname) => {
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

export { updateDatabase };
