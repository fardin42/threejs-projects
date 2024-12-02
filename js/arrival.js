
// Animate the header and navigation links on page load
window.onload = () => {
    let tl = gsap.timeline();
    tl.from("header .hgroup", {
        duration: 1,
      
      width:0,
        ease: "power2.out",
        delay:.5
    });


    tl.from("header h1", {
        duration: 1,
        y: 200,
        ease: "power2.out",
        // delay:.5
    });

    tl.to("nav li", {
        duration: 1.5,
        opacity: 1,
        stagger: 0.3,
        ease: "power2.out",
        delay: 0.2,
    });

}; 
const cursor = document.getElementById('cursor');

      document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
          duration: 0.3,
          x: e.clientX,
          y: e.clientY,
          ease: "slow.out"
        });
      });