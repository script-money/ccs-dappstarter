import BallotContract from Project.BallotContract

transaction {
  prepare(signer: AuthAccount) {
    if signer.borrow<&BallotContract.Collection>(from: BallotContract.CollectionStoragePath) == nil {
      signer.save(<-BallotContract.createEmptyCollection(signer.address), to: BallotContract.CollectionStoragePath)

      signer.unlink(BallotContract.CollectionPublicPath)
      signer.link<&BallotContract.Collection{BallotContract.CollectionPublic}>(BallotContract.CollectionPublicPath,target: BallotContract.CollectionStoragePath)
    }
  }
}

