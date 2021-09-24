import NonFungibleToken from Flow.NonFungibleToken
import Memorials from Project.Memorials

// This script returns the size of an account's Memorials collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(Memorials.CollectionPublicPath)!
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
