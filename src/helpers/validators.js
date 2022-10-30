/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  allPass,
  anyPass,
  compose,
  count,
  curry,
  equals,
  lte,
  not,
  prop,
  values,
} from "ramda";

const getStar = prop("star");
const getSquare = prop("square");
const getTriangle = prop("triangle");
const getCircle = prop("circle");

const isGreen = equals("green");
const isWhite = equals("white");
const isRed = equals("red");
const isOrange = equals("orange");
const isBlue = equals("blue");

const isNotWhite = compose(not, isWhite);
const isNotRed = compose(not, isRed);

const areTwoValuesSame = (values) => equals(...values);

const getTriangleAndSquare = (event) => [getTriangle(event), getSquare(event)];

const isColorFigure = (getFigure, isColor) => compose(isColor, getFigure);
const curriedIsColorFigure = curry(isColorFigure);
const isColorStar = curriedIsColorFigure(getStar);

const countColor = (color) => compose(count(color), values);
const hasCountColor = (count, color) => compose(lte(count), countColor(color));
const equalsCountColor = (count, color) =>
  compose(equals(count), countColor(color));
// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isColorFigure(getStar, isRed),
  isColorFigure(getSquare, isGreen),
  isColorFigure(getTriangle, isWhite),
  isColorFigure(getCircle, isWhite),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = hasCountColor(2, isGreen);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (event) =>
  equals(countColor(isRed)(event), countColor(isBlue)(event));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isColorFigure(getCircle, isBlue),
  isColorStar(isRed),
  isColorFigure(getSquare, isOrange),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  hasCountColor(3, isGreen),
  hasCountColor(3, isOrange),
  hasCountColor(3, isRed),
  hasCountColor(3, isBlue),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isColorFigure(getTriangle, isGreen),
  equalsCountColor(2, isGreen),
  equalsCountColor(1, isRed),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = equalsCountColor(4, isOrange);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
  allPass([isNotRed, isNotWhite]),
  getStar
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = equalsCountColor(4, isGreen);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = compose(
  allPass([equalsCountColor(0, isWhite), areTwoValuesSame]),
  getTriangleAndSquare
);
