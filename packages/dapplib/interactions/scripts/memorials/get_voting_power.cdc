import NonFungibleToken from Flow.NonFungibleToken
import Memorials from Project.Memorials

// every memorial has bonus, sum(unique memorial bonus) + 1.0 = voting power

pub fun main(address: Address): UFix64 {
  let collectionRef = getAccount(address).getCapability(Memorials.CollectionPublicPath)!
      .borrow<&{Memorials.MemorialsCollectionPublic}>()
      ?? panic("Could not borrow capability from public collection")
  return collectionRef.getVotingPower()
}