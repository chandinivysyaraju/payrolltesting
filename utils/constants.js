// module.exports = {
//   fixedPoint : Math.pow(10, 10),
//   defaultCurrency: 'BEL', // default currency symbole for Belrium
//   totalSupply: 2100000000000000000,
//   URL: "http://54.254.174.74:8080",
//   URC:"http://localhost:9305",
//   fees: {
//     send: 0.001,
//     inTransfer: 0.001,
//     outTransfer: 0.001
//   },
//   links: {
//     // centralServer: "http://52.201.227.220:8080"
//     centralServer: "http://localhost:8081"
//   }
// }


module.exports = {
  fixedPoint : Math.pow(10, 10),
  defaultCurrency: 'BEL', // default currency symbole for Belrium
  totalSupply: 2100000000000000000,
  URL: "http://54.254.174.74:8080",
  URC:"http://54.157.252.226:9305",
  fees: {
    send: 0.001,
    inTransfer: 0.001,
    outTransfer: 0.001
  },
  links: {
    // centralServer: "http://52.201.227.220:8080"
    centralServer: "http://52.201.227.220:8080"
  }
}
