 
 export interface ethereumHoldingState {
    list: TokenData[]
 }

 export interface TokenData {
    balances: Balance[];
 }

 export interface Balance {
  contractAddress: string
  amount: string
 }
