<script setup lang="ts">
import { ref } from 'vue'
import KUNGalgameFooter from '@/components/KUNGalgameFooter.vue'

// Import login panel
import Login from './components/Login.vue'

// Import registration panel
import Register from './components/Register.vue'

const isShowPanel = ref('')

// Click login, slide the panel
const handleClickSignIn = () => {
  isShowPanel.value = ''
}

// Click register, slide the panel
const handleClickRegister = () => {
  isShowPanel.value = 'active'
}
</script>

<template>
  <div class="root">
    <div class="container" :class="isShowPanel">
      <!-- Login and registration toggle -->
      <div class="switch">
        <div @click="handleClickSignIn">{{ $tm('login.overlay.login') }}</div>
        <div @click="handleClickRegister">
          {{ $tm('login.overlay.register') }}
        </div>
      </div>

      <!-- Login panel -->
      <Login class="login" />

      <!-- Registration panel -->
      <Register class="register" />

      <!-- Sidebar -->
      <div class="container-overlay">
        <div class="overlay">
          <div class="panel left">
            <h2>
              {{ $tm('login.overlay.title') }}<br /><br />——
              {{ $tm('login.overlay.world') }}
              <span>{{ $tm('login.overlay.moe') }}</span>
              {{ $tm('login.overlay.forum') }}
            </h2>
            <br />
            <button class="btn" @click="handleClickSignIn">
              {{ $tm('login.overlay.login') }}
            </button>
          </div>
          <div class="panel right">
            <h2>
              {{ $tm('login.overlay.home') }}
              <br />
              <br />
              {{ $tm('login.overlay.kun') }}
              <br />
              {{ $tm('login.overlay.hug') }}
            </h2>
            <button class="btn" @click="handleClickRegister">
              {{ $tm('login.overlay.register') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <KUNGalgameFooter style="position: absolute; bottom: 2%" />
  </div>
</template>

<style lang="scss" scoped>
.root {
  align-items: center;
  display: grid;
  height: 100vh;
  place-items: center;
  min-height: 500px;
  min-width: 800px;
  background: linear-gradient(
    var(--kungalgame-trans-pink-0),
    var(--kungalgame-trans-blue-0)
  );
  position: relative;
}

.container {
  background-position: top;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
  box-shadow: 0 15px 27px var(--kungalgame-blue-0),
    0 10px 10px var(--kungalgame-blue-0);
  height: 490px;
  max-width: 700px;
  position: relative;
  width: 100%;
  background-image: url('/login.webp');
}

.switch {
  width: 90%;
  top: 4%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 40px;
  position: absolute;
  z-index: 10;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: var(--kungalgame-white);
  background-color: var(--kungalgame-blue-4);
  border-radius: 5px 5px 0 0;
  display: none;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      border-right: 1px solid var(--kungalgame-white);
    }
  }
}

.container.active {
  .login {
    transform: translateX(100%);
  }
  .register {
    animation: show 0.6s;
    opacity: 1;
    transform: translateX(100%);
    z-index: 5;
  }
  .container-overlay {
    transform: translateX(-100%);
  }
  .overlay {
    transform: translateX(50%);
  }
  .left {
    transform: translateX(0);
  }
  .right {
    transform: translateX(20%);
  }
}

.container-overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.overlay {
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;

  h2 {
    margin-top: 150px;
    font-size: medium;
    color: var(--kungalgame-font-color-2);
  }

  h2 span {
    color: var(--kungalgame-red-4);
    padding: 0 5px;
    font-size: 20px;
  }

  .left {
    transform: translateX(-20%);
  }

  .right {
    right: 0;
    transform: translateX(0);
  }
}

.panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
  background-color: var(--kungalgame-trans-white-5);
}

.btn {
  width: 150px;
  position: absolute;
  border-radius: 50px;
  cursor: pointer;
  font-size: 15px;
  letter-spacing: 2px;
  padding: 7px 0px;
  text-transform: uppercase;
  transition: all 0.2s;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  bottom: 10%;
  background-color: var(--kungalgame-red-0);
  border: 1px solid var(--kungalgame-red-4);
  color: var(--kungalgame-red-4);

  &:hover {
    background-color: var(--kungalgame-red-4);
    color: var(--kungalgame-white);
  }

  &:active {
    transform: scale(0.95);
  }
}

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}

@media (max-width: 700px) {
  .switch {
    display: flex;
  }

  .root {
    min-width: 0;
    width: 100%;
    background: var(--kungalgame-trans-blue-0);
  }

  .container {
    background-image: none !important;
    display: flex;
    box-shadow: none;
  }

  .container-overlay {
    display: none;
  }

  .container.active {
    .login {
      display: none;
      transform: translateX(0);
    }

    .register {
      animation: none;
      transform: translateX(0);
    }
  }
}
</style>
