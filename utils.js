import randomstring from 'randomstring';

const getRandomUsernameAndVhost = () => {
  const generatedString = randomstring.generate({
    length: 8,
    charset: 'alphabetic',
    capitalization: 'lowercase'
  });

  return generatedString;
}

const generatePassword = () => {
  const generatedString = randomstring.generate({
    length: 32,
    charset: 'alphanumeric'
  });

  return generatedString;
}

export { getRandomUsernameAndVhost, generatePassword };
