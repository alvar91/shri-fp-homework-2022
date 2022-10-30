/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from "../tools/api";
import {
  allPass,
  compose,
  ifElse,
  tap,
  length,
  partial,
  gt,
  lt,
  andThen,
  __,
  test,
  assoc,
  prop,
  mathMod,
  concat,
  otherwise,
} from "ramda";

const api = new Api();

const API_NUMBERS_URL = "https://api.tech/numbers/base";
const API_ANIMALS_URL = "https://animals.tech/";

const getApiResult = compose(String, prop("result"));
const thenGetApiResult = andThen(getApiResult);

const lengthGreaterThenTwo = compose(gt(__, 2), length);
const lengthLowerThenTen = compose(lt(__, 10), length);
const onlyNumbers = test(/^[0-9]+\.?[0-9]+$/);
const validate = allPass([
  lengthGreaterThenTwo,
  lengthLowerThenTen,
  onlyNumbers,
]);

const stringToNumber = compose(Math.round, Number);

const getLength = andThen(length);

const getSquare = andThen((num) => num ** 2);

const getModForThree = andThen(compose(String, mathMod(__, 3)));

const getBinaryBase = compose(
  api.get(API_NUMBERS_URL),
  assoc("number", __, { from: 10, to: 2 })
);
const getAnimals = andThen(compose(api.get(__, {}), concat(API_ANIMALS_URL)));

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  const tapLog = tap(writeLog);
  const thenTapLog = andThen(tapLog);

  const thenHandleSuccess = andThen(handleSuccess);

  const otherwiseHandleError = otherwise(handleError);
  const handleValidationError = partial(handleError, ["ValidationError"]);

  const doAndLog = (x) => compose(thenTapLog, x);

  const sequenceComposition = compose(
    otherwiseHandleError,
    thenHandleSuccess,
    thenGetApiResult,
    getAnimals,
    doAndLog(getModForThree),
    doAndLog(getSquare),
    doAndLog(getLength),
    thenTapLog,
    thenGetApiResult,
    getBinaryBase,
    tapLog,
    stringToNumber
  );

  compose(
    ifElse(validate, sequenceComposition, handleValidationError),
    tapLog
  )(value);
};

export default processSequence;
