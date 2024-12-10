<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Profile</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="profile-content">
            <ion-card>
                <div class="profile-header">
                    <h2 class="profile-title">Your Profile</h2>
                    <div class="avatar-edit">
                        <ion-avatar>
                            <img src="https://via.placeholder.com/150" alt="User Avatar">
                        </ion-avatar>
                        <ion-button color="primary" class="button-edit">Edit Profile</ion-button>
                    </div>
                    <div class="input-group">
                        <ion-label >Nama Pengguna</ion-label>
                        <ion-input v-model="username" class="profile-input" disabled>windah</ion-input>
                    </div>
                    <div class="input-group">
                        <ion-label position="stacked">Email</ion-label>
                        <ion-input v-model="email" class="profile-input" disabled>windah@gmail.com</ion-input>
                    </div>
                </div>
                <div class="profile-actions">
                    <ion-button expand="block" color="danger" class="button-logout" @click="logout">Logout</ion-button>
                </div>
            </ion-card>
        </ion-content>
    </ion-page>
</template>

<script>
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export default {
    name: 'Profile',
    data() {
        return {
            username: "windah",
            email: "windah@gmail.com",
        };
    },
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
.profile-content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px;
    background-color: #f8f9fa;
}

ion-card {
    width: 100%;
    max-width: 355px;
    padding: 16px;
    justify-content: center;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

ion-label {
    text-align: left;
    font-size: 24px;
    
}

.profile-header {
    text-align: center;
    margin-bottom: 16px;
}

.avatar-edit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 16px;
}

ion-avatar {
    width: 100px;
    height: 100px;
    margin-right: 16px;
}

.button-edit {
    font-size: 14px;
    height: 32px;
}

ion-label {
    font-size: 14px;
    color: #333;
}

ion-input {
    width: 100%;
    height: 20px;
    padding: 10px;
    margin-right: 10px;
    margin-bottom: 16px;

}

.profile-input {
    font-size: 20px;
    color: #4a4a4a;

    border-radius: 4px;
    border: 1px solid #ddd;
    text-align: left;
    line-height: 40px;
}

.profile-actions {
    margin-top: 16px;
}

.button-logout {
    height: 40px;
    font-size: 16px;
    border-radius: 8px;
}
</style>
