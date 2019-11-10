# Import Statements
# Core python imports
import datetime
import json
import os
import shutil
import base64
import msgpack

import maya

# Nucypher API imports
from nucypher.characters.lawful import Bob, Ursula, Enrico, Alice
from nucypher.config.characters import AliceConfiguration
from nucypher.crypto.kits import UmbralMessageKit
from nucypher.crypto.powers import DecryptingPower, SigningPower
from nucypher.network.middleware import RestMiddleware
from nucypher.keystore.keypairs import DecryptingKeypair, SigningKeypair

from nucypher.blockchain.eth.interfaces import BlockchainInterfaceFactory

BlockchainInterfaceFactory.initialize_interface(provider_uri='~/.ethereum/goerli/geth.ipc')
print("Initialized blockchain interface")

from umbral.keys import UmbralPrivateKey, UmbralPublicKey

# Umbral imports
from umbral.keys import UmbralPrivateKey, UmbralPublicKey

# Flask imports
from flask import Flask,jsonify,request, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# We expect the url of the seednode as the first argument.
SEEDNODE_URL = '127.0.0.1:11500'

# Setting up the ursula
ursula = Ursula.from_seed_and_stake_info(seed_uri=SEEDNODE_URL,
                                         federated_only=True,
                                         minimum_stake=0)

MessageKit = 0
EnricoS  = 0

@app.route("/generateKeys", methods=['POST'])
def generateKeys():

    # Fetch JSON from request
    print('####')
    print(request.data)
    json_data = json.loads(request.data.decode('utf-8'))

    # Fetch username and password
    username = json_data['username']
    password = json_data['password']

    # directory to store alice keys
    ALICE_DIR = os.path.join(os.getcwd() , 'alice/' + username)
    print(ALICE_DIR)


    alice_config = AliceConfiguration(
        domains={'TEMPORARY_DOMAIN'},
        config_root=os.path.join(ALICE_DIR),
        is_me=True,
        known_nodes={ursula},
        start_learning_now=False,
        federated_only=True,
        learn_on_same_thread=True
    )

    alice_config.initialize(password=password)
    alice_config.keyring.unlock(password=password)
    file = alice_config.to_configuration_file()
    alicia = alice_config.produce()
    alicia.start_learning_loop(now=True)

    data = {}
    data['alice'] = file
    data['bob'] = generate_bob_keys(username=username)

    print(data)

    return jsonify(data)


@app.route('/encryptData',methods=['POST'])
def encryptData():
    print('data')
    print(request.data.decode('utf-8'))
    print('data\n\n')
    json_data = json.loads(request.data.decode('utf-8'))
    hash = json_data['hash']
    aliceFile = json_data['alice']
    # username = json_data['username']
    password = json_data['password']
    label = json_data['label']

    label = label.encode()
    # print ('93\t' + hash)

    alice_config = AliceConfiguration.from_configuration_file(
        filepath=aliceFile,
        known_nodes={ursula},
        start_learning_now=False,
    )

    alice_config.keyring.unlock(password=password)
    alicia = alice_config(domains={'TEMPORARY_DOMAIN'})

    alicia.start_learning_loop(now=True)

    policy_pubkey = alicia.get_policy_pubkey_from_label(label)

    # Initialise Enrico
    enrico = Enrico(policy_encrypting_key=policy_pubkey)

    print ("Done upto 111")
    hash = msgpack.dumps(hash, use_bin_type=True)
    message_kit, _signature = enrico.encrypt_message(hash)

    message_kit_bytes = message_kit.to_bytes()
    newMsg = UmbralMessageKit.from_bytes(message_kit_bytes)

    print ("\n\ncheck")
    print (message_kit_bytes == newMsg.to_bytes())
    print (message_kit)
    print (newMsg)


    data = {}
    data['message'] = message_kit_bytes.hex()
    data['label'] = label.decode('utf-8')
    data['policy_public_key'] = policy_pubkey.to_bytes().hex()
    data['alice_sig_pubkey"'] = bytes(alicia.stamp).hex()
    data['data_source'] = bytes(enrico.stamp).hex()



    print ('result\n')
    print (data)
    print ('#####\n')

    return json.dumps(data)


