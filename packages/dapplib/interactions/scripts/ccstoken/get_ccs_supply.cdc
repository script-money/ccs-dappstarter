import CCSToken from Project.CCSToken

pub fun main(): UFix64 {

    let supply = CCSToken.totalSupply

    log(supply)

    return supply
}
