import chalk from "chalk";

export async function logg(isMulti) {
  return {
    error: function (type, value) {
      console.log(
        chalk.red(`[  ${type}${isMulti ? " - MULTI-SESSION " : " "}] =>`) +
          value
      );
    },

    text: function (type, value) {
      console.log(
        chalk.blue(`[ ${type}${isMulti ? " - MULTI-SESSION " : " "}] => `) +
          value
      );
    },

    coneksi: function (type, value) {
      console.log(
        chalk.yellow(`[ ${type}${isMulti ? " - MULTI-SESSION " : " "}] => `) +
          value
      );
    },
  };
}
