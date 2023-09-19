import requests

try:
    from creds import k
except ImportError:
    k = None

if k and 'sc' in request.args and 'includes' in request.args:
    response = requests.get(f"https://www.tpd.zone/json-rpc/v2/vendors/streaming_request/?mode={request.args['mode']}&sc={request.args['sc']}&ip={request.remote_addr}&k={k}")
    print(response.content)
else:
    print([])