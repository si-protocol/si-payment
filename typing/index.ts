export enum Notification {
    none = 'Remember to drink water today.',
    noPayment = "We couldn't find a payment for you. Are you sure you're in the right place?",
    noWallet = 'There is a problem with your wallet. Disconnect and try again.',
    transactionRequestFailed = 'There was an issue building your payment transaction. Please try again.',
    transactionDoesNotExist = 'This transaction does not exist. Please try again.',
    declined = 'It looks like you declined the transaction. Was something wrong? Please try again.',
    duplicatePayment = 'It looks like you already paid. Please check your wallet.',
    insufficentFunds = "You don't have enough funds for this transaction.",
    simulatingIssue = "There's an issue with your transaction. Please try again.",
    transactionConfirmedFailed = 'Transaction failed. Please try again.',
    shopifyRetry = "We're pretty sure you paid. We even told Si. They were all like, yo bro not so fast. We're gonna try again in a second. You'll get an email but just hand tight.",
    genericWalletError = 'There was an issue submitting your transaction with your connected wallet. Please try again.',
    evmCancelPay = 'User rejected the request'
}
