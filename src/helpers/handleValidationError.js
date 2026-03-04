import createHttpError from 'http-errors';

export const handleValidationError = (validationResult) => {
  console.log('code', validationResult.error.issues[0].code);
  console.error(validationResult.error);

  const errorField =
    validationResult.error.issues[0].path.length === 0
      ? ''
      : ` (fields: '${validationResult.error.issues[0].path.join("' '")}')`;

  let errorMsg = validationResult.error.issues[0].message;

  if (
    validationResult.error.issues[0].code === 'invalid_value' &&
    validationResult.error.issues[0].values.length !== 0
  ) {
    errorMsg = `Invalid option: expected one of '${validationResult.error.issues[0].values.join("', '")}'`;
  }

  throw createHttpError(400, `${errorMsg}${errorField}`);
};
