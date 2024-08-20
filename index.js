const express = require("express");
const app = express();
const port = 3000;
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const pinata = new pinataSDK(
  "7cdbe6fddada80bd78c4",
  "10e9f931bae9b537d2ba46147b47cc28d0435d4b155a0b1847848217068fb1e1"
);

const readableStreamForFile = fs.createReadStream("./imgs/255999.jpg");
const options = {
  pinataMetadata: {
    name: "MyFile",
  },
  pinataOptions: {
    cidVersion: 0,
  },
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/upload", (req, res) => {
  pinata
    .pinFileToIPFS(readableStreamForFile, options)
    .then((result) => {
      console.log(result);
      res.send(result);
      // The IPFS hash (CID) is in result.IpfsHash
    })
    .catch((err) => {
      console.error(err);
      res.send(err);
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
