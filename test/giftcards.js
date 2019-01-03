const Giftcards = artifacts.require("./Giftcards.sol");

contract('Giftcards', function(accounts) {
  const code = 'supersecret code';
  const bytes = web3.utils.toHex(code);
  const hash = web3.utils.keccak256(code);
  const owner = accounts[0];
  const redeemer = accounts[1];

  it('can issue new giftcards, cannot issue twice', async () => {
    const instance = await Giftcards.new.call(owner);

    await instance.issue(hash, 2000);

    try {
      await instance.issue(hash, 2000);
      assert.fail('Should never get here');
    } catch (error) {
      assert.ok(/Giftcard already issued/.test(error.message));
    }
  });

  it('can issue new giftcard, redeem it and view balance', async () => {
    const instance = await Giftcards.new.call(owner);

    await instance.issue(hash, 2000);
    await instance.redeem(bytes, {
      from: redeemer
    });
    
    const balance = await instance.getBalance({
      from: redeemer
    });

    assert.strictEqual(balance.toNumber(), 2000);
  });

  it('can not redeem invalid code', async () => {
    const instance = await Giftcards.new.call(owner);

    try {
      await instance.redeem(bytes, {
        from: redeemer
      });
      assert.fail('Should never get here');
    } catch(error) {
      assert.ok(/Invalid giftcard code/.test(error.message));
    }
  });

  it('can not redeem twice or redeemed by someone else', async () => {
    const instance = await Giftcards.new.call(owner);

    await instance.issue(hash, 2000);
    await instance.redeem(bytes, {
      from: redeemer
    });

    try {
      await instance.redeem(bytes, {
        from: redeemer
      });
      assert.fail('Should never get here');
    } catch (error) {
      assert.ok(/Giftcard already redeemed/.test(error.message));
    }

    try {
      await instance.redeem(bytes, {
        from: accounts[2]
      });
      assert.fail('Should never get here');
    } catch (error) {
      assert.ok(/Giftcard already redeemed/.test(error.message));
    }
  });

  it('balances of redeemed gift cards add up', async () => {
    const instance = await Giftcards.new.call(owner);
    const code2 = 'other code';
    
    await instance.issue(hash, 2000);
    await instance.issue(web3.utils.keccak256(code2), 3500);
    await instance.redeem(bytes, {
      from: redeemer
    });
    await instance.redeem(web3.utils.toHex(code2), {
      from: redeemer
    });
    
    balance = await instance.getBalance({
      from: redeemer
    });

    assert.strictEqual(balance.toNumber(), 5500);
  });

  it('can spend from giftcard balance but not more than available', async () => {
    const instance = await Giftcards.new.call(owner);

    await instance.issue(hash, 2000);
    await instance.redeem(bytes, {
      from: redeemer
    });
    
    await instance.spend(redeemer, 1500);

    const balance = await instance.getBalance({
      from: redeemer
    });

    assert.strictEqual(balance.toNumber(), 500);

    try {
      await instance.spend(redeemer, 1000);
      assert.fail('Should never get here');
    } catch(error) {
      assert.ok(/Insufficient funds/.test(error.message));
    }
  });
});
