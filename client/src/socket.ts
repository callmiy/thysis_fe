import { Socket } from "phoenix";
import { Channel } from "phoenix";
import { logger } from "./utils";
import { getToken } from "src/state";
import getBackendUrls from "./get-backend-urls";
import { load } from "./routes/Projects/initial-data";

enum CHANNEL {
  "DATA_PLAIN" = "data:pxy",
  "DATA_AUTH" = "data:pxz"
}

enum ChannelTopic {
  "GRAPHQL_PLAIN" = "graphql:pxy",
  "GRAPHQL_AUTH" = "graphql:pxz"
}

let socket: Socket;

export const defineSocket = () => {
  const appSocket = {
    sendDataAuth,
    connect
  };

  if (socket) {
    return appSocket;
  }

  let socketDisconnectedCount = 0;
  let dataAuthChannel: Channel;

  function connect(token = getToken()) {
    const params = token ? { params: { token } } : {};
    socket = new Socket(getBackendUrls().websocketUrl, params);
    socket.connect();

    socket.onOpen(joinDataAuthChannel);

    socket.onError(() => {
      dispatchDisconnected();
    });
  }

  connect();

  function sendDataAuth<TVariables, TData, TError = {}>(
    query: string,
    variables: TVariables,
    ok: OnChannelMessage<TData>,
    error: OnError<TError> = defaultError
  ) {
    return sendChannelMsg(dataAuthChannel, {
      ok,
      params: {
        query,
        variables
      },
      topic: ChannelTopic.GRAPHQL_AUTH,
      error
    });
  }

  function dispatchDisconnected() {
    if (socketDisconnectedCount === 0) {
      socketDisconnectedCount = 1;
    }
  }

  function joinDataAuthChannel() {
    dataAuthChannel = socket.channel(CHANNEL.DATA_AUTH);

    dataAuthChannel
      .join()
      .receive("ok", message => {
        socketDisconnectedCount = 0;
        load(message);

        logger("log", "Data plain channel joined", message);
      })
      .receive("error", reason => {
        dispatchDisconnected();
        logger("error", "Data plain channel join error", reason);
      })
      .receive("timeout", () => {
        dispatchDisconnected();
        logger("warn", "Data plain channel join timeout");
      });
  }

  function sendChannelMsg<TData, B, C>(
    channel: Channel,
    {
      topic,
      ok = defaultError,
      error,
      params,
      onTimeout
    }: ChannelMessageSend<TData, B, C>
  ) {
    if (!channel) {
      logger("warn", "Sending to channel: - channel unavailable", channel);
      return;
    }

    logger("log", "Sending to channel topic:", topic, "params:\n", {
      ok,
      error,
      params,
      onTimeout
    });

    channel
      .push(topic, params || {})
      .receive("ok", (data: TData) => {
        logger(
          "log",
          "socket send to topic",
          topic,
          "successful.\nReceived data:\n",
          data
        );

        ok(data);
      })
      .receive("error", (reasons = {}) => {
        logger("error", "socket send to topic", topic, "Errors:\n", reasons);

        error(reasons);
      })
      .receive("timeout", reasons => {
        if (onTimeout) {
          onTimeout(reasons);
        }
      });
  }

  function defaultError() {
    return null;
  }

  return appSocket;
};

export const AppSocket = defineSocket();
export default AppSocket;

type OnChannelMessage<T> = (msg: T) => void;
type OnError<T> = (reason: T) => void;

interface ChannelMessage<TData, TParams, TError = {}, TTimeout = {}> {
  params: TParams;

  ok: OnChannelMessage<TData>;

  error: OnError<TError>;

  onTimeout?: (reason: TTimeout) => void;
}

type ChannelMessageSend<
  TData,
  TParams,
  TError = {},
  TTimeout = {}
> = ChannelMessage<TData, TParams, TError, TTimeout> & {
  topic: ChannelTopic;
};
