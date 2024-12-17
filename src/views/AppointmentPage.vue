<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <a class="back-button" @click="goBack"> Back </a>
                </ion-buttons>
                <ion-title>Make Appointment</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding" style="--background: #e1eee9;">
            <h2 class="page-title" style="color: black;">Your Chosen Information</h2>
            <div class="info-box">
                <p><strong>Rumah Sakit:</strong> {{ hospitalName }}</p>
                <p><strong>Poli:</strong> {{ poliName }}</p>
                <p><strong>Dokter:</strong> {{ doctorName }}</p>
                <p><strong>Jadwal:</strong> {{ doctorSchedule }}</p>
            </div>

            <h2 class="page-title" style="color: black;">Form Pendaftaran Pasien</h2>
            <form @submit.prevent="submitAppointment">
                <ion-label position="stacked" style="font-weight: bold;">NIK</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.nik" type="text" placeholder="Masukkan NIK" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Nama Lengkap</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.name" type="text" placeholder="Masukkan Nama Lengkap" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Tempat Lahir</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.birthPlace" type="text" placeholder="Masukkan Tempat Lahir" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Tanggal Lahir</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.birthDate" type="date" placeholder="Pilih Tanggal Lahir" required></ion-input>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Alamat</ion-label>
                <ion-item class="custom-item">
                    <ion-textarea v-model="appointment.address" placeholder="Masukkan Alamat" required></ion-textarea>
                </ion-item>

                <ion-label position="stacked" style="font-weight: bold;">Nomor Telepon</ion-label>
                <ion-item class="custom-item">
                    <ion-input v-model="appointment.phone" type="tel" placeholder="Masukkan Nomor Telepon" required></ion-input>
                </ion-item>

                <ion-button expand="block" class="submit-button" type="submit">Buat Janji</ion-button>
            </form>
        </ion-content>
    </ion-page>
</template>

<script>
export default {
    data() {
        return {
            hospitalName: "",
            poliName: "",
            doctorName: "",
            doctorSchedule: "",
            appointment: {
                nik: "",
                name: "",
                birthPlace: "",
                birthDate: "",
                address: "",
                phone: "",
            },
        };
    },
    methods: {
        goBack() {
            this.$router.back();
        },
        submitAppointment() {
            alert("Formulir berhasil dikirim!");
        },
    },
};
</script>

<style scoped>
.page-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    color: #006FAE;
    margin-bottom: 16px;
}

.info-box {
    background: #f8f9fa;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.custom-item {
    --border-width: 2px;
    --border-color: lightgrey; /* Default border color */
    --focus-border-color: #038d92; /* Focus border color */
    --hover-border-color: #038d92; /* Hover border color */
    border: var(--border-width) solid var(--border-color);
    border-radius: 10px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.custom-item:focus-within {
    border-color: var(--focus-border-color);
}

.custom-item:hover {
    border-color: var(--hover-border-color);
    box-shadow: 0 0 5px rgba(3, 141, 146, 0.5);
}

.submit-button {
    --background: #006FAE;
    --border-radius: 20px;
    color: white;
    font-weight: bold;
    text-transform: none;
}

.ion-padding {
    margin: 10px;
}
</style>
