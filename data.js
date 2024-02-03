
class Data {
  constructor(knex) {
    this.knex = knex;
  }

  updateDatabase(instanceId, userAndVirtualHost, password, hostname) {
    this.knex('instances')
    .where('id', instanceId)
    .update({
      user: userAndVirtualHost,
      virtual_host: userAndVirtualHost,
      password,
      hostname
    })
    .catch((err) => { console.log(err); throw err });
  }
}

export default Data;
