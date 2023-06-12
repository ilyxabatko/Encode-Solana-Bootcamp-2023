use anchor_lang::prelude::*;

declare_id!("FVUkr6SMAU3EjsW9v2A6eZYRrSyqfqkUEVHiwswEvCZG");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        msg!("Hello, world!");

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
