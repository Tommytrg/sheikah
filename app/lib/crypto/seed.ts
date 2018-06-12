import * as Mnemonic from "./mnemonic"
import * as Hash from "./hash"
import * as assert from "assert"
import * as bip39 from "bip39"
import {Errors} from "./errors"

export type Seed = {
  masterSecret: Buffer
  chainCode: Buffer
}

export const fromMnemonics = (mnemonics: string): Seed => {
  if (Mnemonic.isValid(mnemonics)) {
    throw new Error(Errors.INVALID_MNEMONIC)
  }
  const entropy = bip39.mnemonicToSeed(mnemonics)

  return fromEntropy(entropy)
}

export const fromEntropy = (entropy: Buffer, hmacKey = "Witnet seed"): Seed => {
  assert(entropy.length >= 16 && entropy.length <= 64, Errors.INVALID_ENTROPY_LENGTH)
  const hash = Hash.sha512hmac(Buffer.from(hmacKey), entropy)

  return {
    masterSecret: hash.slice(0, 32),
    chainCode: hash.slice(32, 64)
  }
}
