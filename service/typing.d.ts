declare namespace ApiType {
    type sign = {
        message: string;
        signature: string;
    };
    type register = {
        address: string;
        inviter: string;
    };
    type checkOrder = {
        address: string;
        hash: string;
    };
    type fetchUser = {
        address: Address;
    };
    type transfer = {
        address: Address;
        amount: number;
    };
    type trade = {
        address: Address;
        orderid: string;
    };
    type claim = {
        address: string;
        amount: string | number;
    };
    type auth = { expired: number } & sign;
}
