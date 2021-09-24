import NonFungibleToken from Flow.NonFungibleToken
import Memorials from Project.Memorials

pub fun main(address: Address): Bool {
  return getAccount(address)
    .getCapability<&Memorials.Collection{NonFungibleToken.CollectionPublic, Memorials.MemorialsCollectionPublic}>(Memorials.CollectionPublicPath)
    .check()
}