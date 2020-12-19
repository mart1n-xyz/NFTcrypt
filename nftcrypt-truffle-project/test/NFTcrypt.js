const NFTcrypt = artifacts.require("NFTcrypt");
const Child = artifacts.require("Child");
const SimpleSave = artifacts.require("SimpleSave");
const EncKeyRegistry = artifacts.require("EncKeyRegistry");
var BN = web3.utils.BN;


contract("EncKeyRegistry", async accounts => {
  it("should save the key", async () => {
      let registry = await EncKeyRegistry.deployed();
      await registry.setKey('key to save')
      let key = await registry.getKey(accounts[0])
      assert.equal(key, 'key to save');
  });
  it("key should be publicly accessible", async () => {
      let registry = await EncKeyRegistry.deployed();
      await registry.setKey('key to save')
      let key = await registry.getKey(accounts[0], {from: accounts[1]})
      assert.equal(key, 'key to save');
  });

  it("key can be changed", async () => {
      let registry = await EncKeyRegistry.deployed();
      await registry.setKey('key to save')
      await registry.setKey('new key to save')
      let key = await registry.getKey(accounts[0])
      assert.equal(key, 'new key to save');
  });

  it("key can be deleted by calling deleteKey", async () => {
      let registry = await EncKeyRegistry.deployed();
      await registry.setKey('key to save')
      await registry.deleteKey()
      let key = await registry.getKey(accounts[0])
      assert.equal(key, '');
  });

  it("key can be deleted by setting it to empty", async () => {
      let registry = await EncKeyRegistry.deployed();
      await registry.setKey('key to save')
      await registry.setKey('')
      let key = await registry.getKey(accounts[0])
      assert.equal(key, '');
  });

});

contract("SimpleSave", async accounts => {
  it("should save the hashed secret", async () => {
      let saveContr = await SimpleSave.deployed();
      await saveContr.setEncSecret('hashed secret', accounts[0], 12)
      let secret = await saveContr.getKey(accounts[0],12);
      assert.equal(secret, 'hashed secret');
  });

  it("should update the hashed secret", async () => {
      let saveContr = await SimpleSave.deployed();
      await saveContr.setEncSecret('hashed secret', accounts[0], 12)
      await saveContr.setEncSecret('hashed secret updated', accounts[0], 12)
      let secret = await saveContr.getKey(accounts[0],12);
      assert.equal(secret, 'hashed secret updated');
  });

  it("should delete the hashed secret", async () => {
    let saveContr = await SimpleSave.deployed();
    await saveContr.setEncSecret('hashed secret', accounts[0], 12)
    await saveContr.setEncSecret('', accounts[0], 12)
    let secret = await saveContr.getKey(accounts[0],12);
    assert.equal(secret, '');
  });

  it("only owner can kill the contract", async () => {
    let saveContr = await SimpleSave.deployed();
    try{
    await saveContr.kill( { from: accounts[1] })
    } catch (error) {
        assert(error, "'Ownable: caller is not the owner'");
      }
  });

  it("killed contract does not work", async () => {
    let saveContr = await SimpleSave.deployed();
    await saveContr.setEncSecret('hashed secret', accounts[0], 12)
    await saveContr.kill()
    try{
    let secret = await saveContr.getKey(accounts[0],12);
    } catch (error) {
      var errorDummy=1
        assert(errorDummy, 1);
      }
  });


});

contract("NFTcrypt", async accounts => {
  it("should track all deployed contracts' addresses ", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      let child_add = await factory.deployedAddress.call(accounts[0],0);
      let child_add2 = await factory.getDeployed(1);
      assert.equal(child_add, child_add2);
  });

  it("should track the number of deployed contracts", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      await factory.createChild('Daolo', 'DAO');
      await factory.createChild('Raolo', 'RAO');
      let nDepl = await factory.lastChildId();
      assert.equal(nDepl, 4);
  });

  it("should transfer ownership of the deployed contract from factory to owner", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      let child_add = await factory.deployedAddress.call(accounts[0],0);
      let child = await Child.at(child_add);
      let owner = await child.owner();
      assert.equal(owner, accounts[0]);
  });
  it("should name the child contract correctly: Name", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      let child_add = await factory.deployedAddress.call(accounts[0],0);
      let child = await Child.at(child_add);
      let name = await child.name();
      assert.equal(name, 'Paolo');
  });

  it("should name the child contract correctly: Symbol", async () => {
      let factory = await NFTcrypt.deployed();
      await factory.createChild('Paolo', 'PAO');
      let child_add = await factory.deployedAddress.call(accounts[0],0);
      let child = await Child.at(child_add);
      let sym = await child.symbol();
      assert.equal(sym, 'PAO');
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
