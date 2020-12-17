const NFTcrypt = artifacts.require("NFTcrypt");
const Child = artifacts.require("Child");
var BN = web3.utils.BN;

contract("NFTcrypt", async accounts => {
  it("should transfer ownership of the deployed contract from factory to owner", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      let child_add = await factory.deployedAddress.call(accounts[0],0);
      let child = await Child.at(child_add);
      let owner = await child.owner();
      assert.equal(owner, accounts[0]);
  });

});

contract("Child", async accounts => {
  it("owner can issue NFT", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    //let owner = await child.owner();
    await child.NewToBatch(2,2);
    let batchSize = (await child.batchSize(1)).toNumber();
    assert.equal(batchSize, 2);
  });

  it("owner can assign URI", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    await child.NewToBatch(2,2);
    await child.setBatchTokenURI(1,'test');
    let metadata = await child.tokenURI(1);
    let metadata2 = await child.tokenURI(2);
    assert.equal(metadata, metadata2,'test');
  });
  it("owner can issue and assign URI", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    await child.NewToBatch(2,2);
    await child.newBatchWithURI(3,'test');
    let metadata = await child.tokenURI(1);
    let metadata2 = await child.tokenURI(2);
    assert.equal(metadata, metadata2,'test');
  });
  it("owner can set price", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    await child.NewToBatch(2,2);
    await child.newBatchWithURI(3,'test');
    await child.setPrice(1,2);
    let price = (await child.getPrice(1)).toNumber();
    assert.equal(price, 2);
  });

  it("anyone can purchase", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    await child.NewToBatch(2,2);
    await child.newBatchWithURI(3,'test');
    await child.setPrice(1,2);
    await child.purchase(1, { from: accounts[1],value: 2 });
    let owner1 = await child.ownerOf(1);
    assert.equal(owner1,accounts[1]);
  });

  it("owner can set the secret", async () => {;
    let factory = await NFTcrypt.deployed();
    await factory.createChild('Paolo', 'PAO');
    let child_add = await factory.deployedAddress.call(accounts[0],0);
    let child = await Child.at(child_add);
    await child.newBatchWithURI(3,'test');
    await child.setPrice(3,2);
    await child.purchase(3, { from: accounts[1],value: 2 });
    await child.setEncSecret(3,'hello world, this is not encrypted');
    let secret = await child.viewEncSecret.call(3);
    assert.equal(secret,'hello world, this is not encrypted');
  });


});
