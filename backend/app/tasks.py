import grpc
from google.cloud.tasks_v2 import CloudTasksClient
from google.cloud.tasks_v2.gapic.enums import HttpMethod
from google.cloud.tasks_v2.gapic.transports.cloud_tasks_grpc_transport import CloudTasksGrpcTransport


def create_task(payload=None, in_seconds=None,endpoint=None):
    # [START cloud_tasks_appengine_create_task]
    """Create a task for a given queue with an arbitrary payload."""
    from google.protobuf import timestamp_pb2
    import datetime
    import json

    # Create a client.
    client = CloudTasksClient(
        transport=CloudTasksGrpcTransport(channel=grpc.insecure_channel("127.0.0.1:9090"))

    )

    # TODO(developer): Uncomment these lines and replace with your values.
    project = 'microblog'
    queue = 'default'
    location = 'us-central1'
    payload = payload   #'hello' or {'param': 'value'} for application/json
    in_seconds = in_seconds

    # Construct the fully qualified queue name.
    parent = client.queue_path(project, location, queue)

    # Construct the request body.
    task = {
            'app_engine_http_request': {  # Specify the type of request.
                'http_method': HttpMethod.POST,
                'relative_uri': endpoint
            }
    }
    if payload is not None:
        if isinstance(payload, dict):
            # Convert dict to JSON string
            payload = json.dumps(payload)
            # specify http content-type to application/json
            task["app_engine_http_request"]["headers"] = {"Content-type": "application/json"}
        # The API expects a payload of type bytes.
        converted_payload = payload.encode()

        # Add the payload to the request.
        task['app_engine_http_request']['body'] = converted_payload

    if in_seconds is not None:
        # Convert "seconds from now" into an rfc3339 datetime string.
        d = datetime.datetime.now(tz=datetime.timezone.utc) + datetime.timedelta(seconds=in_seconds)

        # Create Timestamp protobuf.
        timestamp = timestamp_pb2.Timestamp()
        timestamp.FromDatetime(d)

        # Add the timestamp to the tasks.
        task['schedule_time'] = timestamp

    # Use the client to build and send the task.
    response = client.create_task(parent=parent, task=task)

    print('Created task {}'.format(response.name))
    return response