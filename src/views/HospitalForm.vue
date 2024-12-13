<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ isEdit ? "Edit Rumah Sakit" : "Tambah Rumah Sakit" }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <ion-item>
                    <ion-label position="stacked">Nama Rumah Sakit</ion-label>
                    <ion-input :value="hospital.name" placeholder="Masukkan nama rumah sakit"
                        @ionInput="hospital.name = $event.target.value"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Alamat</ion-label>
                    <ion-input :value="hospital.address" placeholder="Masukkan alamat"
                        @ionInput="hospital.address = $event.target.value"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Kontak</ion-label>
                    <ion-input :value="hospital.contact" placeholder="Masukkan kontak"
                        @ionInput="hospital.contact = $event.target.value"></ion-input>
                </ion-item>

                <ion-item>
                    <ion-label position="stacked">Deskripsi</ion-label>
                    <ion-textarea :value="hospital.deskripsi" placeholder="Masukkan deskripsi"
                        @ionInput="hospital.deskripsi = $event.target.value"></ion-textarea>
                </ion-item>

                <ion-button expand="block" @click="saveHospital">
                    {{ isEdit ? "Simpan Perubahan" : "Tambah Rumah Sakit" }}
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>


<script>
import { getFirestore, doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";

export default {
    name: "HospitalForm",
    data() {
        return {
            hospital: {
                name: "",
                address: "",
                contact: "",
                deskripsi: "",
            },
            isEdit: false,
        };
    },
    async mounted() {
        const hospitalId = this.$route.params.hospitalId;
        if (hospitalId) {
            this.isEdit = true;
            const db = getFirestore();
            const docRef = doc(db, "hospitals", hospitalId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                this.hospital = {
                    name: data.name || "",
                    address: data.address || "",
                    contact: data.contact || "",
                    deskripsi: data.deskripsi || "",
                };
            }
        }
    },
    methods: {
        async getNextHospitalId() {
            try {
                const db = getFirestore();
                const hospitalsRef = collection(db, "hospitals");
                const querySnapshot = await getDocs(hospitalsRef);

                // Ambil semua ID dokumen yang ada
                const ids = querySnapshot.docs
                    .map((doc) => doc.id)
                    .filter((id) => id.startsWith("hospital_"))
                    .map((id) => parseInt(id.split("_")[1]));

                // Tentukan ID baru
                const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
                return `hospital_${nextId}`;
            } catch (error) {
                console.error("Error generating next Hospital ID:", error);
                return `hospital_${Date.now()}`; // Fallback jika terjadi kesalahan
            }
        },
        async saveHospital() {
            if (!this.hospital.name.trim() || !this.hospital.address.trim() || !this.hospital.contact.trim() || !this.hospital.deskripsi.trim()) {
                alert("Semua field harus diisi!");
                return;
            }

            const db = getFirestore();
            try {
                if (this.isEdit) {
                    // Mode edit
                    const docRef = doc(db, "hospitals", this.$route.params.hospitalId);
                    await setDoc(docRef, this.hospital);
                } else {
                    // Mode tambah
                    const newHospitalId = await this.getNextHospitalId();
                    const docRef = doc(db, "hospitals", newHospitalId);

                    // Simpan data
                    await setDoc(docRef, this.hospital);
                }

                // Redirect ke halaman utama
                this.$router.push({ name: "SelectHospital" });
            } catch (error) {
                console.error("Error saving hospital:", error);
            }
        },
    },
};
</script>
