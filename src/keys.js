let contexts = [];
const listeners = new Map();

function currentContext() {
  return contexts[Math.max(0, contexts.length - 1)];
}

export function setContext(contextId) {
  contexts[Math.max(0, contexts.length - 1)] = contextId;
}

export function pushContext(contextId) {
  contexts.push(contextId);
}

export function popContext() {
  contexts.pop();
}

export function add(keyOrKeys, contextId, callback) {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];

  const onKeydown = event => {
    if (keys.includes(event.key) && currentContext() === contextId) {
      event.preventDefault();
      callback(event);
    }
  };

  document.addEventListener("keydown", onKeydown);

  const contextListeners = listeners.has(contextId)
    ? listeners.get(contextId)
    : new Map();
  const listenerId = keys.join(",");

  const cleanUp = () => {
    document.removeEventListener("keydown", onKeydown);
    contextListeners.delete(listenerId);
  };

  contextListeners.set(listenerId, cleanUp);
  listeners.set(contextId, contextListeners);

  return cleanUp;
}

export function remove(keyOrKeys, contextId) {
  const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
  const contextListeners = listeners.get(contextId);

  if (contextListeners) {
    const listenerId = keys.join(",");
    const cleanUp = contextListeners.get(listenerId);

    if (cleanUp) {
      cleanUp();
    }

    if (contextListeners.size === 0) {
      listeners.delete(contextId);
    }
  }
}

export function removeContext(contextId) {
  const contextListeners = listeners.get(contextId);

  if (contextListeners) {
    for (const cleanUp of contextListeners.values()) {
      cleanUp();
    }

    listeners.delete(contextId);
  }
}

export function removeAll() {
  for (const [contextId, contextListeners] of listeners) {
    for (const cleanUp of contextListeners.values()) {
      cleanUp();
    }

    listeners.delete(contextId);
  }
}
