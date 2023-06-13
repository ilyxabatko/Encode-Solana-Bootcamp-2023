import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HelloWorld } from "../target/types/hello_world";
import { assert } from "chai";

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
});
