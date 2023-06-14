use anchor_lang::prelude::*;

declare_id!("FVUkr6SMAU3EjsW9v2A6eZYRrSyqfqkUEVHiwswEvCZG");

#[program]
pub mod hello_world {

    use super::*;

    pub fn initialize(ctx: Context<ChangeData>) -> Result<()> {
        msg!(
            "Amount before initializing: {}",
            ctx.accounts.account_to_change.amount
        );

        ctx.accounts.account_to_change.amount = 100;

        msg!(
            "Amount after initializing: {}",
            ctx.accounts.account_to_change.amount
        );

        Ok(())
    }

    pub fn update_balance(ctx: Context<IncreaseBalance>, amount: u64) -> Result<()> {
        let account = &mut ctx.accounts.account_to_change;

        if account.amount == MyAccount::MAX_BALANCE {
            return Err(error!(MyErrors::MaxBalanceReached));
        }

        if account.amount + amount > MyAccount::MAX_BALANCE {
            return Err(error!(MyErrors::ExceedsMaxBalance));
        }

        account.amount += amount;
        msg!("Balance after the update: {}", account.amount);

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

#[derive(Accounts)]
pub struct IncreaseBalance<'info> {
    #[account(mut)]
    pub account_to_change: Account<'info, MyAccount>,
}

#[account]
#[derive(Default)]
pub struct MyAccount {
    amount: u64,
}

impl MyAccount {
    const SIZE: usize = 8 + 8;
    const MAX_BALANCE: u64 = 1000;
}

#[error_code]
pub enum MyErrors {
    #[msg("Maximum balance reached.")]
    MaxBalanceReached,
    #[msg("Updating the balance would exceed the maximum balance.")]
    ExceedsMaxBalance,
}
