
const createCustomerVhostAndUser = (createCustomerFunction, data, custClusterApi, utils, custClusterUrl, channel, msg) => {
  (async () => {
    await createCustomerFunction(
      data,
      custClusterApi,
      utils,
      custClusterUrl,
      channel,
      msg
    );
  })();

};

export default { createCustomerVhostAndUser };
