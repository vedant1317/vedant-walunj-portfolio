import { useCallback, useEffect, useState } from "react";

// Loads the sketch wall (loading/error/empty/success) and posts new sketches.
// AbortController cancels an in-flight load on unmount so we never set state late.
export function useGuestbook() {
  const [state, setState] = useState({ status: "loading", data: [], error: null });

  const load = useCallback((signal) => {
    fetch("/api/guestbook", { signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setState({ status: "success", data: Array.isArray(data) ? data : [], error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") setState({ status: "error", data: [], error: err });
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: "loading", data: [], error: null });
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const reload = useCallback(() => {
    setState({ status: "loading", data: [], error: null });
    load();
  }, [load]);

  const post = useCallback(async (sketch) => {
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sketch),
    });
    if (!res.ok) throw new Error("post failed");
    const { sketch: saved } = await res.json();
    setState((s) => ({ ...s, status: "success", data: [saved, ...s.data].slice(0, 24) }));
    return saved;
  }, []);

  return { ...state, post, reload };
}
