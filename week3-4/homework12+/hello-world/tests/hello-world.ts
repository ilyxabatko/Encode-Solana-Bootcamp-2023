import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HelloWorld } from "../target/types/hello_world";
import { assert, expect } from "chai";

describe("hello-world", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

    it("Initializes account data correctly", async () => {
        // create and init an account
        const account = anchor.web3.Keypair.generate();
        const payer_keypair = provider.wallet;

        const tx = await program.methods.initialize()
            .accounts({
                accountToChange: account.publicKey,
                payer: payer_keypair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .signers([account])
            .rpc();

        const initializedBalance = ((await program.account.myAccount.fetch(account.publicKey)).amount).toNumber();

        const expectedBalance: number = 100;
        console.log("Your transaction signature", tx);
        assert.equal(expectedBalance, initializedBalance);
    });


    it("Increases the balance by 100", async () => {
        // create and init an account
        const account = anchor.web3.Keypair.generate();
        const payer_keypair = provider.wallet;

        const init_tx = await program.methods.initialize()
            .accounts({
                accountToChange: account.publicKey,
                payer: payer_keypair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .signers([account])
            .rpc();

        console.log("Init transaction signature", init_tx);

        let amountToAdd: anchor.BN = new anchor.BN(100);

        // increase account balance by 100
        const increase_tx = await program.methods.updateBalance(amountToAdd)
            .accounts({
                accountToChange: account.publicKey,
            })
            .rpc();

        console.log("IncreaseBalance transaction signature", increase_tx);

        // checks the results
        const balance = ((await program.account.myAccount.fetch(account.publicKey)).amount).toNumber();
        const expectedBalance: number = 200;
        assert.equal(expectedBalance, balance);
    });

    it("should throw the \"ExceedsMaxBalance\" error when exceeding the maximum balance", async () => {
        // create and init an account (100)
        const account = anchor.web3.Keypair.generate();
        const payer_keypair = provider.wallet;

        const init_tx = await program.methods.initialize()
            .accounts({
                accountToChange: account.publicKey,
                payer: payer_keypair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .signers([account])
            .rpc();

        console.log("Init transaction signature", init_tx);

        let amountToAdd: anchor.BN = new anchor.BN(100);

        // increase account balance by 100
        const increase_tx = await program.methods.updateBalance(amountToAdd)
            .accounts({
                accountToChange: account.publicKey,
            })
            .rpc();

        console.log("IncreaseBalance transaction signature", increase_tx);

        try {
            let amountToAdd2: anchor.BN = new anchor.BN(900);

            // increase account balance by 900
            const increase_tx2 = await program.methods.updateBalance(amountToAdd2)
                .accounts({
                    accountToChange: account.publicKey,
                })
                .rpc();

            console.log("IncreaseBalance transaction signature", increase_tx2);
            assert.fail('Expected an error to be thrown.');
        } catch (error) {
            expect(error.message).to.include("Updating the balance would exceed the maximum balance.");
        }
    });

    it("should throw the \"MaxBalanceReached\" error when the maximum balance is already reached", async () => {
        // create and init an account (100)
        const account = anchor.web3.Keypair.generate();
        const payer_keypair = provider.wallet;

        const init_tx = await program.methods.initialize()
            .accounts({
                accountToChange: account.publicKey,
                payer: payer_keypair.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            })
            .signers([account])
            .rpc();

        console.log("Init transaction signature", init_tx);

        let amountToAdd: anchor.BN = new anchor.BN(900);

        // increase account balance by 900 to get the max balance
        const increase_tx = await program.methods.updateBalance(amountToAdd)
            .accounts({
                accountToChange: account.publicKey,
            })
            .rpc();

        console.log("IncreaseBalance transaction signature", increase_tx);

        try {
            let amountToAdd2: anchor.BN = new anchor.BN(100);

            // increase account balance by 100 while it has already reached the max value
            const increase_tx2 = await program.methods.updateBalance(amountToAdd2)
                .accounts({
                    accountToChange: account.publicKey,
                })
                .rpc();

            console.log("IncreaseBalance transaction signature", increase_tx2);
            assert.fail('Expected an error to be thrown.');
        } catch (error) {
            expect(error.message).to.include("Maximum balance reached.");
        }
    });
});
