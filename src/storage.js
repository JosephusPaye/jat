export function restore(key, fallback) {
    const data = localStorage.getItem(`jat:${key}`);
    return data ? JSON.parse(data) : fallback;
}

export function persist(key, data) {
    localStorage.setItem(`jat:${key}`, JSON.stringify(data));
}
