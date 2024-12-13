<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>{{ isEditMode ? "Edit Poli" : "Tambah Poli" }}</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <div class="container">
                <ion-item>
                    <ion-label position="stacked">Nama Poli</ion-label>
                    <ion-input :value="formData.name" placeholder="Masukkan nama poli"
                        @ionInput="formData.name = $event.target.value"></ion-input>
                </ion-item>

                <ion-button expand="block" @click="handleSubmit">
                    {{ isEditMode ? "Simpan Perubahan" : "Tambah Poli" }}
                </ion-button>
            </div>
        </ion-content>
    </ion-page>
</template>

<script>
import { getFirestore, doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";

export default {
    name: "PoliForm",
    data() {
        return {
            formData: {
                name: "",
            },
            isEditMode: false,
            hospitalId: null,
            poliId: null,
        };
    },
    methods: {
        async fetchPoliData() {
            try {
                const db = getFirestore();
                const poliRef = doc(db, "hospitals", this.hospitalId, "polyclinics", this.poliId);
                const poliDoc = await getDoc(poliRef);

                if (poliDoc.exists()) {
                    this.formData.name = poliDoc.data().name || "";
                }
            } catch (error) {
                console.error("Error fetching poli data:", error);
            }
        },
        async getNextPoliId() {
            try {
                const db = getFirestore();
                const polyclinicsRef = collection(db, "hospitals", this.hospitalId, "polyclinics");
                const querySnapshot = await getDocs(polyclinicsRef);

                const ids = querySnapshot.docs
                    .map((doc) => doc.id)
                    .filter((id) => id.startsWith("poli_"))
                    .map((id) => parseInt(id.split("_")[1]));

                const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
                return `poli_${nextId}`;
            } catch (error) {
                console.error("Error generating next Poli ID:", error);
                return `poli_${Date.now()}`; // Fallback jika terjadi kesalahan
            }
        },
        async handleSubmit() {
            if (!this.formData.name.trim()) {
                alert("Nama poli tidak boleh kosong");
                return;
            }

            try {
                const db = getFirestore();
                if (this.isEditMode) {
                    // Edit mode
                    const poliRef = doc(db, "hospitals", this.hospitalId, "polyclinics", this.poliId);
                    await setDoc(poliRef, this.formData, { merge: true });
                } else {
                    // Add new poli
                    const newDocId = await this.getNextPoliId();
                    const poliRef = doc(db, "hospitals", this.hospitalId, "polyclinics", newDocId);
                    await setDoc(poliRef, this.formData);
                }

                this.$router.push({ name: "PoliPage", params: { hospitalId: this.hospitalId } });
            } catch (error) {
                console.error("Error saving poli data:", error);
            }
        },
    },
    mounted() {
        this.hospitalId = this.$route.params.hospitalId;
        this.poliId = this.$route.params.poliId;

        if (this.poliId) {
            this.isEditMode = true;
            this.fetchPoliData();
        }
    },
};
</script>


<style scoped>
.container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    margin: 20px auto;
    max-width: 600px;
}

.submit-button {
    margin-top: 20px;
    background-color: #006FAE;
    color: white;
    font-weight: bold;
    border-radius: 20px;
}

.submit-button:hover {
    background-color: #004f75;
    transition: background-color 0.3s;
}
</style>
