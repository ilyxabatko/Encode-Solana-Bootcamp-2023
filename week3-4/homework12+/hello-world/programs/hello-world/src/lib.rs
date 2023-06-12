use anchor_lang::prelude::*;

declare_id!("FVUkr6SMAU3EjsW9v2A6eZYRrSyqfqkUEVHiwswEvCZG");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<ChangeData>) -> Result<()> {
        ctx.accounts.account_to_change.amount = 100;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ChangeData<'info> {
    #[account(mut)]
    pub account_to_change: Account<'info, MyAccount>
}

#[account]
#[derive(Default)]
pub struct MyAccount {
    amount: u64
}

