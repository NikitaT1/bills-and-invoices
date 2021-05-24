async function sleep(fn, par) {
  return await setTimeout(
    async function () {
      await fn(par);
    },
    3000,
    fn,
    par
  );
}

module.exports = async function (res) {
  console.log(res);
  await sleep((a) => {
    console.log(a);
  }, {});
  return { foo: "bar" };
};
