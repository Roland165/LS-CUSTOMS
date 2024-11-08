<template>
  <div class="home">
    <!-- Full-screen video background -->
    <div class="video-background">
      <video autoplay loop muted playsinline class="video">
        <source src="../medias/mclaren_p1_backroads_4k.mp4" type="video/mp4">
      </video>
    </div>

    <div class="content-overlay">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img src="path/to/your/image.jpg" alt="Car Image" class="img-fluid">
          </div>
          <div class="col-md-6">
            <h1>Welcome to Our Car Customization Service</h1>
            <p>Experience the ultimate in car customization with our state-of-the-art tools and services. Whether you're looking to upgrade your vehicle's performance, enhance its aesthetics, or add personalized features, we have everything you need to make your dream car a reality.</p>
            <p>Start your journey today by browsing our selection of premium vehicles and customizing them to your exact specifications. With our easy-to-use interface and expert guidance, you'll be driving the car of your dreams in no time.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
};
</script>

<style scoped>
.home {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}

.video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
}

.content-overlay {
  position: relative;
  z-index: 1;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.home h1 {
  color: #fff;
  font-size: 2.5em;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.home p {
  color: #fff;
  font-size: 1.2em;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.img-fluid {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Responsive Styles */
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
}
</style>
