<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-button @click="logout">Logout</ion-button>
            <p>Halaman Profile!</p>
        </ion-content>
    </ion-page>
</template>

<script>
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default {
    name: 'Profile',
    methods: {
        async logout() {
            try {
                await signOut(auth);
                this.$router.push("/login");
            } catch (error) {
                alert("Gagal logout: " + error.message);
            }
        },
    },
};
</script>

<style scoped>
/* Add your styles here */
</style>