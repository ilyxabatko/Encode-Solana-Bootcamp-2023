use anchor_lang::prelude::*;

declare_id!("FVUkr6SMAU3EjsW9v2A6eZYRrSyqfqkUEVHiwswEvCZG");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<ChangeData>) -> Result<()> {
        msg!("Amount before initializing: {}", ctx.accounts.account_to_change.amount);
        ctx.accounts.account_to_change.amount = 100;
        msg!("Amount after initializing: {}", ctx.accounts.account_to_change.amount);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct ChangeData<'info> {
    #[account(init, payer = payer, space = MyAccount::SIZE)]
    pub account_to_change: Account<'info, MyAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct MyAccount {
    amount: u64
}

impl MyAccount {
    const SIZE: usize = 8 + 8;
}

