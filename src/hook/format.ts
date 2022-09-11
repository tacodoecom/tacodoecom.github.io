import {useMemo, useState} from "react";

const inputStrToNumber = function (str: string, sep: string): number {
  const strWithoutSep = str.replaceAll(sep, "");
  const strWithOnlyDigits = strWithoutSep.replaceAll(/\D/g, "");
  const cleanedUpStr = removeLeadingZeros(strWithOnlyDigits);
  if (cleanedUpStr === "") {
    return 0;
  }
  const value = Number.parseInt(cleanedUpStr);
  if (isNaN(value)) {
    return 0;
  }
  return value;
}

const removeLeadingZeros = function (str: string) {
  while (str.startsWith("0")) {
    str = str.slice(1);
  }
  return str;
}

const formatNumberWithThousandSep = function (value: number, sep: string) {
  if (value === 0) {
    return "0";
  }
  let result = "";
  while (value > 0) {
    for (let i = 0; i < 3 && value > 0; ++i) {
      const digit = value % 10;
      value = Math.floor(value / 10);
      result = digit.toString() + result;
    }
    if (value > 0) {
      result = sep + result;
    }
  }
  return result;
}

export const useNonNegNumberWithThousandSep = function (initialValue: number, sep: string = ","): [number, string, (s: string) => void] {
  const [value, setValue] = useState(initialValue);
  const str = useMemo(() => {
    return formatNumberWithThousandSep(value, sep);
  }, [value, sep]);
  const setStr = function (str: string) {
    setValue(inputStrToNumber(str, sep));
  }
  return [value, str, setStr];
}
