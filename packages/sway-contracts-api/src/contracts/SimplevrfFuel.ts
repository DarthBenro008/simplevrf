/* Autogenerated file. Do not edit manually. */

/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */

/*
  Fuels version: 0.100.3
  Forc version: 0.67.0
  Fuel-Core version: 0.41.9
*/

import { Contract as __Contract, Interface } from "fuels";
import type {
  Provider,
  Account,
  StorageSlot,
  Address,
  BigNumberish,
  BN,
  FunctionFragment,
  InvokeFunction,
} from 'fuels';

import type { Enum, Vec } from "./common";

export enum ErrorInput { NotAuthorized = 'NotAuthorized', InsufficientFee = 'InsufficientFee', ProofNotFound = 'ProofNotFound', RequestNotFound = 'RequestNotFound', ContractCallNotAllowed = 'ContractCallNotAllowed', InsufficientBalance = 'InsufficientBalance' };
export enum ErrorOutput { NotAuthorized = 'NotAuthorized', InsufficientFee = 'InsufficientFee', ProofNotFound = 'ProofNotFound', RequestNotFound = 'RequestNotFound', ContractCallNotAllowed = 'ContractCallNotAllowed', InsufficientBalance = 'InsufficientBalance' };
export type IdentityInput = Enum<{ Address: AddressInput, ContractId: ContractIdInput }>;
export type IdentityOutput = Enum<{ Address: AddressOutput, ContractId: ContractIdOutput }>;

export type AddressInput = { bits: string };
export type AddressOutput = AddressInput;
export type AssetIdInput = { bits: string };
export type AssetIdOutput = AssetIdInput;
export type ChunkedProofInput = { p1: string, p2: string, p3: string, p4: BigNumberish, proof: string };
export type ChunkedProofOutput = { p1: string, p2: string, p3: string, p4: number, proof: string };
export type ContractIdInput = { bits: string };
export type ContractIdOutput = ContractIdInput;
export type RequestInput = { num: BigNumberish, status: BigNumberish, seed: string, proof: ChunkedProofInput, fullfilled_by: AddressInput, callback_contract: IdentityInput };
export type RequestOutput = { num: BN, status: BN, seed: string, proof: ChunkedProofOutput, fullfilled_by: AddressOutput, callback_contract: IdentityOutput };