@app.route('/createPolicy', methods=['POST'])
def createPolicy():
    print('data')
    print(request.data.decode('utf-8'))
    print('data\n\n')
    json_data = json.loads(request.data.decode('utf-8'))
    bobName = json_data['bob']
    label = json_data['label']
    aliceFile = json_data['alice']
    password = json_data['password']
    label = label.encode()
    # Generating Alice
    alice_config = AliceConfiguration.from_configuration_file(
        filepath=aliceFile,
        known_nodes={ursula},
        start_learning_now=False,
    )

    alice_config.keyring.unlock(password=password)
    alicia = alice_config(domains={'TEMPORARY_DOMAIN'})

    alicia.start_learning_loop(now=True)

    # Generating Bob
    bobFilePath = os.path.join(os.getcwd(), 'bob/' + bobName + '.json')
    doctor_pubkeys = _get_keys(bobFilePath, UmbralPublicKey)
    powers_and_material = {
        DecryptingPower: doctor_pubkeys['enc'],
        SigningPower: doctor_pubkeys['sig']
    }

    print (powers_and_material)
    doctor_strange = Bob.from_public_keys(powers_and_material=powers_and_material,
                                          federated_only=True)

    policy_end_datetime = maya.now() + datetime.timedelta(days=10)
    # Generate Policy
    policy = alicia.grant(bob=doctor_strange,
                          label=label,
                          m=1,
                          n=1,
                          expiration=policy_end_datetime)

    print (policy.public_key.to_bytes().hex())

    data = {
        'done' : True
    }

    return jsonify(data)


@app.route('/decryptDelegated', methods=['POST'])
def decryptDelegated():
    # Fetch Request Data
    json_data = json.loads(request.data.decode('utf-8'))
    bob_private_keys = json.loads(json_data['bobKeys'])
    policy_public_key = json_data['policy_public_key']
    alice_signing_key = json_data['alice_sig_pubkey']
    label = json_data['label']
    message = json_data['message']
    data_source = json_data['data_source']

    data_source = bytes.fromhex(data_source)
    print (bob_private_keys['enc'])

    enc = UmbralPrivateKey.from_bytes(bytes.fromhex(bob_private_keys["enc"]))
    sig = UmbralPrivateKey.from_bytes(bytes.fromhex(bob_private_keys["sig"]))

    signingPublic = sig.get_pubkey()
    bobFilePath = os.path.join(os.getcwd(), 'bob/' + 'pranav' + '.json')
    doctor_pubkeys = _get_keys(bobFilePath, UmbralPublicKey)
    print (signingPublic == doctor_pubkeys['sig'])
    print (signingPublic)
    print (doctor_pubkeys['sig'])
    print ('\n\n\n')

    bob_enc_keypair = DecryptingKeypair(private_key=enc)
    bob_sig_keypair = SigningKeypair(private_key=sig)

    enc_power = DecryptingPower(keypair=bob_enc_keypair)
    sig_power = SigningPower(keypair=bob_sig_keypair)
    power_ups = [enc_power, sig_power]

    doctor = Bob(
        domains={'TEMPORARY_DOMAIN'},
        is_me=True,
        federated_only=True,
        crypto_power_ups=power_ups,
        start_learning_now=True,
        abort_on_learning_error=True,
        known_nodes={ursula},
        save_metadata=False,
        network_middleware=RestMiddleware()
    )

    policy_pubkey = UmbralPublicKey.from_bytes(bytes.fromhex(policy_public_key))
    alices_sig_pubkey = UmbralPublicKey.from_bytes(bytes.fromhex(alice_signing_key))
    label = label.encode()

    doctor.join_policy(label, alices_sig_pubkey)

    message_kit = UmbralMessageKit.from_bytes(bytes.fromhex(message))

    print (message_kit == MessageKit)
    print (message_kit)
    print (MessageKit)
    print ('\n\n\n')

    data_source = Enrico.from_public_keys(
        {SigningPower: data_source},
        policy_encrypting_key=policy_pubkey
    )

    retrieved_plaintexts = doctor.retrieve(
        label=label,
        message_kit=message_kit,
        data_source=data_source,
        alice_verifying_key=alices_sig_pubkey
    )

    plaintext = msgpack.loads(retrieved_plaintexts[0], raw=False)

    data = {
        "plainText" : plaintext
    }

    return jsonify(data)










def _get_keys(file, key_class):
    if not os.path.isfile(file):
        generate_bob_keys()

    with open(file) as f:
        stored_keys = json.load(f)
    keys = dict()
    for key_type, key_str in stored_keys.items():
        keys[key_type] = key_class.from_bytes(bytes.fromhex(key_str))
    return keys


def generate_bob_keys(username):
    enc_privkey = UmbralPrivateKey.gen_key()
    sig_privkey = UmbralPrivateKey.gen_key()


    keys = {};
    keys['enc'] = enc_privkey.to_bytes().hex()
    keys['sig'] = sig_privkey.to_bytes().hex()

    enc_pubkey = enc_privkey.get_pubkey()
    sig_pubkey = sig_privkey.get_pubkey()

    doctor_pubkeys = {
        'enc': enc_pubkey.to_bytes().hex(),
        'sig': sig_pubkey.to_bytes().hex()
    }

    BOB_PUBLIC_KEYS = os.path.join(os.getcwd(), 'bob/' + username + '.json')

    with open(BOB_PUBLIC_KEYS, 'w') as f:
        json.dump(doctor_pubkeys, f)

    return json.dumps(keys) 