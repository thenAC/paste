export function formatAPIResponse(res: any) {
  if (res?.success) {
    return res.data;
  }
  if (res?.success === false) {
    throw new Error(`API Error: ${res.msg} (${res.code})`);
  }
  throw new Error('API Error: Unknown error');
}
