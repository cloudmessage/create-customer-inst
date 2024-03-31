
class Data {
  constructor(knex) {
    this.knex = knex;
  }

  updateDatabase(instanceId, userAndVirtualHost, password, hostname) {
    this.knex(process.env.INSTANCES_TABLE_NAME)
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
