// const BASE_URL = "http://10.0.2.2:8000"; // Android emulator uses 10.0.2.2 for localhost
//
// export async function signup(username, email, password, role) {
//   const res = await fetch(`${BASE_URL}/api/identity/signup/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, email, password, role })
//   });
//   return await res.json();
// }
//
// export async function login(username, password) {
//   const res = await fetch(`${BASE_URL}/api/token/`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username, password })
//   });
//   return await res.json();
// }
//
// export async function getUsers(token) {
//   const res = await fetch(`${BASE_URL}/api/identity/users/`, {
//     headers: { "Authorization": `Bearer ${token}` }
//   });
//   return await res.json();
// }
//
// export async function getProfiles(token, context=1) {
//   const res = await fetch(`${BASE_URL}/api/identity/profiles/?context=${context}`, {
//     headers: { "Authorization": `Bearer ${token}` }
//   });
//   return await res.json();
// }
//
//
// export async function createProfile(token, profile_name, description, context=1) {
//   const res = await fetch(`${BASE_URL}/api/identity/profiles/`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Authorization": `Bearer ${token}`
//     },
//     body: JSON.stringify({ profile_name, description, context })
//   });
//   return await res.json();
// }
