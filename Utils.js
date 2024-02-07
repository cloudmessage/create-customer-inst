
class Utils {
  constructor(randomstringLib) {
    this.randomstringLib = randomstringLib;
  }

  getRandomUsernameAndVhost() {
    const generatedString = this.randomstringLib.generate({
      length: 8,
      charset: 'alphabetic',
      capitalization: 'lowercase'
    });

    return generatedString;
  }

  generatePassword() {
    const generatedString = this.randomstringLib.generate({
      length: 32,
      charset: 'alphanumeric'
    });

    return generatedString;
  }
}

export default Utils;