const abi = {
  "programType": "contract",
  "specVersion": "1",
  "encodingVersion": "1",
  "concreteTypes": [
    {
      "type": "()",
      "concreteTypeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
    },
    {
      "type": "b256",
      "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
    },
    {
      "type": "bool",
      "concreteTypeId": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903"
    },
    {
      "type": "enum Error",
      "concreteTypeId": "4ed298ed0be3fc65895c5d5263885191731caa9f79ff63e56d98b449e5ba4b3f",
      "metadataTypeId": 0
    },
    {
      "type": "struct simplevrf_fuel_abi::ChunkedProof",
      "concreteTypeId": "50a1bd951f50300b333c03c17d0267e2ebfda8a44b421dafa743e48ccdacc47e",
      "metadataTypeId": 4
    },
    {
      "type": "struct simplevrf_fuel_abi::Request",
      "concreteTypeId": "82e44d4b9cf8f24936fb0a24275a2a2b274d4954807740fa65d7bba0eccd456e",
      "metadataTypeId": 5
    },
    {
      "type": "struct std::address::Address",
      "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308",
      "metadataTypeId": 6
    },
    {
      "type": "struct std::asset_id::AssetId",
      "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974",
      "metadataTypeId": 7
    },
    {
      "type": "struct std::vec::Vec<struct simplevrf_fuel_abi::Request>",
      "concreteTypeId": "8a8070b4ce302533f50ea4ecdbeb125f0aa9fcc653c80f3fd2c001d6df6c93b4",
      "metadataTypeId": 10,
      "typeArguments": [
        "82e44d4b9cf8f24936fb0a24275a2a2b274d4954807740fa65d7bba0eccd456e"
      ]
    },
    {
      "type": "struct std::vec::Vec<struct std::address::Address>",
      "concreteTypeId": "fc4d04749f58f5bf7fd11c9ed9065b555ad48afcaa1172aaefa952a3a7712160",
      "metadataTypeId": 10,
      "typeArguments": [
        "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308"
      ]
    },
    {
      "type": "u64",
      "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
    }
  ],
  "metadataTypes": [
    {
      "type": "enum Error",
      "metadataTypeId": 0,
      "components": [
        {
          "name": "NotAuthorized",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "InsufficientFee",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ProofNotFound",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "RequestNotFound",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "ContractCallNotAllowed",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        },
        {
          "name": "InsufficientBalance",
          "typeId": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d"
        }
      ]
    },
    {
      "type": "enum std::identity::Identity",
      "metadataTypeId": 1,
      "components": [
        {
          "name": "Address",
          "typeId": 6
        },
        {
          "name": "ContractId",
          "typeId": 8
        }
      ]
    },
    {
      "type": "generic T",
      "metadataTypeId": 2
    },
    {
      "type": "raw untyped ptr",
      "metadataTypeId": 3
    },
    {
      "type": "struct simplevrf_fuel_abi::ChunkedProof",
      "metadataTypeId": 4,
      "components": [
        {
          "name": "p1",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "p2",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "p3",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "p4",
          "typeId": 11
        },
        {
          "name": "proof",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct simplevrf_fuel_abi::Request",
      "metadataTypeId": 5,
      "components": [
        {
          "name": "num",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "status",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        },
        {
          "name": "seed",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "proof",
          "typeId": 4
        },
        {
          "name": "fullfilled_by",
          "typeId": 6
        },
        {
          "name": "callback_contract",
          "typeId": 1
        }
      ]
    },
    {
      "type": "struct std::address::Address",
      "metadataTypeId": 6,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::asset_id::AssetId",
      "metadataTypeId": 7,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::contract_id::ContractId",
      "metadataTypeId": 8,
      "components": [
        {
          "name": "bits",
          "typeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ]
    },
    {
      "type": "struct std::vec::RawVec",
      "metadataTypeId": 9,
      "components": [
        {
          "name": "ptr",
          "typeId": 3
        },
        {
          "name": "cap",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        2
      ]
    },
    {
      "type": "struct std::vec::Vec",
      "metadataTypeId": 10,
      "components": [
        {
          "name": "buf",
          "typeId": 9,
          "typeArguments": [
            {
              "name": "",
              "typeId": 2
            }
          ]
        },
        {
          "name": "len",
          "typeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "typeParameters": [
        2
      ]
    },
    {
      "type": "u8",
      "metadataTypeId": 11
    }
  ],
  "functions": [
    {
      "inputs": [
        {
          "name": "authority",
          "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308"
        }
      ],
      "name": "add_authority",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_authorities",
      "output": "fc4d04749f58f5bf7fd11c9ed9065b555ad48afcaa1172aaefa952a3a7712160",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        }
      ],
      "name": "get_fee",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "seed",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ],
      "name": "get_request",
      "output": "82e44d4b9cf8f24936fb0a24275a2a2b274d4954807740fa65d7bba0eccd456e",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "num",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "get_request_by_num",
      "output": "82e44d4b9cf8f24936fb0a24275a2a2b274d4954807740fa65d7bba0eccd456e",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_request_count",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [],
      "name": "get_unfinalized_requests",
      "output": "8a8070b4ce302533f50ea4ecdbeb125f0aa9fcc653c80f3fd2c001d6df6c93b4",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "authority",
          "concreteTypeId": "f597b637c3b0f588fb8d7086c6f4735caa3122b85f0423b82e489f9bb58e2308"
        }
      ],
      "name": "remove_authority",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "seed",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        }
      ],
      "name": "request",
      "output": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0",
      "attributes": [
        {
          "name": "payable",
          "arguments": []
        },
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        },
        {
          "name": "fee",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "set_fee",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "seed",
          "concreteTypeId": "7c5ee1cecf5f8eacd1284feb5f0bf2bdea533a51e2f0c9aabe9236d335989f3b"
        },
        {
          "name": "proof",
          "concreteTypeId": "50a1bd951f50300b333c03c17d0267e2ebfda8a44b421dafa743e48ccdacc47e"
        }
      ],
      "name": "submit_proof",
      "output": "b760f44fa5965c2474a3b471467a22c43185152129295af588b022ae50b50903",
      "attributes": [
        {
          "name": "storage",
          "arguments": [
            "read",
            "write"
          ]
        }
      ]
    },
    {
      "inputs": [
        {
          "name": "asset",
          "concreteTypeId": "c0710b6731b1dd59799cf6bef33eee3b3b04a2e40e80a0724090215bbf2ca974"
        },
        {
          "name": "amount",
          "concreteTypeId": "1506e6f44c1d6291cdf46395a8e573276a4fa79e8ace3fc891e092ef32d1b0a0"
        }
      ],
      "name": "withdraw",
      "output": "2e38e77b22c314a449e91fafed92a43826ac6aa403ae6a8acb6cf58239fbaf5d",
      "attributes": null
    }
  ],
  "loggedTypes": [
    {
      "logId": "5679770223941778533",
      "concreteTypeId": "4ed298ed0be3fc65895c5d5263885191731caa9f79ff63e56d98b449e5ba4b3f"
    }
  ],
  "messagesTypes": [],
  "configurables": []
};

