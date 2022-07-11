const hre = require("hardhat");
const { writer_info_all } = require('./tool/hh_log.js');

async function main(){
  const TE_order = await hre.ethers.getContractFactory("TE_order");
  const te_order = await TE_order.deploy(
    );
  await te_order.deployed();
  console.log("TE_order deployed to:", te_order.address);
  let Artifact = await artifacts.readArtifact("TE_order");
  await writer_info_all(network,Artifact, te_order,null);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });