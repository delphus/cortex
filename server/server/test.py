from nucypher.characters.lawful import Ursula

seed_uri = "discover.nucypher.network:9151"
seed_uri2 = "104.248.215.144:9151"

ursula = Ursula.from_seed_and_stake_info(seed_uri=seed_uri, federated_only=False)
another_ursula = Ursula.from_seed_and_stake_info(seed_uri=seed_uri2, federated_only=False)