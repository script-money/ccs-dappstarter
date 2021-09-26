import FungibleToken from Flow.FungibleToken
import CCSToken from Project.CCSToken

transaction(addressAmountMap: {Address: UFix64}) {

    let adminRef: &CCSToken.Administrator

    prepare(signer: AuthAccount) {
      self.adminRef = signer.borrow<&CCSToken.Administrator>(from: CCSToken.AdminStoragePath)
			?? panic("Could not borrow admin's resource in CCSToken!")
    }

    execute{
      self.adminRef.createAirdrop(addressAmountMap: addressAmountMap)
    }
}