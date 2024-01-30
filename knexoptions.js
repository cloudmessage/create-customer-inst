const getKnexEnvOptions = (environment, fileNameOrUrl) => {
  if (environment !== 'development' && environment !== 'production') {
    throw new Error("Invalid value for environment")
  }

  const options = {
    development: {
      client: 'sqlite3',
      connection: {
        filename: fileNameOrUrl
      },
      useNullAsDefault: true
    },
    production: {
      client: 'pg',
      connection: fileNameOrUrl
    }
  }

  return options[environment];
}

export { getKnexEnvOptions };
