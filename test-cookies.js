// Test Script untuk Console Browser
// Paste script ini di console browser untuk mengecek cookie

console.log("=== CEK STATUS LOGIN ===");
console.log("Cookies:", document.cookie);

// Cek apakah ada cookie auth
const cookies = document.cookie.split(";");
const hasAuthCookie = cookies.some(
  (cookie) =>
    cookie.trim().startsWith("role=") ||
    cookie.trim().startsWith("token=") ||
    cookie.trim().startsWith("connect.sid=")
);

console.log(
  "Status Login:",
  hasAuthCookie ? "✅ Sudah Login" : "❌ Belum Login"
);

// Tampilkan semua cookie
cookies.forEach((cookie) => {
  const [name, value] = cookie.trim().split("=");
  console.log(`- ${name}: ${value}`);
});

// Fungsi untuk set cookie manual (untuk testing)
function setTestCookie() {
  document.cookie = "role=user; path=/; max-age=86400";
  console.log("✅ Cookie role=user berhasil dibuat untuk testing");
  console.log("Refresh halaman untuk melihat perubahan");
}

// Fungsi untuk hapus semua cookie (untuk testing)
function clearAllCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name.trim()}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
  console.log("✅ Semua cookie berhasil dihapus");
  console.log("Refresh halaman untuk melihat perubahan");
}

console.log("\n=== FUNGSI TESTING ===");
console.log("Ketik setTestCookie() untuk membuat cookie testing");
console.log("Ketik clearAllCookies() untuk hapus semua cookie");
