export function emailTemplate1 (data) {
    return `<p>Hello ${data?.name || data}</p>`
}