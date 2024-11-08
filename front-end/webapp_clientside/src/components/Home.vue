<template>
  <div class="home">
    <section class="video-section">
      <video autoplay loop muted playsinline class="video">
        <source src="../medias/McLaren_Home_Video.mp4" type="video/mp4">
      </video>
    </section>
    <section class="content-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-5">
            <img src="../medias/Supra_img.jpg" alt="Car Image" class="img-fluid">
          </div>
          <div class="col-md-5">
            <h1>Welcome to Our Car Customization Service</h1>
            <p>Experience the ultimate in car customization with our state-of-the-art tools and services. Whether you're looking to upgrade your vehicle's performance, enhance its aesthetics, or add personalized features, we have everything you need to make your dream car a reality.</p>
            <p>Start your journey today by browsing our selection of premium vehicles and customizing them to your exact specifications. With our easy-to-use interface and expert guidance, you'll be driving the car of your dreams in no time.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
  width: 100%;
}

.video-section {
  width: 100%;
  height: 100vh;
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
  background: #fff;
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
