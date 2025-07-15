/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/venta_pay.json`.
 */
export type VentaPay = {
  "address": "CmwBr4P1MfaCfSgBM8Q7x9Z58NnWPSswwWpTqfx3zNSv",
  "metadata": {
    "name": "ventaPay",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initOrUpdateGlobal",
      "discriminator": [
        38,
        171,
        50,
        229,
        111,
        141,
        84,
        172
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  103,
                  108,
                  111,
                  98,
                  97,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newMainAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newManagerAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newTreasury",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newStatus",
          "type": {
            "option": {
              "defined": {
                "name": "programOperationalState"
              }
            }
          }
        },
        {
          "name": "newBaseTxFeeBps",
          "type": {
            "option": "u16"
          }
        }
      ]
    },
    {
      "name": "initOrUpdateMerchant",
      "discriminator": [
        5,
        37,
        198,
        118,
        209,
        53,
        145,
        78
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "factorAuth",
          "signer": true,
          "optional": true
        },
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "seed"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "seed",
          "type": "pubkey"
        },
        {
          "name": "newAcceptedMints",
          "type": {
            "vec": "pubkey"
          }
        },
        {
          "name": "newAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newPartner",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newWallet",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newTxPartnerFeeBps",
          "type": {
            "option": "u16"
          }
        },
        {
          "name": "newFlags",
          "type": {
            "option": "u8"
          }
        }
      ]
    },
    {
      "name": "makePayment",
      "discriminator": [
        19,
        128,
        153,
        121,
        221,
        192,
        91,
        53
      ],
      "accounts": [
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.seed",
                "account": "merchant"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "buyerAta",
          "writable": true
        },
        {
          "name": "merchantAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "merchantWithdraw",
      "discriminator": [
        0,
        102,
        63,
        159,
        198,
        163,
        36,
        194
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "factorAuth",
          "signer": true,
          "optional": true
        },
        {
          "name": "global"
        },
        {
          "name": "merchantAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.seed",
                "account": "merchant"
              }
            ]
          }
        },
        {
          "name": "receivingAta",
          "writable": true
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": [
        {
          "name": "receivingWallet",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdrawTxFee",
      "discriminator": [
        25,
        91,
        248,
        189,
        119,
        192,
        59,
        56
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "global"
        },
        {
          "name": "merchant",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  114,
                  99,
                  104,
                  97,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "merchant.seed",
                "account": "merchant"
              }
            ]
          }
        },
        {
          "name": "merchantAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "merchant"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "globalTreasuryAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "global"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "partnerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "merchant.partner",
                "account": "merchant"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "global",
      "discriminator": [
        167,
        232,
        232,
        177,
        200,
        108,
        114,
        127
      ]
    },
    {
      "name": "merchant",
      "discriminator": [
        71,
        235,
        30,
        40,
        231,
        21,
        32,
        64
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "unauthorized"
    },
    {
      "code": 6001,
      "name": "invalidSeed",
      "msg": "Invalid seed"
    },
    {
      "code": 6002,
      "name": "invalidAuthority",
      "msg": "Invalid authority"
    },
    {
      "code": 6003,
      "name": "invalidPartner",
      "msg": "Invalid partner"
    },
    {
      "code": 6004,
      "name": "invalidWallet",
      "msg": "Invalid wallet"
    },
    {
      "code": 6005,
      "name": "mintNotAccepted",
      "msg": "Stablecoin not accepted"
    },
    {
      "code": 6006,
      "name": "invalidGlobalConfig",
      "msg": "Invalid global config account"
    },
    {
      "code": 6007,
      "name": "invalidMerchantAccount",
      "msg": "Invalid merchant account"
    },
    {
      "code": 6008,
      "name": "invalidGlobalTreasury",
      "msg": "Invalid global treasury"
    },
    {
      "code": 6009,
      "name": "frozenMerchantAccount",
      "msg": "Frozen merchant account"
    },
    {
      "code": 6010,
      "name": "invalidVaultAccount",
      "msg": "Invalid vault account"
    },
    {
      "code": 6011,
      "name": "invalidStrategyAccount",
      "msg": "Invalid strategy account"
    },
    {
      "code": 6012,
      "name": "amountExceedTransferLimit",
      "msg": "Amount exceed single transfer limit"
    },
    {
      "code": 6013,
      "name": "exceedVaultMaxCapacity",
      "msg": "Vault capacity reached"
    },
    {
      "code": 6014,
      "name": "overflow",
      "msg": "Overflow in calculation"
    },
    {
      "code": 6015,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6016,
      "name": "insufficientLockBalance",
      "msg": "Invalid lock balance"
    },
    {
      "code": 6017,
      "name": "invalidAmountInput",
      "msg": "Amount must be greater than 0"
    },
    {
      "code": 6018,
      "name": "invalidDiscriminator",
      "msg": "Invalid discriminator input"
    },
    {
      "code": 6019,
      "name": "invalidExtensionAccount",
      "msg": "Invalid extension account"
    },
    {
      "code": 6020,
      "name": "invalidMerchantExtension",
      "msg": "Invalid merchant extension"
    },
    {
      "code": 6021,
      "name": "protocolHalted",
      "msg": "Protocal is halted"
    },
    {
      "code": 6022,
      "name": "lockedExceedsAvailableBalance",
      "msg": "Locked exceeds available amount"
    },
    {
      "code": 6023,
      "name": "maximumFiftyMintLimit",
      "msg": "Maximum 50 mint limit"
    },
    {
      "code": 6024,
      "name": "acceptedMintsMustBeZero",
      "msg": "Accepted mint lengthh must be zero to close"
    },
    {
      "code": 6025,
      "name": "inactiveBalanceNotZero",
      "msg": "Inactive balance must be zero before removing mint"
    },
    {
      "code": 6026,
      "name": "deployedBalanceNotZero",
      "msg": "Deployed balance must be zero before removing mint"
    },
    {
      "code": 6027,
      "name": "interestNotZero",
      "msg": "Interest must be zero before removing mint"
    },
    {
      "code": 6028,
      "name": "lockedNotZero",
      "msg": "Locked must be zero before removing mint"
    },
    {
      "code": 6029,
      "name": "extensionTvlMustBeZero",
      "msg": "Extension TVL must be zero to close"
    },
    {
      "code": 6030,
      "name": "transactionFeesNotZero",
      "msg": "Treasury fees must be zero before removing mint"
    },
    {
      "code": 6031,
      "name": "interestOverflow",
      "msg": "Interest overflow in calculation"
    },
    {
      "code": 6032,
      "name": "mintAlreadyAccepted",
      "msg": "Mint already accepted"
    },
    {
      "code": 6033,
      "name": "invalidReceivingWallet",
      "msg": "Invalid Receiving Wallet"
    },
    {
      "code": 6034,
      "name": "illegalMerchantUpdate",
      "msg": "Merchant must not be frozen for Wallet or 2FA update"
    },
    {
      "code": 6035,
      "name": "illegalExtensionProgram",
      "msg": "Extension cannot be the program itself"
    },
    {
      "code": 6036,
      "name": "illegalAdapterProgram",
      "msg": "Adapter cannot be the program itself"
    },
    {
      "code": 6037,
      "name": "frozenExtension",
      "msg": "Extension is frozen"
    },
    {
      "code": 6038,
      "name": "invalid2FaSigner",
      "msg": "Invalid 2FA Signer"
    },
    {
      "code": 6039,
      "name": "mainSignerRequired",
      "msg": "Update require global main authority signing"
    },
    {
      "code": 6040,
      "name": "managerSignerRequired",
      "msg": "Update require global manager authority signing"
    },
    {
      "code": 6041,
      "name": "extensionRequireYieldGeneration",
      "msg": "Extension require yield generation to be on"
    },
    {
      "code": 6042,
      "name": "mintStillAccepted",
      "msg": "Mint still exist in merchant account"
    },
    {
      "code": 6043,
      "name": "withdrawAmountMustNotExceedTvl",
      "msg": "Withdraw amount must not exceed TVL"
    },
    {
      "code": 6044,
      "name": "invalidInactiveBalance",
      "msg": "Invalid inactive balance"
    }
  ],
  "types": [
    {
      "name": "global",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c"
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mainAuthority",
            "type": "pubkey"
          },
          {
            "name": "managerAuthority",
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "type": "pubkey"
          },
          {
            "name": "baseTxFeeBps",
            "type": "u16"
          },
          {
            "name": "protocolState",
            "type": {
              "defined": {
                "name": "programOperationalState"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "padding",
            "type": {
              "array": [
                "u8",
                3
              ]
            }
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future fields"
            ],
            "type": {
              "array": [
                "u8",
                256
              ]
            }
          }
        ]
      }
    },
    {
      "name": "merchant",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "seed",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "partner",
            "type": "pubkey"
          },
          {
            "name": "wallet",
            "type": "pubkey"
          },
          {
            "name": "acceptedMints",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "globalFees",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "partnerFees",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "txPartnerFeeBps",
            "type": "u16"
          },
          {
            "name": "flags",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "version",
            "type": "u8"
          },
          {
            "name": "reserved",
            "docs": [
              "Reserved space for future fields"
            ],
            "type": {
              "array": [
                "u8",
                127
              ]
            }
          }
        ]
      }
    },
    {
      "name": "programOperationalState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "normalOperation"
          },
          {
            "name": "haltDeposit"
          },
          {
            "name": "haltAll"
          }
        ]
      }
    }
  ]
};
