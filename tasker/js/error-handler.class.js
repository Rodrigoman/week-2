class ErrorHandler {
  constructor(rules) {
    const { required, maxCharacters } = rules;
    this.required = required;
    this.maxCharacters = maxCharacters;
  }

  /**
   * this is used to validate agains the rules
   * (*) I converted isNotEmpty() and  isBelowMaxCharacters() to une sinlge function
   * @param value the value to be evaluated
   */
  isValid(value) {
    let isValid = true;
    if (this.required) {
      switch (value) {
        case '':
          isValid = false;
          break;
        case ' ':
          isValid = false;
          break;
        case value.length > 100:
          isValid = false;
          break;
        default:
          isValid = true;
          break;
      }
    }
    return isValid;
  }
}

export default ErrorHandler;
