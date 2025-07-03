// type Json = Record<string, unknown> | unknown[];

// async function baseRequest<T>( url: string, options: RequestInit = {} ): Promise<T> 
// {
//   const res = await fetch(url, 
//     {
//     ...options,
//     headers: 
//       {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//     });

//   if (!res.ok) {
//     // TODO: Добавить обработку ошибок
//     throw new Error(res.statusText);
//   }
//   return (await res.json()) as T;
// }

// // Вспомогательная фабрика
// function withMethod(method: string) {
//   // Перегрузка: body может быть опущен (GET/DELETE)
//   return function <
//     T = unknown,
//     B extends Json | undefined = undefined
//   >(
//     url: string,
//     body?: B,
//     options: Omit<RequestInit, "method" | "body"> = {}
//   ): Promise<T> {
//     return baseRequest<T>(url, {
//       ...options,
//       method,
//       body: body ? JSON.stringify(body) : undefined,
//     });
//   };
// }

// // объединяем в объект
// export const request = Object.assign(baseRequest, {
//   get: withMethod("GET"),
//   post: withMethod("POST"),
//   put: withMethod("PUT"),
//   patch: withMethod("PATCH"),
//   del: withMethod("DELETE"),
// });

export async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return (await res.json()) as T;
}
