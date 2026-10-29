const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"
).replace(/\/$/, "");

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the backend. Check that FastAPI is running."
    );
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const data = await response.json();
      message = typeof data.detail === "string"
        ? data.detail
        : Array.isArray(data.detail)
          ? data.detail.map((item) => item.msg).join(", ")
          : message;
    } catch {
      // Keep the fallback message if the response is not JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function getTasks(status = "all") {
  const query = status === "all" ? "" : `?status=${status}`;
  return request(`/tasks${query}`);
}

export function createTask(task) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(taskId, task) {
  return request(`/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function setTaskCompletion(taskId, isCompleted) {
  return request(`/tasks/${taskId}/complete`, {
    method: "PATCH",
    body: JSON.stringify({ is_completed: isCompleted }),
  });
}

export function deleteTask(taskId) {
  return request(`/tasks/${taskId}`, { method: "DELETE" });
}