const storageSlots: StorageSlot[] = [
  {
    "key": "af2237393c33c36222a4e14136fb15b3ceb16743a3ab5ea5e2ff1c67a1b75094",
    "value": "0000000000000000000000000000000000000000000000000000000000000000"
  }
];

export class SimplevrfFuelInterface extends Interface {
  constructor() {
    super(abi);
  }

  declare functions: {
    add_authority: FunctionFragment;
    get_authorities: FunctionFragment;
    get_fee: FunctionFragment;
    get_request: FunctionFragment;
    get_request_by_num: FunctionFragment;
    get_request_count: FunctionFragment;
    get_unfinalized_requests: FunctionFragment;
    remove_authority: FunctionFragment;
    request: FunctionFragment;
    set_fee: FunctionFragment;
    submit_proof: FunctionFragment;
    withdraw: FunctionFragment;
  };
}

export class SimplevrfFuel extends __Contract {
  static readonly abi = abi;
  static readonly storageSlots = storageSlots;

  declare interface: SimplevrfFuelInterface;
  declare functions: {
    add_authority: InvokeFunction<[authority: AddressInput], void>;
    get_authorities: InvokeFunction<[], Vec<AddressOutput>>;
    get_fee: InvokeFunction<[asset: AssetIdInput], BN>;
    get_request: InvokeFunction<[seed: string], RequestOutput>;
    get_request_by_num: InvokeFunction<[num: BigNumberish], RequestOutput>;
    get_request_count: InvokeFunction<[], BN>;
    get_unfinalized_requests: InvokeFunction<[], Vec<RequestOutput>>;
    remove_authority: InvokeFunction<[authority: AddressInput], void>;
    request: InvokeFunction<[seed: string], BN>;
    set_fee: InvokeFunction<[asset: AssetIdInput, fee: BigNumberish], void>;
    submit_proof: InvokeFunction<[seed: string, proof: ChunkedProofInput], boolean>;
    withdraw: InvokeFunction<[asset: AssetIdInput, amount: BigNumberish], void>;
  };

  constructor(
    id: string | Address,
    accountOrProvider: Account | Provider,
  ) {
    super(id, abi, accountOrProvider);
  }
}
