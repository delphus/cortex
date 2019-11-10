from nucypher.characters.lawful import Alice, Ursula
from nucypher.config.keyring import NucypherKeyring
import os
from nucypher.blockchain.eth.interfaces import BlockchainInterfaceFactory
BlockchainInterfaceFactory.initialize_interface(provider_uri='/home/kevin/.ethereum/goerli/geth.ipc')

ursula = Ursula.from_seed_and_stake_info(seed_uri='discover.nucypher.network:9151', federated_only=False)

# Generate Alice's keyring into the l/s/n/k folder
os.makedirs("/home/kevin/.local/share/nucypher/keyring", exist_ok=True)
# keyring = NucypherKeyring.generate(checksum_address='0xFd01B73bfFB78a9B0c7d70b1b1D1C26FcDA9245b', password="testtesttesttest", encrypting=True, rest=False, keyring_root='/home/kevin/.local/share/nucypher/keyring')
keyring = NucypherKeyring(account='0xFd01B73bfFB78a9B0c7d70b1b1D1C26FcDA9245b')
keyring.unlock(password="testtesttesttest")

# Instantiate Alice
alice = Alice(keyring=keyring, known_nodes=[ursula], checksum_address="0xFd01B73bfFB78a9B0c7d70b1b1D1C26FcDA9245b", federated_only=True)

# Start Node Discovery
alice.start_learning_loop(now=True)

from umbral.keys import UmbralPublicKey

verifying_key = UmbralPublicKey.from_hex(verifying_key),
encrypting_key = UmbralPublicKey.from_hex(encryption_key)

from nucypher.characters.lawful import Bob
from datetime import timedelta
import maya


bob = Bob.from_public_keys(verifying_key=bob_verifying_key,  encrypting_key=bob_encrypting_key)
policy_end_datetime = maya.now() + timedelta(days=5)  # Five days from now
policy = alice.grant(bob,
                     label=b'my-secret-stuff',  # Sent to Bob via side channel
                     m=2, n=3,
                     expiration=policy_end_datetime)

policy_encrypting_key = policy.public_key