import requests

from functools import lru_cache


@lru_cache(1000)
def read_spec_from_abi(abi_url):
    return requests.get(abi_url).json()

def read_contract(manager, abi_url, address):
    spec = read_spec_from_abi(abi_url)
    return manager.contract(address, abi=spec['abi'])