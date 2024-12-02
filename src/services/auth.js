import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import bcrypt from "bcryptjs";

/**
 * Fungsi untuk mendaftarkan pengguna baru.
 * @param {string} email - Email pengguna.
 * @param {string} password - Password pengguna.
 * @param {string} username - Username pengguna.
 */
export async function registerUser(email, password, username) {
  // Validasi input (email, password, username)
  if (!email || !password || !username) {
    throw new Error("Semua kolom wajib diisi.");
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error("Masukkan email yang valid.");
  }

  if (password.length < 6) {
    throw new Error("Password minimal 6 karakter.");
  }

  // Proses registrasi
  try {
    // Buat akun di Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Hash password sebelum menyimpannya di Firestore
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Simpan data tambahan di Firestore
    await setDoc(doc(db, "users", uid), {
      username,
      email,
      password: hashedPassword, // Simpan password yang sudah di-hash
      createdAt: new Date(),
    });

    return "Akun berhasil dibuat.";
  } catch (error) {
    throw new Error(error.message);
  }
}
