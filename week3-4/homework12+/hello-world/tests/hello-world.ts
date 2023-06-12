import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { HelloWorld } from "../target/types/hello_world";
import { assert } from "chai";

describe("hello-world", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

    it("Initializes account data correctly", async () => {
        const account = anchor.web3.Keypair.generate();

        const tx = await program.methods.initialize()
        .accounts({
            accountToChange: account.publicKey
        })
        .rpc();

        const initializedBalance = (await program.account.myAccount.fetch(account.publicKey)).amount;

        const expectedBalace = new anchor.BN(100);
        console.log("Your transaction signature", tx);
        assert.equal(expectedBalace, initializedBalance);
    });
});
