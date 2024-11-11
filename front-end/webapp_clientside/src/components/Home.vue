<template>
  <div class="home">
    <section class="video-section">
      <video autoplay loop muted playsinline class="video">
        <source src="../medias/McLaren_Home_Video.mp4" type="video/mp4">
      </video>

    </section>
    <label class="navigation-button">
      <input type="checkbox" @click="scroller" id="Scroller">
      <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="chevron-down" :style="{ fill: fill }">
        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
      </svg>
    </label>
    <section class="content-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-5">
            <img src="../medias/Supra_img.jpg" alt="Car Image" class="img-fluid">
          </div>
          <div class="col-md-5">
            <h1>Welcome to Los Santos CUSTOMS</h1>
            <p>Born from a passion for performance and esthetics, LS CUSTOMS was founded to build your perfect vehicle.
              Our goal is to craft your own vision of mechanics and freedom, because each car is a part of you and you derseves the best.
            </p>
            <p>Start your journey today by browsing our selection of premium vehicles and customizing them to your exact specifications.
              With our easy-to-use interface and expert guidance, you'll be driving the car of your dreams in no time.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
      fill: 'white'
    }
  },
  methods :{
    scroller(){
      var checkBox = document.getElementById("Scroller");
      if (checkBox.checked == true){
        window.scrollTo({ top: 600, behavior: 'smooth' });
        this.fill = '#333333';
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.fill = 'white';
      }
    },
  }
};
</script>

<style scoped>
.navigation-button{
  bottom: 8vh;
  right: 50vw;
  --color: #0077b6;
  --size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  cursor: pointer;
  font-size: var(--size);
  user-select: none;
  fill: var(--color);
}
.navigation-button input {
  display: none;
}
.navigation-button .chevron-down {
  position: absolute;
  animation: keyframes-return .5s;

}
.navigation-button input:checked ~ .chevron-down {
  animation: keyframes-rotate .5s;
  transform: rotate(180deg);
}

.navigation-button input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;

}

@keyframes keyframes-rotate {
  0% {
    transform: rotate(0deg);
    opacity: 0;
  }

  100% {
    transform: rotate(-180deg);
  }
}

@keyframes keyframes-return {
  0% {
    transform: rotate(-180deg);
    opacity: 0;
  }

  100% {
    transform: rotate(0deg);
  }
}


.home {
  width: 100%;
}

.video-section {
  width: 100%;
  height: 95vh;
  overflow: hidden;
  position: relative;
}

.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-section {
  padding: 50px 0;
  background-color: #EEEFF2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 100px;
}

.home h1 {
  color: #333;
  font-size: 2.5em;
  margin-bottom: 20px;
}

.home p {
  color: #666;
  font-size: 1.2em;
  margin-bottom: 20px;
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .container {
    padding-top: 120px;
  }

  .home h1 {
    font-size: 2em;
  }

  .home p {
    font-size: 1em;
  }

  .content-section {
    padding: 30px 0;
  }
}
</style>
