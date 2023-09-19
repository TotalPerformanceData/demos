import requests

try:
    from creds import k
except ImportError:
    k = None

if k and 'sc' in request.args and 'includes' in request.args:
    response = requests.get(f"https://www.tpd.zone/json-rpc/v2/vendors/runner_velocities/?sc={request.args['sc']}&includes={request.args['includes']}&source={request.args['source']}&k={k}")
    print(response.content)
else:
    print([])