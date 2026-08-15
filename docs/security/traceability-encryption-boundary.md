# ALDO traceability, encryption, and ledger boundary

## Implemented safeguards

ALDO now exposes a pure domain contract for a GS1-style Data Matrix trace payload containing GTIN, expiry date, batch, and serial identifiers. The contract also carries the jurisdiction, organization scope, and source reference as server-side metadata. Patient identifiers are explicitly excluded from the payload. The contract marks the official tracking adapter as required and remains externally unverified until an authorized governmental or supply-chain connector is configured and acceptance-tested.

Sensitive bytes can be encrypted with **AES-256-GCM** using a runtime-supplied 32-byte key and explicit key version. The envelope contains only the algorithm identifier, key version, random IV, authentication tag, and ciphertext. Keys must remain in the approved secret-management path; they must not be stored in source code, browser storage, the database payload, or this document. This helper does not create or distribute keys.

Audit records use a SHA-256 hash chain. Each record includes the previous hash and its own deterministic hash. The verifier rejects a changed record or a broken predecessor link. This is tamper evidence, not a replacement for access control, encrypted storage, backups, or a legally recognized external ledger.

## External integration boundary

The system does **not** claim a live connection to an Egyptian, Jordanian, Qatari, Moroccan, insurer, or distributor tracking network. A production adapter remains blocked until the authority provides its endpoint contract, authentication method, Data Matrix/serialization specification, submission acknowledgement, retry/idempotency rules, error semantics, retention requirements, and acceptance evidence.

## Blockchain boundary

No blockchain network, wallet, smart contract, token, or third-party ledger is activated by this change. A permissioned ledger may be evaluated later only if a specific business and regulatory requirement justifies it. Until then, the internal hash chain is the safer, lower-complexity audit foundation and must not be marketed as blockchain.
