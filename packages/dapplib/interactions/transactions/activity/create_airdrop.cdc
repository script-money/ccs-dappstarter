import ActivityContract from Project.ActivityContract
import FungibleToken from Flow.FungibleToken
import CCSToken from Project.CCSToken

transaction(title:String, recievers:[Address], bonus:UFix64, metadata: String) {
    // local variable for storing the minter reference
    let admin: &ActivityContract.Admin

    prepare(signer: AuthAccount) {

      // borrow a reference to the activityAdmin resource in storage
      self.admin = signer.borrow<&ActivityContract.Admin>(
        from: ActivityContract.ActivityAdminStoragePath
      ) ?? panic("Could not borrow a reference to the activity admin")
    }

    execute {
      self.admin.createAirdrop(title: title, recievers: recievers, bonus: bonus, metadata: metadata)
    }
}
